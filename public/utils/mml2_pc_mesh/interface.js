/*------------------------------------------------------------------------------

	MML2 PC Mesh Viewer Copyright 2018 DashGL Project 

	MML2 PC Mesh Viewer is free software: you can redistribute it and/or modify 
	it under the terms of the GNU General Public License as published by the 
	Free Software Foundation, either version 3 of the License, or (at your 
	option) any later version.

	MML2 PC Mesh Viewer is distributed in the hope that it will be useful, but
	WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
	or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for 
	more details.

	You should have received a copy of the GNU General Public License along with
	MML2 PC Mesh Viewer. If not, see http://www.gnu.org/licenses/.

------------------------------------------------------------------------------*/


(function() {

	"use strict";

	var gb_face_mask = 0;
	var active_file_li;
	var active_asset_li;
	var gb_model;

	const db = new Dexie("mml2_pc_mesh");
	db.version(1).stores({"files":"&name"});

	const MML_SCALE = 0.05;
	const MML_LOD = "high_lod";

	const ROT_MAGNITUDE = [
		90, 180, 360, 720
	];

	const MML_TEXTURE = {
		"ST00.DAT" : "ST00T.DAT",
		"ST0F.DAT" : "ST0FT.DAT",
		"ST01.DAT" : "ST01T.DAT",
		"ST02.DAT" : "ST02T.DAT",
		"ST0201.DAT" : "ST02T.DAT",
		"ST0202.DAT" : "ST02T.DAT",
		"ST0203.DAT" : "ST02T.DAT",
		"ST03.DAT" : "ST03T.DAT",
		"ST0301.DAT" : "ST03T.DAT",
		"ST0302.DAT" : "ST03T.DAT",
		"ST0303.DAT" : "ST0303.DAT",
		"ST0304.DAT" : "ST03T.DAT",
		"ST0305.DAT" : "ST03T.DAT",
		"ST04.DAT" : "ST04T.DAT",
		"ST05.DAT" : "ST05T.DAT",
		"ST06.DAT" : "ST06T.DAT",
		"ST07.DAT" : "ST07T.DAT",
		"ST08.DAT" : "ST08T.DAT",
		"ST09.DAT" : "ST09T.DAT",
		"ST0A.DAT" : "ST0AT.DAT",
		"ST0B.DAT" : "ST0BT.DAT",
		"ST0C.DAT" : "ST0CT.DAT",
		"ST0D.DAT" : "ST0DT.DAT",
		"ST0D01.DAT" : "ST0DT.DAT",
		"ST0E.DAT" : "ST0ET.DAT",
		"ST0E01.DAT" : "ST0E01T.DAT",
		"ST0E02.DAT" : "ST0E02T.DAT",
		"ST0F00.DAT" : "ST0FT.DAT",
		"ST0F01.DAT" : "ST0FT.DAT",
		"ST10.DAT" : "ST10T.DAT",
		"ST11.DAT" : "ST11T.DAT",
		"ST1102.DAT" : "ST11T.DAT",
		"ST12.DAT" : "ST12T.DAT",
		"ST1200.DAT" : "ST12T.DAT",
		"ST1201.DAT" : "ST12T.DAT",
		"ST13.DAT" : "ST13T.DAT",
		"ST1300.DAT" : "ST13T.DAT",
		"ST1301.DAT" : "ST13T.DAT",
		"ST1302.DAT" : "ST13T.DAT",
		"ST14.DAT" : "ST14T.DAT",
		"ST1400.DAT" : "ST14T.DAT",
		"ST1401.DAT" : "ST14T.DAT",
		"ST15.DAT" : "ST15T.DAT",
		"ST16.DAT" : "ST16T.DAT",
		"ST17.DAT" : "ST17T.DAT",
		"ST1700.DAT" : "ST17T.DAT",
		"ST1701.DAT" : "ST17T.DAT",
		"ST1702.DAT" : "ST17T.DAT",
		"ST1703.DAT" : "ST1703T.DAT",
		"ST1704.DAT" : "ST1704T.DAT",
		"ST1705.DAT" : "ST1706T.DAT",
		"ST18.DAT" : "ST18T.DAT",
		"ST1800.DAT" : "ST18T.DAT",
		"ST1801.DAT" : "ST18T.DAT",
		"ST1802.DAT" : "ST1802T.DAT",
		"ST1803.DAT" : "ST1804T.DAT",
		"ST19.DAT" : "ST19T.DAT",
		"ST1900.DAT" : "ST19T.DAT",
		"ST1901.DAT" : "ST19T.DAT",
		"ST1902.DAT" : "ST1902T.DAT",
		"ST1A.DAT" : "ST1AT.DAT",
		"ST1A01.DAT" : "ST1A01T.DAT",
		"ST1B.DAT" : "ST1BT.DAT",
		"ST1B01.DAT" : "ST1B01T.DAT",
		"ST1C.DAT" : "ST1CT.DAT",
		"ST1C01.DAT" : "ST1CT.DAT",
		"ST1C02.DAT" : "ST1CT.DAT",
		"ST1D.DAT" : "ST1DT.DAT",
		"ST1D01.DAT" : "ST1DT.DAT",
		"ST1D02.DAT" : "ST1DT.DAT",
		"ST1E.DAT" : "ST1ET.DAT",
		"ST1F.DAT" : "ST1FT.DAT",
		"ST1F01.DAT" : "ST1F01T.DAT",
		"ST1F02.DAT" : "ST1F02T.DAT",
		"ST20.DAT" : "ST20T.DAT",
		"ST21.DAT" : "ST21T.DAT",
		"ST22.DAT" : "ST22T.DAT",
		"ST23.DAT" : "ST23T.DAT",
		"ST24.DAT" : "ST24T.DAT",
		"ST25.DAT" : "ST25T.DAT",
		"ST2501.DAT" : "ST25T.DAT",
		"ST2502.DAT" : "ST2502T.DAT",
		"ST2503.DAT" : "ST2502T.DAT",
		"ST26.DAT" : "ST26T.DAT",
		"ST2601.DAT" : "ST26T.DAT",
		"ST27.DAT" : "ST27T.DAT",
		"ST2701.DAT" : "ST27T.DAT",
		"ST28.DAT" : "ST28T.DAT",
		"ST2801.DAT" : "ST28T.DAT",
		"ST2802.DAT" : "ST28T.DAT",
		"ST29.DAT" : "ST29T.DAT",
		"ST2901.DAT" : "ST2901T.DAT",
		"ST2A.DAT" : "ST2AT.DAT",
		"ST2B.DAT" : "ST2BT.DAT",
		"ST2C.DAT" : "ST2CT.DAT",
		"ST2D.DAT" : "ST2DT.DAT",
		"ST2E.DAT" : "ST2ET.DAT",
		"ST2F.DAT" : "ST2FT.DAT",
		"ST2F00.DAT" : "ST2FT.DAT",
		"ST2F01.DAT" : "ST2FT.DAT",
		"ST30.DAT" : "ST30T.DAT",
		"ST3001.DAT" : "ST3001T.DAT",
		"ST31.DAT" : "ST31T.DAT",
		"ST32.DAT" : "ST32T.DAT",
		"ST33.DAT" : "ST33T.DAT",
		"ST3301.DAT" : "ST3302T.DAT",
		"ST34.DAT" : "ST34T.DAT",
		"ST35.DAT" : "ST35T.DAT",
		"ST3501.DAT" : "ST3501T.DAT",
		"ST3502.DAT" : "ST35T.DAT",
		"ST36.DAT" : "ST36T.DAT",
		"ST37.DAT" : "ST37T.DAT",
		"ST38.DAT" : "ST38T.DAT",
		"ST39.DAT" : "ST39T.DAT",
		"ST3901.DAT" : "ST3901T.DAT",
		"ST3A.DAT" : "ST3AT.DAT",
		"ST3A01.DAT" : "ST3AT.DAT",
		"ST3A02.DAT" : "ST3AT.DAT",
		"ST3B.DAT" : "ST3BT.DAT",
		"ST3C.DAT" : "ST3CT.DAT",
		"ST3C00.DAT" : "ST3CT.DAT",
		"ST3C01.DAT" : "ST3C01T.DAT",
		"ST3C02.DAT" : "ST3C01T.DAT",
		"ST3D.DAT" : "ST3DT.DAT",
		"ST3F.DAT" : "ST3FT.DAT",
		"ST40.DAT" : "ST40T.DAT",
		"ST41.DAT" : "ST41T.DAT",
		"ST42.DAT" : "ST42T.DAT",
		"ST43.DAT" : "ST43T.DAT",
		"ST44.DAT" : "ST44T.DAT",
		"ST45.DAT" : "ST45T.DAT",
		"ST46.DAT" : "ST46T.DAT",
		"ST47.DAT" : "ST47T.DAT",
		"ST48.DAT" : "ST48T.DAT",
		"ST49.DAT" : "ST49T.DAT",
		"ST4A.DAT" : "ST4AT.DAT",
		"ST4B.DAT" : "ST4BT.DAT",
		"ST4B01.DAT" : "ST4BT.DAT",
		"ST4B02.DAT" : "ST4BT.DAT",
		"ST4C.DAT" : "ST4CT.DAT",
		"ST4D.DAT" : "ST4DT.DAT",
		"ST4E.DAT" : "ST4ET.DAT",
		"ST4F.DAT" : "ST4FT.DAT",
		"ST50.DAT" : "ST50T.DAT",
		"ST51.DAT" : "ST51T.DAT",
		"ST52.DAT" : "ST52T.DAT",
		"ST5201.DAT" : "ST52T.DAT",
		"ST53.DAT" : "ST53T.DAT",
		"ST5301.DAT" : "ST5301T.DAT",
		"ST5302.DAT" : "ST5302T.DAT",
		"ST5303.DAT" : "ST53T.DAT",
		"ST54.DAT" : "ST54T.DAT",
		"ST55.DAT" : "ST55T.DAT",
		"ST56.DAT" : "ST56T.DAT",
		"ST57.DAT" : "ST57T.DAT",
		"ST58.DAT" : "ST58T.DAT",
		"ST59.DAT" : "ST59T.DAT",
		"ST5A.DAT" : "ST5AT.DAT",
		"ST5B.DAT" : "ST5BT.DAT",
		"ST5C.DAT" : "ST5CT.DAT",
		"ST5C01.DAT" : "ST5CT.DAT"
	};

	var li = document.getElementsByClassName("file");
	for(var i = 0; i < li.length; i++) {
		li[i].addEventListener("click", file_click_callback);
	}
	
	var files = document.getElementById("files");
	var span = document.getElementsByClassName("import");
	for(var i = 0; i < span.length; i++) {
		span[i].addEventListener("click", import_file_click);
	}

	var about_toggle = document.getElementById("about-toggle");
	about_toggle.addEventListener("click", function(evt) {
		
		var target = evt.target;
		var popup = document.getElementById("about-popup");

		while(target !== this) {
			if(target === popup) {
				return;
			}
			target = target.parentNode;
		}

		popup.classList.toggle("open");

	});

	function import_file_click() {
		files.click();
	}
	
	var select = document.getElementById("tex-select");
	select.addEventListener("change", function(evt) {
		
		var file = gb_model.file;
		var flags = gb_model.flags.toString(16);
		//var pelect = document.getElementById("pal-select");
		
		var json = {};
		var str = localStorage.getItem(file);
		if(str) {
			json = JSON.parse(str);
		}

		if(json[flags]) {
			json[flags].image = this.value;
		} else {
			json[flags] = {
				"image" : this.value,
				"pallet" : this.value
			}
		}

		localStorage.setItem(file, JSON.stringify(json));

		model_click_callback(gb_model);

	});

	var db_tex = document.getElementById("debug_texture");
	db_tex.addEventListener("change", function() {
		
		model_click_callback(gb_model);

	});

	files.addEventListener("change", function(evt) {

		async.eachSeries(evt.target.files, function (file, nextFile) {

			var reader = new FileReader();

			reader.onload = function(e) {
				
				db.files.put({
					"name" : file.name,
					"data" : e.target.result
				});

				nextFile();

			}

			reader.readAsArrayBuffer(file);

		}, function() {
			
			aside_read_files();

		});

	});

	aside_read_files();
	function aside_read_files() {
		
		var total_files = 0;
		var message = document.getElementById("message");
		var reading = document.getElementById("reading");
		var div = document.createElement("div");
		
		var select = document.getElementById("tex-select");
		//var pelect = document.getElementById("pal-select");

		db.files.each(function (file) {
			
			reading.removeAttribute("style");

			total_files++;

			var li = document.createElement("li");
			li.setAttribute("class", "file");
			li.addEventListener("click", file_click_callback);

			var table = document.createElement("table");

			var row = table.insertRow();
			var name = row.insertCell();
			name.setAttribute("class", "name");
			name.textContent = file.name;
			
			var opt = document.createElement("option");
			opt.textContent = file.name;
			opt.setAttribute("value", file.name);
			select.appendChild(opt);
			
			/*
			var opt = document.createElement("option");
			opt.textContent = file.name;
			opt.setAttribute("value", file.name);
			pelect.appendChild(opt);
			*/

			var spin = row.insertCell();
			spin.setAttribute("class", "spin");

			var img = document.createElement("img");
			img.setAttribute("src", "img/45.gif");
			img.style.display = "none";
			spin.appendChild(img);

			li.appendChild(table);
			div.appendChild(li);
			
			var ul = document.createElement("ul");
			div.appendChild(ul);

		}).then(function() {
			
			reading.style.display = "none";

			if(!total_files) {
				message.removeAttribute("style");
				return;
			}
			
			message.style.display = "none";
			
			var list = document.getElementById("list");
			list.parentNode.replaceChild(div, list);
			div.setAttribute("id", "list");

		}).catch(function(err) {
			throw err;
		});

	}

	function file_click_callback() {
	
		// Close

		if(this.classList.contains("active")) {
			this.nextSibling.classList.remove("open");
			this.classList.remove("active");
			active_file_li = null;
			return;
		}

		// Set Active

		this.classList.add("active");

		// If data has been loaded open

		if(this.getAttribute("data-loaded")) {
			this.nextSibling.classList.add("open");
			return;
		}
		
		// Show Loading

		var img = this.getElementsByTagName("img")[0];
		img.classList.add("block");

		var ul = this.nextSibling;
		ul.setAttribute("data-file", this.textContent);

		db.files.get({
			"name" : this.textContent
		}).then(file => {

			var fp = new DataView(file.data);

			var assets = [];
			var asset_ofs = 0x800;

			for(var ofs = 0; ofs < 0x800; ofs += 0x10) {
				
				var asset = {
					"magic_number" : fp.getUint32(ofs + 0x00, true),
					"length" : fp.getUint32(ofs + 0x04, true),
					"parameter_a" : fp.getUint32(ofs + 0x08, true),
					"parameter_b" : fp.getUint32(ofs + 0x0c, true),
					"offset" : asset_ofs,
					"file_pointer" : fp
				};
				
				if(asset.magic_number > 9 || asset.length === 0) {
					continue;
				}

				assets.push(asset);
				asset_ofs += asset.length;

			}
			
			var pallet_list = [];

			var model_count = 0;
			var image_count = 0;
			assets.forEach(function(asset) {
				
				var callback;
				switch(asset.magic_number) {
				case 0:

					break;
				case 1:
					// Model Data
					
					var buffer = asset.file_pointer.buffer;
					var offset = asset.offset;
					var length = asset.length;
					
					var fp = new DataView(buffer, offset, length);
					var nb_model = fp.getUint32(0, true);

					var ofs = 4;
					for(var i = 0; i < nb_model; i++) {

						var li = document.createElement("li");
						var base = ofs + (i*16);

						var model = {
							"flags" : fp.getUint32(base + 0, true),
							"mesh" : fp.getUint32(base + 4, true),
							"anim_tracks" : fp.getUint32(base + 8, true),
							"anim_control" : fp.getUint32(base + 12, true),
							"file_pointer" : fp,
							"file" : file.name
						};

						var str = i.toString();
						while(str.length < 3) {
							str = "0" + str;
						}
						li.textContent = "model_" + str;
						var callback = model_click_callback.bind(li, model);
						li.addEventListener("click", callback);
						li.setAttribute("class", "asset");
						ul.appendChild(li);

					}

					break;
				case 3:

					var fp = asset.file_pointer;
					var ofs = asset.offset;
					var pallet_x = fp.getUint16(ofs + 4, true);
					var pallet_y = fp.getUint16(ofs + 6, true);
					
					//Pallet data
					break;
				case 4:
					// Image data

					var fp = asset.file_pointer;
					var ofs = asset.offset;
					var pallet_x = fp.getUint16(ofs + 4, true);
					var pallet_y = fp.getUint16(ofs + 6, true);
					
					pallet_list.push({
						"pallet_x" : pallet_x,
						"pallet_y" : pallet_y
					});

					var li = document.createElement("li");
					li.setAttribute("class", "asset");
					var str = image_count.toString();
					while(str.length < 3) {
						str = "0" + str;
					}
					li.textContent = "image_" + str;
					image_count++;
					var callback = image_click_callback.bind(li, asset);
					li.addEventListener("click", callback);
					ul.appendChild(li);

					break;
				case 5:
					// Color & Image Data
					break;
				}
				

			});
			

			this.setAttribute("data-loaded", "true");
			img.classList.remove("block");
			ul.classList.add("open");

		});

	}

	/**************************************************************************
	 * Image Asset Click Callback                                             *
	 **************************************************************************/

	function image_click_callback(asset) {
		
		var select = document.getElementById("tex-select");
		select.setAttribute("disabled", "disabled");

		/*
		var pelect = document.getElementById("pal-select");
		pelect.style.display = "none";
		*/

		if(active_asset_li) {
			active_asset_li.classList.remove("active");
		}

		active_asset_li = this;
		active_asset_li.classList.add("active");

		var fp = asset.file_pointer;
		var ofs = asset.offset;

		// Read Pallet

		var pallet_len = fp.getUint32(ofs + 0, true);
		var pallet_x = fp.getUint16(ofs + 4, true);
		var pallet_y = fp.getUint16(ofs + 6, true);
		var pallet_colors = fp.getUint16(ofs + 8, true);
		var pallet_count = fp.getUint16(ofs + 10, true);

		ofs += 0x0c;
		pallet_len -= 0x0c;
		pallet_len /= 2;
		var pallet = new Array(pallet_len);

		for(var i = 0; i < pallet_len; i++) {
			var color = fp.getUint16(ofs, true);

			var r = ((color >> 0x00) & 0x1f) << 3;
			var g = ((color >> 0x05) & 0x1f) << 3;
			var b = ((color >> 0x0a) & 0x1f) << 3;
			var a = color >> 0x0f;
			
			if(color > 0) {
				a = 1.0;
			} else {
				a = 0.0;
			}

			pallet[i] = "rgba("+r+","+g+","+b+","+a+")";
			ofs += 2;
		}

		// Determine Bytes Per Pixel

		var bpp;
		
		if(pallet_colors === 256) {
			bpp = 8;
		} else {
			bpp = 4;
		}

		// Read Image

		var image_len = fp.getUint32(ofs + 0, true);
		var image_x = fp.getUint16(ofs + 4, true);
		var image_y = fp.getUint16(ofs + 6, true);
		var image_width = fp.getUint16(ofs + 8, true) * 2;
		var image_height = fp.getUint16(ofs + 10, true);

		ofs += 0x0c;
		image_len -= 0x0c;

		// Determine Dimensions

		var bytes_per_row = image_len / image_height;
		
		if(bpp === 4) {
			image_width *= 2;
		}

		var meta = document.getElementById("meta");
		meta.innerHTML = "";
		meta.appendChild(document.createTextNode("Width: " + image_width));
		meta.appendChild(document.createElement("br"));
		meta.appendChild(document.createTextNode("Height: " + image_height));
		meta.appendChild(document.createElement("br"));
		meta.appendChild(document.createTextNode("Bytes per Pixel: " + bpp));
		meta.appendChild(document.createElement("br"));
		meta.appendChild(document.createTextNode("Framebuffer Image: " + image_x + "," + image_y));
		meta.appendChild(document.createElement("br"));
		meta.appendChild(document.createTextNode("Framebuffer Pallet: " + pallet_x + "," + pallet_y));
		meta.appendChild(document.createElement("br"));
		meta.appendChild(document.createTextNode("Offset 0x: " + asset.offset.toString(16)));
		meta.appendChild(document.createElement("br"));

		// Draw to Canvas

		var canvas = document.createElement("canvas");
		canvas.width = image_width;
		canvas.height = image_height;
		var ctx = canvas.getContext("2d");

		var image_body = new Array();
		
		for(var i = 0; i < image_len; i++) {
			
			var byte = fp.getUint8(ofs + i);

			if(bpp === 8) {
				image_body.push(pallet[byte]);
			} else if(bpp == 4) {
				image_body.push(pallet[(byte & 0xf)]);
				image_body.push(pallet[(byte >> 4)]);
			}

		}

		var i = 0;
		for(var y = 0; y < image_height; y++) {
			for(var x = 0; x < image_width; x++) {
				var color = image_body[i];
				ctx.fillStyle = color;
				ctx.fillRect(x, y, 1, 1);
				i++;
			}
		}

        // Debug draw to plane geometry

        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        var geometry = new THREE.PlaneGeometry(canvas.width, canvas.height);
        var material = new THREE.MeshPhongMaterial({
            "side" : THREE.DoubleSide,
            "map" : texture
        });
        var plane = new THREE.Mesh( geometry, material );
        window.append_mesh(plane);

		var ul = document.getElementById("export-textures");
		ul.innerHTML = "";
		
		ul.appendChild(canvas);
	}

	function load_file(name) {
		
		return new Promise(function(resolve, reject) {

			db.files.get({
				"name" : name
			}).then(function(file) {
				resolve(file)
			}).catch(function(err) {
				reject(null);
			});

		});

	}

	async function model_click_callback(model, evt) {
		
		var select = document.getElementById("tex-select");
		select.removeAttribute("disabled");

		/*
		var pelect = document.getElementById("pal-select");
		pelect.style.display = "block";
		*/

		if(evt) {
			if(active_asset_li) {
				active_asset_li.classList.remove("active");
			}
			
			active_asset_li = this; 
			active_asset_li.classList.add("active");
		}

		var ofs = model.mesh;
		var fp = model.file_pointer;

		// Start parsing mesh

		var primitive_count = {
			"high_lod" : fp.getUint8(ofs + 0),
			"med_lod" : fp.getUint8(ofs + 1),
			"low_lod" : fp.getUint8(ofs + 2),
			"nb_textures" : fp.getUint8(ofs + 3)
		};

		var header = {
			"high_lod" : fp.getUint32(ofs + 0x04, true),
			"med_lod" : fp.getUint32(ofs + 0x08, true),
			"low_lod" : fp.getUint32(ofs + 0x0c, true),
			"bone_ofs" : fp.getUint32(ofs + 0x10, true),
			"hierarchy_ofs" : fp.getUint32(ofs + 0x14, true),
			"texture_ofs" : fp.getUint32(ofs + 0x18, true),
			"bounding_box" : fp.getUint32(ofs + 0x1c, true),
			"brightness_ofs" : fp.getUint32(ofs + 0x20, true)
		};

		var bones, hierarchy;
		var min_v_coord = 255;

		if(header.bone_ofs) {
			
			// Read bones

			var len = header.hierarchy_ofs - header.bone_ofs;
			var nb_bones = Math.floor(len / 6);
			bones = new Array(nb_bones);

			ofs = header.bone_ofs;
			for(var i = 0; i < nb_bones; i++) {
				bones[i] = new THREE.Bone();
				bones[i].name = i;
				
				var x = fp.getInt16(ofs + (i*6) + 0, true);
				var y = fp.getInt16(ofs + (i*6) + 2, true);
				var z = fp.getInt16(ofs + (i*6) + 4, true);
				
				bones[i].position.x = x * MML_SCALE;
				bones[i].position.y = y * MML_SCALE * -1;
				bones[i].position.z = z * MML_SCALE;
				
				bones[i].updateMatrix();
			}

			// Read Hierarchy

			ofs = header.hierarchy_ofs;
			var nb_segments =  (header.texture_ofs - header.hierarchy_ofs) / 4;
			hierarchy = new Array(nb_segments) || [];

			for(var i = 0; i < nb_segments; i++) {

				var polygon_no = fp.getUint8(ofs + (i*4) + 0);
				var parent_bone = fp.getUint8(ofs + (i*4) + 1);
				var child_bone = fp.getUint8(ofs + (i*4) + 2);
				var polygon_flags = fp.getUint8(ofs + (i*4) + 3);

				hierarchy[polygon_no] = bones[child_bone];

				if(polygon_no === 0) {
					continue;
				}

				if(polygon_flags === 0x80) {
					hierarchy[polygon_no] = null;
				}
				
				if(bones[child_bone].parent) {
					continue;
				}
				
				if(parent_bone === child_bone) {
					continue;
				}

				bones[parent_bone].add(bones[child_bone]);

			}

			for(var i = 0; i < bones.length; i++) {
				bones[i].updateMatrix();
				bones[i].updateMatrixWorld();
			}

		}

		// Read Primitives
		
		var nb_prim = primitive_count[MML_LOD];
		var prim_list = new Array();
		var ofs = header[MML_LOD];

		for(var i = 0; i < nb_prim; i++) {
			
			if(hierarchy && !hierarchy[i]) {
				continue;
			}
			
			var prim = {
				"nb_tri": fp.getUint8(ofs + (i*0x10) + 0x00),
				"nb_quad": fp.getUint8(ofs + (i*0x10) + 0x01),
				"nb_vert": fp.getUint8(ofs + (i*0x10) + 0x02),
				"scale": fp.getInt8(ofs + (i*0x10) + 0x03),
				"tri_ofs": fp.getUint32(ofs + (i*0x10) + 0x04, true),
				"quad_ofs": fp.getUint32(ofs + (i*0x10) + 0x08, true),
				"vert_ofs": fp.getUint32(ofs + (i*0x10) + 0x0c, true)
			};
			
			if(hierarchy) {
				prim.bone = hierarchy[i];
			}

			if(prim.scale === -1) {
				prim.scale = 0.5;
			} else {
				prim.scale = 1 << prim.scale;
			}

			prim_list.push(prim);

		}

		const FACE_MASK = 0b1111111;
		const VERTEX_MASK = 0b1111111111;
		const VERTEX_MSB = 0b1000000000;
		const VERTEX_LOW = 0b0111111111;
		
		var vertex_ofs = 0;
		var geometry = new THREE.Geometry();
		geometry.faceVertexUvs[0] = [];

		prim_list.forEach(function(prim) {
			
			// Read Triangle Faces

			var ofs = prim.tri_ofs;
			for (var i = 0; i < prim.nb_tri; i++) {
				
				var ua = fp.getUint8(ofs + 0);
				var va = fp.getUint8(ofs + 1);
				var ub = fp.getUint8(ofs + 2);
				var vb = fp.getUint8(ofs + 3);
				var uc = fp.getUint8(ofs + 4);
				var vc = fp.getUint8(ofs + 5);
				
				var dword = fp.getUint32(ofs + 8, true);
				var a = (dword & FACE_MASK) + vertex_ofs;
				var b = ((dword >> 7) & FACE_MASK) + vertex_ofs;
				var c = ((dword >> 14) & FACE_MASK) + vertex_ofs;
				var d = ((dword >> 21) & FACE_MASK) + vertex_ofs;
				var e = dword >> 28 & 0b1111;
				var mat_index = e & 0x3;
				
				let u_ofs = mat_index & 1 ? 256 : 0;
				let v_ofs = mat_index & 2 ? 256 : 0;

				var auv = new THREE.Vector2((ua+u_ofs)/511, (va+v_ofs)/511);
				var buv = new THREE.Vector2((ub+u_ofs)/511, (vb+v_ofs)/511);
				var cuv = new THREE.Vector2((uc+u_ofs)/511, (vc+v_ofs)/511);

				gb_face_mask = gb_face_mask | e;

				ofs += 0x0c;

				var face = new THREE.Face3(a, b, c);
				face.materialIndex = mat_index;
				geometry.faceVertexUvs[0][geometry.faces.length]=[auv,buv,cuv];
				geometry.faces.push(face);

			}

			// Read Quad Faces (and convert to Triangles)

			var ofs = prim.quad_ofs;
			for (var i = 0; i < prim.nb_quad; i++) {
				
				var ua = fp.getUint8(ofs + 0);
				var va = fp.getUint8(ofs + 1);
				var ub = fp.getUint8(ofs + 2);
				var vb = fp.getUint8(ofs + 3);
				var uc = fp.getUint8(ofs + 4);
				var vc = fp.getUint8(ofs + 5);
				var ud = fp.getUint8(ofs + 6);
				var vd = fp.getUint8(ofs + 7);
				
				var dword = fp.getUint32(ofs + 8, true);
				var a = (dword & FACE_MASK) + vertex_ofs;
				var b = ((dword >> 7) & FACE_MASK) + vertex_ofs;
				var c = ((dword >> 14) & FACE_MASK) + vertex_ofs;
				var d = ((dword >> 21) & FACE_MASK) + vertex_ofs;
				
				var e = dword >> 28 & 0b1111;
				gb_face_mask = gb_face_mask | e;
				var mat_index = e & 0x3;
				
				let u_ofs = mat_index & 1 ? 256 : 0;
				let v_ofs = mat_index & 2 ? 256 : 0;

				var auv = new THREE.Vector2((ua+u_ofs)/511, (va+v_ofs)/511);
				var buv = new THREE.Vector2((ub+u_ofs)/511, (vb+v_ofs)/511);
				var cuv = new THREE.Vector2((uc+u_ofs)/511, (vc+v_ofs)/511);
				var duv = new THREE.Vector2((ud+u_ofs)/511, (vd+v_ofs)/511);

				ofs += 0x0c;

				var face = new THREE.Face3(a, b, c);
				face.materialIndex = mat_index;
				geometry.faceVertexUvs[0][geometry.faces.length]=[auv,buv,cuv];
				geometry.faces.push(face);

				var face = new THREE.Face3(b, d, c);
				face.materialIndex = mat_index;
				geometry.faceVertexUvs[0][geometry.faces.length]=[buv,duv,cuv];
				geometry.faces.push(face);

			}

			// Read Vertex List
			
			var ofs = prim.vert_ofs;
			for (var i = 0; i < prim.nb_vert; i++) {
				var dword = fp.getUint32(ofs, true);
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
				
				x *= MML_SCALE * prim.scale;
				y *= MML_SCALE * prim.scale * -1;
				z *= MML_SCALE * prim.scale;
				
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
	
		geometry.computeFaceNormals();

		// Read Textures

		var end = header.bounding_box || header.brightness_ofs;
		var nb_texture = (end - header.texture_ofs) / 4;
		
		//nb_texture = nb_texture || 0;
		try {
			var texture_list = new Array(nb_texture);
		} catch(err) {
			console.error("nb_texture: %d", nb_texture);
			texture_list = [];
		}

		var meta = document.getElementById("meta");
		meta.innerHTML = "";

		ofs = header.texture_ofs;
		for(var i = 0; i < nb_texture; i++) {

			meta.appendChild(document.createElement("br"));
			meta.appendChild(document.createTextNode("Texture: " + i));
			meta.appendChild(document.createElement("br"));

			var image_coords = fp.getUint16(ofs + 0, true);
			var pallet_coords = fp.getUint16(ofs + 2, true);
			ofs += 4;
			
			var y_ofs = image_coords & 0x10 ? 256 : 0;
			texture_list[i] = {
				"image_x" : (image_coords & 0x0f) << 6,
				"image_y" : y_ofs,
				"pallet_x" : (pallet_coords & 0x3f) << 4,
				"pallet_y" : pallet_coords >> 6
			};

			meta.appendChild(document.createTextNode("Image x: " +texture_list[i].image_x + ", y:" + texture_list[i].image_y ));
			meta.appendChild(document.createElement("br"));

			meta.appendChild(document.createTextNode("Pallet x: " + texture_list[i].pallet_x + ", y:" + texture_list[i].pallet_y ));
			meta.appendChild(document.createElement("br"));

		}

		gb_model = model;

		var json = {};
		var str = localStorage.getItem(model.file);

		if(str) {
			json = JSON.parse(str);
		}
		
		var tx_file = MML_TEXTURE[model.file];
		var px_file = MML_TEXTURE[model.file];

		if(json[model.flags.toString(16)]) {
			tx_file = json[model.flags.toString(16)].image;
			px_file = json[model.flags.toString(16)].pallet;
		}

		select.value = tx_file;
		//pelect.value = px_file;

		var pallet_list = [];
		var image_list = [];

		var file = await load_file(px_file);
		var fp = new DataView(file.data);
		var pal_fp = fp;

		var asset_ofs = 0x800;
		for(var ofs = 0; ofs < 0x800; ofs += 0x10) {
				
			var asset = {
				"magic_number" : fp.getUint32(ofs + 0x00, true),
				"length" : fp.getUint32(ofs + 0x04, true),
				"parameter_a" : fp.getUint32(ofs + 0x08, true),
				"parameter_b" : fp.getUint32(ofs + 0x0c, true),
				"offset" : asset_ofs
			};
				
			if(asset.magic_number > 9 || asset.length === 0) {
				continue;
			}
				
			var save = ofs;

			if(asset.magic_number === 3) {

				var ofs = asset.offset;
				var pallet_x = fp.getUint16(ofs + 4, true);
				var pallet_y = fp.getUint16(ofs + 6, true);

				pallet_list.push({
					"pallet_x" : pallet_x,
					"pallet_y" : pallet_y,
					"offset" : ofs,
					"fp" : fp
				});

			} else if(asset.magic_number === 4) {

				var ofs = asset.offset;
				var pallet_x = fp.getUint16(ofs + 4, true);
				var pallet_y = fp.getUint16(ofs + 6, true);

				pallet_list.push({
					"pallet_x" : pallet_x,
					"pallet_y" : pallet_y,
					"offset" : ofs,
					"fp" : fp
				});
					
				var len = fp.getUint32(ofs, true);
				ofs += len;

				var image_x = fp.getUint16(ofs + 4, true);
				var image_y = fp.getUint16(ofs + 6, true);
				var image_width = fp.getUint16(ofs + 8, true) * 2;
				var image_height = fp.getUint16(ofs + 10, true);

				image_list.push({
					"image_x" : image_x,
					"image_y" : image_y,
					"image_width" : image_width,
					"image_height" : image_height,
					"offset" : ofs
				});

			}

			asset_ofs += asset.length;
			ofs = save;

		}

		var file = await load_file(tx_file);
		var fp = new DataView(file.data);
		var img_fp = fp;

		var asset_ofs = 0x800;
		for(var ofs = 0; ofs < 0x800; ofs += 0x10) {
				
			var asset = {
				"magic_number" : fp.getUint32(ofs + 0x00, true),
				"length" : fp.getUint32(ofs + 0x04, true),
				"parameter_a" : fp.getUint32(ofs + 0x08, true),
				"parameter_b" : fp.getUint32(ofs + 0x0c, true),
				"offset" : asset_ofs
			};
				
			if(asset.magic_number > 9 || asset.length === 0) {
				continue;
			}
				
			var save = ofs;

			if(asset.magic_number === 4) {

				var ofs = asset.offset;
				var len = fp.getUint32(ofs, true);
				ofs += len;

				var image_x = fp.getUint16(ofs + 4, true);
				var image_y = fp.getUint16(ofs + 6, true);
				var image_width = fp.getUint16(ofs + 8, true) * 2;
				var image_height = fp.getUint16(ofs + 10, true);
				
				image_list.push({
					"buffer" : fp,
					"image_x" : image_x,
					"image_y" : image_y,
					"image_width" : image_width,
					"image_height" : image_height,
					"offset" : ofs
				});

			}

			asset_ofs += asset.length;
			ofs = save;

		}
		
		var debug_texture = document.getElementById("debug_texture").checked;
		var sprite = document.createElement("canvas");
		sprite.width = 512;
		sprite.height = 512;
		var spx = sprite.getContext("2d");

		var mat_list = [];
		for(var i = 0; i < texture_list.length; i++) {

			if(debug_texture) {
				continue;
			}
				
			var canvas = document.createElement("canvas");
			canvas.width = 256;
			canvas.height = 256;
			var ctx = canvas.getContext("2d");
			
			var fp = pal_fp;
			var found = false;
			for(var k = 0; k < pallet_list.length; k++) {
					
				if(pallet_list[k].pallet_x !== texture_list[i].pallet_x) {
					continue;
				}
					
				if(pallet_list[k].pallet_y !== texture_list[i].pallet_y) {
					continue;
				}

				ofs = pallet_list[k].offset;

				found = true;
				break;
			}

			if(!found) {
				continue;
			}
	
			// First read the pallet

			var pallet_len = fp.getUint32(ofs + 0, true);
			var pallet_x = fp.getUint16(ofs + 4, true);
			var pallet_y = fp.getUint16(ofs + 6, true);
			var pallet_colors = fp.getUint16(ofs + 8, true);
			var pallet_count = fp.getUint16(ofs + 10, true);

			ofs += 0x0c;
			pallet_len -= 0x0c;
			pallet_len /= 2;
			var pallet = new Array(pallet_len);

			for(var k = 0; k < pallet_len; k++) {
				var color = fp.getUint16(ofs, true);

				var r = ((color >> 0x00) & 0x1f) << 3;
				var g = ((color >> 0x05) & 0x1f) << 3;
				var b = ((color >> 0x0a) & 0x1f) << 3;
				var a = color >> 0x0f;
			
				if(color > 0) {
					a = 1.0;
				} else {
					a = 0.0;
				}

				pallet[k] = "rgba("+r+","+g+","+b+","+a+")";
				ofs += 2;
			}

			// Determine Bytes Per Pixel

			var bpp;
		
			if(pallet_colors === 256) {
				bpp = 8;
			} else {
				bpp = 4;
			}
			
			var fp = img_fp;
			for(var k = 0; k < image_list.length; k++) {

				var x_ofs = image_list[k].image_x - texture_list[i].image_x;
				var y_ofs = image_list[k].image_y % 256;

				if(texture_list[i].image_y === 0 && image_list[k].image_y >= 256) {
					continue;
				} else if(texture_list[i].image_y === 256 && image_list[k].image_y < 256) {
					continue;
				}
				
				if(x_ofs > 64 || x_ofs < 0) {
					continue;
				}


				ofs = image_list[k].offset;

				// Read Image

				var image_len = fp.getUint32(ofs + 0, true);
				var image_x = fp.getUint16(ofs + 4, true);
				var image_y = fp.getUint16(ofs + 6, true);
				var image_width = fp.getUint16(ofs + 8, true) * 2;
				var image_height = fp.getUint16(ofs + 10, true);

				ofs += 0x0c;
				image_len -= 0x0c;

				// Determine Dimensions
		
				if(bpp === 4) {
					image_width *= 2;
				}

				if(image_width === 256 && image_height === 256) {
					canvas.setAttribute("data-fill", "true");
				}

				var image_body = new Array();
		
				for(var j = 0; j < image_len; j++) {
			
					var byte = fp.getUint8(ofs + j);

					if(bpp === 8) {
						image_body.push(pallet[byte]);
					} else if(bpp == 4) {
						image_body.push(pallet[(byte & 0xf)]);
						image_body.push(pallet[(byte >> 4)]);
					}

				}
				

				y_ofs = image_y % 256;
				x_ofs *= 4;
			
				var j = 0;
				for(var y = 0; y < image_height; y++) {
					for(var x = 0; x < image_width; x++) {
						var color = image_body[j];
						ctx.fillStyle = color;
						ctx.fillRect(x + x_ofs, y + y_ofs, 1, 1);
						j++;
					}
				}
				

			}

			x_ofs = i & 1 ? 256 : 0;
			y_ofs = i & 2 ? 256 : 0;
			spx.drawImage(canvas, x_ofs, y_ofs);
			sprite.dirty = true;

		}

		var texture = new THREE.Texture(sprite);
		texture.flipY = false;
		texture.needsUpdate = true;

		var mat = new THREE.MeshNormalMaterial({
			"skinning" : true
		});

		if(sprite.dirty) {
			mat = new THREE.MeshBasicMaterial({
				"color" : 0xffffff,
				"map" : texture,
				"alphaTest" : 0.01,
				"skinning" : true,
				"transparent" : true
			});
		}
		
		if(!bones) {
			var mesh = new THREE.Mesh(geometry, mat);
			mesh.name = model.flags.toString(16);
			mesh.rotation.y = Math.PI;
			window.append_mesh(mesh);
			return;
		}

		var armSkeleton = new THREE.Skeleton(bones);
		for (var i = 0; i < armSkeleton.bones.length; i++) {
			let num = i.toString();
			while(num.length < 3) {
				num = "0" + num;
			}
			armSkeleton.bones[i].name = "Bone"+num;
		}

		if(!model.anim_tracks) {
			var mesh = new THREE.SkinnedMesh(geometry, mat);
			mesh.isSkinnedMesh = true;
			mesh.name = model.flags.toString(16);
			mesh.add(armSkeleton.bones[0]);
			mesh.rotation.y = Math.PI;
			mesh.bind(armSkeleton);

			var helper = new THREE.SkeletonHelper(mesh);
			helper.material.linewidth = 3;
	
			window.append_mesh(mesh, helper);
			return;
		}

		var fp = model.file_pointer;
		geometry.animations = [];

		// Get List of animation controls

		var controls = [];
		var first_control_ofs = fp.getUint32(model.anim_control, true);
		for(var ofs = model.anim_control; ofs < first_control_ofs; ofs += 4) {
			controls.push(fp.getUint32(ofs, true));
		}

		// Get List of animation tracks

		var tracks = [];
		var first_track_ofs = fp.getUint32(model.anim_tracks, true);
		for(var ofs = model.anim_tracks; ofs < first_track_ofs; ofs += 4) {
			tracks.push(fp.getUint32(ofs, true));
		}

		// Loop though the list of controls

		controls.forEach(function(control_ofs) {
			
			var anim_track = fp.getUint8(control_ofs + 0);
			var anim_len = fp.getUint8(control_ofs + 1);

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
				var track_stride = fp.getUint8(control_ofs);

				var ofs = track_ofs + (stride * track_stride);

				// Get Position

				var dword = fp.getUint32(ofs, true);
				ofs += 4;
				
				var x_pos = dword & VERTEX_MASK;
				var y_pos = (dword >> 10) & VERTEX_MASK;
				var z_pos = (dword >> 20) & VERTEX_MASK;
				var m_pos = (dword >> 30) & 0b11;
				
				var root_pos = [0,0,0];

				// Get Rotation for each bone

				for(var k = 0; k < armSkeleton.bones.length; k++) {

					var dword = fp.getUint32(ofs, true);
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

		var mesh = new THREE.SkinnedMesh(geometry, mat);
		mesh.isSkinnedMesh = true;
		mesh.name = model.flags.toString(16);
		mesh.add(armSkeleton.bones[0]);
		mesh.rotation.y = Math.PI;
		mesh.bind(armSkeleton);

		var helper = new THREE.SkeletonHelper(mesh);
		helper.material.linewidth = 3;
	
		window.append_mesh(mesh, helper, true);

	}

	/**************************************************************************
	 * End Program                                                            *
	 **************************************************************************/

})();
