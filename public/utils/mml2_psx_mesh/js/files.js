/*-----------------------------------------------------------------------------

	DashGL Model Viewer 2 Copyright 2018 DashGL Project 

    DashGL Model Viewer is free software: you can redistribute it and/or modify 
	it under the terms of the GNU General Public License as published by the 
	Free Software Foundation, either version 3 of the License, or (at your 
	option) any later version.

    DashGL Model Viewer 2 is distributed in the hope that it will be useful, but
	WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
	or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for 
	more details.

    You should have received a copy of the GNU General Public License along with
	DashGL Model Viewer. If not, see http://www.gnu.org/licenses/.

------------------------------------------------------------------------------*/

(function() {

	"use strict";

	const SCALE = 1 / 20;
	const ROT_MAGNITUDE = [
		90, 180, 360, 720
	];

	var face_flags = 0;

	const db = new Dexie("mml2_files");
	db.version(1).stores({"files":"&name"});

	var files = document.getElementById("files");
	var back = document.getElementById("back");

	populate_sidebar();

	// Save binary files to IndexedDB on File Input Change

	files.addEventListener("change", function(evt) {

		async.eachSeries(evt.target.files, function (file, nextFile) {

			var reader = new FileReader();

			reader.onload = function (e) {

				var buffer = e.target.result;
			
				db.files.put({
					"name": file.name,
					"data": buffer
				});

				nextFile();
			}

			reader.readAsArrayBuffer(file);

		}, function() {

			populate_sidebar();

		});

	});

	// Move back to Archive List from Asset List

	back.addEventListener("click", function() {
	
		asset_list.classList.remove("open");
		archive_list.classList.remove("hide");

	});

	// Create Archive List and Replace

	function populate_sidebar() {
	
		var archive_list = document.getElementById("archive_list");
		var ul = document.createElement("ul");

		db.files.each(function (file) {
			
			if(!file || !file.data) {
				console.error("File doesn't exist???!!");
				return;
			}
			
			if(file.data.__proto__.constructor !== ArrayBuffer) {
				console.error("Data is not a valid datview object!!??");
				console.error(file);
				console.error("----------------------");
				return;
			}

			var view = new DataView(file.data);
			var type = view.getUint32(0, true);
			
			// Check for magic number scene

			if(type !== 0x0a) {
				return;
			}
		
			// Check number of models in scene

			var nb = view.getUint32(0x30, true);
		
			// Look for binary flag, not supported

			if(nb & 0x80000000) {
				return;
			} else if(nb & 0x40000000) {
				return;
			}

			// Add new list item element for archive

			var li = document.createElement("li");
			li.textContent = file.name;
			li.addEventListener("click",archive_file_callback);
			ul.appendChild(li);

		}).then(function() {
		
			archive_list.replaceChild(ul, archive_list.children[0]);

		});

	}

	// Callback for clicking on an Archive List Item

	function archive_file_callback() {

		var asset_list = document.getElementById("asset_list");
		var archive_list = document.getElementById("archive_list");
	
		var model_list = document.getElementById("model_list");
		var ul = document.createElement("ul");

		var archive_file_name = document.getElementById("archive_file_name");
		archive_file_name.textContent = this.textContent;

		var query = {"name":this.textContent};
	
		db.files.get(query).then(function(file) {
			
			var view = new DataView(file.data);
			var file_len = view.getUint32(0x04, true);
			var nb_models = view.getUint32(0x30, true);
			
			var ofs = 0x34;

			for(var i = 0; i < nb_models; i++) {
				
				var offset = 0x34 + (i*0x10);
				var args = {
					"flags" : view.getUint32(offset + 0, true),
					"mesh" : view.getUint32(offset + 4, true),
					"anim_tracks" : view.getUint32(offset + 8, true),
					"anim_control" : view.getUint32(offset + 12, true)
				};
				
				args.mesh += 0x30;

				if(args.anim_tracks) {
					args.anim_tracks += 0x30;
				}

				if(args.anim_control) {
					args.anim_control += 0x30;
				}

				var li = document.createElement("li");
				li.textContent = args.flags.toString(16);
				ul.appendChild(li);
				var callback = asset_file_callback.bind(null, view, args);
				li.addEventListener("click", callback);
				
			}


		}).then(function() {
			
			// Switch to asset list after reading header

			model_list.replaceChild(ul, model_list.children[0]);
			asset_list.classList.add("open");
			archive_list.classList.add("hide");
	
		});

	}

	// Parse Model and Display

	function asset_file_callback(view, args) {

		// Parse Mesh
		
		face_flags = 0;

		// Reference Chiz Notes: https://mlt.bleh.ca/wiki/doku.php?id=mml2:x1

		var mesh_ofs = args.mesh;
		var primitive_count = {
			"high_lod" : view.getUint8(mesh_ofs + 0x0),
			"med_lod" : view.getUint8(mesh_ofs + 0x1),
			"low_lod" : view.getUint8(mesh_ofs + 0x2),
			"unknown" : view.getUint8(mesh_ofs + 0x3),
		};

		var mesh_pointers = {
			"high_lod" : view.getUint32(mesh_ofs + 0x4, true) + 0x30,
			"med_lod" : view.getUint32(mesh_ofs + 0x8, true) + 0x30,
			"low_lod" : view.getUint32(mesh_ofs + 0xc, true) + 0x30
		};

		var bone_ofs = view.getUint32(mesh_ofs + 0x10, true);
		var hierarchy_ofs = view.getUint32(mesh_ofs + 0x14, true);
		var texture_ofs = view.getUint32(mesh_ofs + 0x18, true);
		var bounding_ofs = view.getUint32(mesh_ofs + 0x1c, true);

		var nb_texture = (bounding_ofs - texture_ofs) / 4;

		// If bones, load skinned mesh, otherwise normal mesh
		
		var bones, hierarchy, anims;
		if(bone_ofs) {
			var nb_bones = Math.floor((hierarchy_ofs - bone_ofs) / 6);
			var nb_segments =  (texture_ofs - hierarchy_ofs) / 4;

			// Read the Bones

			bones = new Array(nb_bones);
			var ofs = bone_ofs + 0x30;
			for(var i = 0; i < nb_bones; i++) {
				bones[i] = new THREE.Bone();
				bones[i].name = i;

				var x = view.getInt16(ofs + (i*6) + 0, true);
				var y = view.getInt16(ofs + (i*6) + 2, true);
				var z = view.getInt16(ofs + (i*6) + 4, true);

				if(i === 0) {
					continue;
				}
				
				bones[i].position.x = x * SCALE;
				bones[i].position.y = y * SCALE * -1;
				bones[i].position.z = z * SCALE;

				bones[i].updateMatrix();
			}


			// Read the hierarchy
			
			hierarchy = new Array(nb_segments);
			var ofs = hierarchy_ofs + 0x30;
			for(var i = 0; i < nb_segments; i++) {
				
				var polygon = view.getUint8(ofs + 0);
				var parent = view.getUint8(ofs + 1);
				var child = view.getUint8(ofs + 2);
				var flags = view.getUint8(ofs + 3);
				ofs += 4;
				
				hierarchy[i] = bones[child];

				if(polygon === 0) {
					continue;
				}
				
				if(flags === 0x80) {
					hierarchy[i] = null;
				}

				if(!bones[child].parent && child !== parent) {
					bones[parent].add(bones[child]);
				}

			}
			
			// Update all of the bone would matrix positions

			for(var i = 0; i < bones.length; i++) {
				bones[i].updateMatrix();
				bones[i].updateMatrixWorld();
			}

		}

		var nb_prim = primitive_count.high_lod;
		var mesh_ofs = mesh_pointers.high_lod;
		parse_model(view, nb_prim, mesh_ofs, bones, hierarchy, args);

	}

	function parse_model(view, nb_prim, mesh_ofs, bones, hierarchy, mdl) {

		var prim_list = [];
		for(var n = 0; n < nb_prim; n++) {
			
			if(hierarchy && !hierarchy[n]) {
				continue;
			}

			var prim = {
				"nb_tri": view.getUint8(mesh_ofs + (n*0x10) + 0x00),
				"nb_quad": view.getUint8(mesh_ofs + (n*0x10) + 0x01),
				"nb_vert": view.getUint8(mesh_ofs + (n*0x10) + 0x02),
				"scale": view.getInt8(mesh_ofs + (n*0x10) + 0x03),
				"tri_ofs": view.getUint32(mesh_ofs + (n*0x10) + 0x04, true),
				"quad_ofs": view.getUint32(mesh_ofs + (n*0x10) + 0x08, true),
				"vert_ofs": view.getUint32(mesh_ofs + (n*0x10) + 0x0c, true)
			};

			if(bones) {
				prim.bone = hierarchy[n];
			}

			if(prim.scale === -1) {
				prim.scale = 0.5;
			} else {
				prim.scale = 1 << prim.scale;
			}
			
			prim.tri_ofs += 0x30;
			prim.quad_ofs += 0x30;
			prim.vert_ofs += 0x30;

			prim_list.push(prim);
		}
	
		const FACE_MASK = 0b1111111;
		const VERTEX_MASK = 0b1111111111;
		const VERTEX_MSB = 0b1000000000;
		const VERTEX_LOW = 0b0111111111;

		var vertices = [];
		var faces = [];
		var vertex_ofs = 0;

		var geometry = new THREE.Geometry();

		prim_list.forEach(function(prim) {
			
			// Read Triangle Faces

			var ofs = prim.tri_ofs;
			for (var i = 0; i < prim.nb_tri; i++) {
				var dword = view.getUint32(ofs + 8, true);
				var a = (dword & FACE_MASK) + vertex_ofs;
				var b = ((dword >> 7) & FACE_MASK) + vertex_ofs;
				var c = ((dword >> 14) & FACE_MASK) + vertex_ofs;
				var d = ((dword >> 21) & FACE_MASK) + vertex_ofs;
				var e = dword >> 28 & 0b1111;
				face_flags |= e;
				ofs += 0x0c;
				geometry.faces.push(new THREE.Face3(a, b, c));
				geometry.faces.push(new THREE.Face3(b, a, c));
			}

			// Read Quad Faces (and convert to Triangles)

			var ofs = prim.quad_ofs;
			for (var i = 0; i < prim.nb_quad; i++) {
				var dword = view.getUint32(ofs + 8, true);
				var a = (dword & FACE_MASK) + vertex_ofs;
				var b = ((dword >> 7) & FACE_MASK) + vertex_ofs;
				var c = ((dword >> 14) & FACE_MASK) + vertex_ofs;
				var d = ((dword >> 21) & FACE_MASK) + vertex_ofs;
				var e = dword >> 28 & 0b1111;
				face_flags |= e;
				ofs += 0x0c;
				geometry.faces.push(new THREE.Face3(a, b, c));
				geometry.faces.push(new THREE.Face3(b, d, c));
				geometry.faces.push(new THREE.Face3(b, a, c));
				geometry.faces.push(new THREE.Face3(d, b, c));

			}

			// Read Vertex List
			
			var ofs = prim.vert_ofs;
			for (var i = 0; i < prim.nb_vert; i++) {
				var dword = view.getUint32(ofs, true);
				ofs += 4;

				var x = dword & VERTEX_MASK;
				var y = (dword >> 10) & VERTEX_MASK;
				var z = (dword >> 20) & VERTEX_MASK;

				if (x & VERTEX_MSB) {
					x = (VERTEX_MSB - (x & VERTEX_LOW)) * -1;
				}

				if (y & VERTEX_MSB) {
					y = (VERTEX_MSB - (y & VERTEX_LOW)) * -1;
				}

				if (z & VERTEX_MSB) {
					z = (VERTEX_MSB - (z & VERTEX_LOW)) * -1;
				}
				
				x *= SCALE * prim.scale;
				y *= SCALE * prim.scale * -1;
				z *= SCALE * prim.scale;
				
				var vertex = new THREE.Vector3(x, y, z);
				if(prim.bone) {
					vertex.applyMatrix4(prim.bone.matrixWorld);
					var indice = new THREE.Vector4(prim.bone.name, 0, 0, 0);
					var weight = new THREE.Vector4(1.0, 0, 0, 0)
					geometry.skinIndices.push(indice);
					geometry.skinWeights.push(weight);
				}
				geometry.vertices.push(vertex);

			}
			
			vertex_ofs += prim.nb_vert;
		});
		
		console.log(face_flags.toString(16));
		geometry.computeFaceNormals();

		if(!bones) {
			window.set_active_mesh(geometry, null, null);
			return;
		}

		// Create Skeleton

		var armSkeleton = new THREE.Skeleton(bones);
		for (var i = 0; i < armSkeleton.bones.length; i++) {
			armSkeleton.bones[i].name = i.toString();
		}

		if(!mdl.anim_control) {
			window.set_active_mesh(geometry, armSkeleton, null);
			return;
		}

		// Prepare animation list

		geometry.animations = [];

		// Get List of animation controls

		var controls = [];
		var first_control_ofs = view.getUint32(mdl.anim_control, true) + 0x30;
		for(var ofs = mdl.anim_control; ofs < first_control_ofs; ofs += 4) {
			controls.push(view.getUint32(ofs, true) + 0x30);
		}

		// Get List of animation tracks

		var tracks = [];
		var first_track_ofs = view.getUint32(mdl.anim_tracks, true) + 0x30;
		for(var ofs = mdl.anim_tracks; ofs < first_track_ofs; ofs += 4) {
			tracks.push(view.getUint32(ofs, true) + 0x30);
		}

		// Loop though the list of controls

		controls.forEach(function(control_ofs) {
			
			var anim_track = view.getUint8(control_ofs + 0);
			var anim_len = view.getUint8(control_ofs + 1);

			if(anim_len === 1) {
				return;
			}

			var track_ofs = tracks[anim_track];
			var stride = (armSkeleton.bones.length + 1) * 4;
			
			var animation = {
				"name": null,
				"fps": 30,
				"length": (anim_len - 1) / 30,
				"hierarchy": []
			};

			for(var k = 0; k < armSkeleton.bones.length; k++) {
				animation.hierarchy.push({
					"parent": k - 1,
					"keys": []
				});
			}

			for(var i = 0; i < anim_len; i++) {

				control_ofs += 4;
				var track_stride = view.getUint8(control_ofs);

				var ofs = track_ofs + (stride * track_stride);

				// Get Position

				var dword = view.getUint32(ofs, true);
				ofs += 4;
				
				var x_pos = dword & VERTEX_MASK;
				var y_pos = (dword >> 10) & VERTEX_MASK;
				var z_pos = (dword >> 20) & VERTEX_MASK;
				var m_pos = (dword >> 30) & 0b11;
				
				var root_pos = [0,0,0];

				// Get Rotation for each bone

				for(var k = 0; k < armSkeleton.bones.length; k++) {

					var dword = view.getUint32(ofs, true);
					ofs += 4;

					var x = dword & VERTEX_MASK;
					var y = (dword >> 10) & VERTEX_MASK;
					var z = (dword >> 20) & VERTEX_MASK;
					var w = (dword >> 30) & 0b11;

					var x_pos = (x & 0x200) / 0x3ff;
					var y_pos = -(y & 0x200) / 0x3ff;
					var z_pos = (z & 0x200) / 0x3ff;
					
					var x_neg = -(x & 0x1ff) / 0x3ff;
					var y_neg = (y & 0x1ff) / 0x3ff;
					var z_neg = -(z & 0x1ff) / 0x3ff;
					
					var mag = ROT_MAGNITUDE[w];

					var rot = {
						"x" : (x_pos + x_neg)*mag,
						"y" : (y_pos + y_neg)*mag,
						"z" : (z_pos + z_neg)*mag
					};
					
					var e = new THREE.Euler(
						rot.x * Math.PI / 180,
						rot.y * Math.PI / 180,
						rot.z * Math.PI / 180
					);
					
					var q = new THREE.Quaternion();
					q.setFromEuler(e);

					var key = {
						"time" : i / 30,
						"rot" : q.toArray(),
						"scl" : [1,1,1]
					};
					
					if (k === 0) {
						key.pos = root_pos;
					} else {
						key.pos = [
							armSkeleton.bones[k].position.x,
							armSkeleton.bones[k].position.y,
							armSkeleton.bones[k].position.z
						];
					}

					animation.hierarchy[k].keys.push(key);

				}
				
				// End rotation

			}
			
			var clip = THREE.AnimationClip.parseAnimation(animation, armSkeleton.bones);
			if (!clip) {
				return console.error("Invalid clip detected");
			}
			
			clip.optimize();
			geometry.animations.push(clip);

		});

		// Display the parsed model

		window.set_active_mesh(geometry, armSkeleton, null);
	}


})();
