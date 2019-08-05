/******************************************************************************
 *
 * MIT License
 *
 * Copyright (c) 2018 Benjamin Collins (kion @ dashgl.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *****************************************************************************/
"use strict";

THREE.DashLoader = function() {

	this.blocks = {
		"ATTR": [],
		"NAME": [],
		"BONE": [],
		"VERT": [],
		"TEX": [],
		"MAT": [],
		"FACE": [],
		"ANIM": []
	};

	this.attrs = {
		vertex_weight: false,
		uv_count: 0,
		vertex_normals: false,
		vertex_colors: false
	};

	this.names = {
		bone: [],
		tex: [],
		anim: []
	};

	this.bones = [];
	this.texList = [];
	this.matList = [];
	this.geometry = new THREE.Geometry();

}

THREE.DashLoader.prototype = {

	constructor: THREE.DashLoader,

	read: function(file) {

		return new Promise((resolve, reject) => {

			var reader = new FileReader();

			reader.onload = e => {

				let buffer = e.target.result;
				resolve(this.parse(buffer));

			}

			reader.readAsArrayBuffer(file);

		});

	},

	load: function(url) {

		return new Promise((resolve, reject) => {

			let ajax = new XMLHttpRequest();
			ajax.open("GET", url);
			ajax.responseType = "arraybuffer";
			ajax.send();

			ajax.onload = () => {
				resolve(this.parse(ajax.response));
			}

		});

	},

	parse: function(buffer) {


		this.view = new DataView(buffer);
		this.readHeader();
		this.readAttributes();
		this.readNames();
		this.readBones();
		
		this.readVertices();
		this.readTextures();
		this.readMaterials();
		this.readFaceGroups();
		this.readThreeAnimations();

		this.geometry.computeFaceNormals();

		let mesh;
		if (!this.bones.length) {
			mesh = new THREE.Mesh(this.geometry, this.matList);
		} else {
			mesh = new THREE.SkinnedMesh(this.geometry, this.matList);
			var armSkeleton = new THREE.Skeleton(this.bones);
			mesh.add(armSkeleton.bones[0]);
			mesh.bind(armSkeleton);
		}
		return mesh;

	},

	readMagic: function(ofs) {
		let magic = '';
		for (let i = 0; i < 4; i++) {

			let byte = this.view.getUint8(ofs + i);
			if (!byte) {
				continue;
			}

			magic += String.fromCharCode(byte);
		}

		return magic;
	},

	readHeader: function() {

		let magic = this.readMagic(0);
		let ofs = this.view.getUint32(4, true);
		let version = this.view.getUint32(8, true);
		let numBlocks = this.view.getUint32(12, true);

		if (magic !== "DMF") {
			throw new Error("Invalid DASH magic number");
		}

		if (version !== 1) {
			throw new Error("Invalid Dash version (not 1)");
		}

		for (let i = 0; i < numBlocks; i++) {

			magic = this.readMagic(ofs);

			let block = {
				type: magic
			};

			switch (magic) {
				case "ATTR":
					block.offset = this.view.getUint32(ofs + 4, true);
					block.num = this.view.getUint32(ofs + 12, true);
					break;
				case "NAME":
					block.offset = this.view.getUint32(ofs + 4, true);
					block.num = this.view.getUint32(ofs + 12, true);
					break;
				case "BONE":
					block.offset = this.view.getUint32(ofs + 4, true);
					block.num = this.view.getUint32(ofs + 12, true);
					break;
				case "VERT":
					block.offset = this.view.getUint32(ofs + 4, true);
					block.num = this.view.getUint32(ofs + 12, true);
					break;
				case "TEX":
					block.offset = this.view.getUint32(ofs + 4, true);
					block.tex_id = this.view.getUint32(ofs + 8, true);
					block.num = this.view.getUint32(ofs + 12, true);
					break;
				case "MAT":
					block.offset = this.view.getUint32(ofs + 4, true);
					block.mat_id = this.view.getUint32(ofs + 8, true);
					block.num = this.view.getUint32(ofs + 12, true);
					break;
				case "FACE":
					block.offset = this.view.getUint32(ofs + 4, true);
					block.mat_id = this.view.getUint32(ofs + 8, true);
					block.num = this.view.getUint32(ofs + 12, true);
					break;
				case "ANIM":
					block.offset = this.view.getUint32(ofs + 4, true);
					block.anim_id = this.view.getUint32(ofs + 8, true);
					block.num = this.view.getUint32(ofs + 12, true);
					break;
			}

			ofs += 16;

			if (!block.offset) {
				continue;
			}

			this.blocks[block.type].push(block);

		}

	},

	readAttributes: function() {

		if (!this.blocks["ATTR"].length) {
			return;
		}

		let attr_list = this.blocks["ATTR"][0];
		let ofs = attr_list.offset;
		let magic = this.readMagic(ofs);
		let length = this.view.getUint32(ofs + 4, true);

		if (magic !== "ATTR") {
			throw new Error("Invalid magic number for attributes");
		}

		ofs += 8;

		for (let i = 0; i < attr_list.num; i++) {

			let key = this.readMagic(ofs);
			let value = this.view.getUint32(ofs + 4, true);
			ofs += 8;

			switch (key) {
				case "VWGT":
					this.attrs.vertex_weight = value;
					break;
				case "UVCT":
					this.attrs.uv_count = value;
					for (let k = 0; k < value; k++) {
						this.geometry.faceVertexUvs[k] = [];
					}
					break;
				case "VNRM":
					this.attrs.vertex_normals = value;
					break;
				case "VCLR":
					this.attrs.vertex_colors = value;
					break;
			}


		}

	},

	readNames: function() {

		if (!this.blocks["NAME"].length) {
			return;
		}

		this.blocks["NAME"].forEach(name_list => {

			let ofs = name_list.offset;
			let magic = this.readMagic(ofs);
			let length = this.view.getUint32(ofs + 4, true);
			let type = this.readMagic(ofs + 8).toLowerCase();

			if (magic !== "NAME") {
				throw new Error("Invalid magic number for names");
			}


			ofs += 12;

			for (let i = 0; i < name_list.num; i++) {

				let char;
				let str = "";

				do {

					char = this.view.getUint8(ofs++);

					if (char === 0) {
						continue;
					}

					str += String.fromCharCode(char);

				} while (char !== 0);

				this.names[type].push(str);

			}

		});


	},

	readBones: function() {

		if (!this.blocks["BONE"].length) {
			return;
		}

		let bone_list = this.blocks["BONE"][0];

		let ofs = bone_list.offset;
		let magic = this.readMagic(ofs);
		let length = this.view.getUint32(ofs + 4, true);

		if (magic !== "BONE") {
			throw new Erro("Invalid magic number for bones");
		}

		ofs += 8;
		this.bones = new Array(bone_list.num);
		for (let i = 0; i < this.bones.length; i++) {

			let id = this.view.getInt16(ofs + 0, true);
			let parent_id = this.view.getInt16(ofs + 2, true);
			ofs += 4;

			let bone = new THREE.Bone();
			let matrix = new THREE.Matrix4();
			for (let k = 0; k < 16; k++) {
				matrix.elements[k] = this.view.getFloat32(ofs, true);
				ofs += 4;
			}

			bone.name = id;
			bone.applyMatrix(matrix);
			bone.updateMatrix();
			bone.updateMatrixWorld();

			if (this.bones[parent_id]) {
				this.bones[parent_id].add(bone);
				bone.updateMatrix();
				bone.updateMatrixWorld();
			}

			if (this.names.bone[id]) {
				bone.name = this.names.bone[id];
			}

			this.bones[id] = bone;
		}

	},

	readVertices: function() {

		if (!this.blocks["VERT"].length) {
			return;
		}

		let vert_list = this.blocks["VERT"][0];

		let ofs = vert_list.offset;
		let magic = this.readMagic(ofs);
		let length = this.view.getUint32(ofs + 4, true);

		if (magic !== "VERT") {
			throw new Error("Invalid magic number for vertex");
		}

		ofs += 8;
		for (let i = 0; i < vert_list.num; i++) {

			let vertex = new THREE.Vector3();
			vertex.x = this.view.getFloat32(ofs + 0, true);
			vertex.y = this.view.getFloat32(ofs + 4, true);
			vertex.z = this.view.getFloat32(ofs + 8, true);
			this.geometry.vertices.push(vertex);
			ofs += 12;

			if (!this.attrs.vertex_weight) {
				continue;
			}

			let indice = new THREE.Vector4();
			indice.x = this.view.getUint16(ofs + 0, true);
			indice.y = this.view.getUint16(ofs + 2, true);
			indice.z = this.view.getUint16(ofs + 4, true);
			indice.w = this.view.getUint16(ofs + 6, true);
			this.geometry.skinIndices.push(indice);
			ofs += 8;

			let weight = new THREE.Vector4();
			weight.x = this.view.getUint16(ofs + 0, true);
			weight.y = this.view.getUint16(ofs + 4, true);
			weight.z = this.view.getUint16(ofs + 8, true);
			weight.w = this.view.getUint16(ofs + 12, true);
			this.geometry.skinWeights.push(weight);
			ofs += 16;

		}


	},

	readTextures: function() {

		let mime = {
			"PNG": "data:image/PNG;base64,"
		};

		let tex_list = this.blocks["TEX"];

		for (let i = 0; i < tex_list.length; i++) {

			let type, len;
			let tex = tex_list[i];
			let ofs = tex.offset;

			let magic = this.readMagic(ofs);
			let length = this.view.getUint32(ofs + 4, true);

			if (magic !== "TEX") {
				throw new Error("Invalid magic number for texture");
			}

			this.texList[i] = new THREE.Texture();

			if (this.names.tex[i]) {
				this.texList[i].name = this.names.tex[i];
			}

			ofs += 8;
			for (let k = 0; k < tex.num; k++) {

				magic = this.readMagic(ofs);

				switch (magic) {
					case "TYPE":
						type = this.readMagic(ofs + 4);
						type = mime[type];
						break;
					case "LEN":
						len = this.view.getUint32(ofs + 4, true);
						break;
					case "FLPY":
						this.texList[i].flipY = this.view.getUint32(ofs + 4, true);
						break;
					case "WID":
						let width = this.view.getUint32(ofs + 4, true);
						break;
					case "HGT":
						let height = this.view.getUint32(ofs + 4, true);
						break;
					case "WRPS":
						this.texList[i].wrapS = this.view.getUint32(ofs + 4, true);
						break;
					case "WRPT":
						this.texList[i].wrapT = this.view.getUint32(ofs + 4, true);
						break;
					case "IMG":
						let str = "";
						for (let j = 0; j < len; j++) {
							str += String.fromCharCode(this.view.getUint8(ofs + 4 + j));
						}

						str = "data:image/png;base64," + btoa(str);
						console.log("Making image from binary data");

						let image = new Image();
						image.src = str;
						image.onload = function() {
							this.needsUpdate = true;
						}.bind(this.texList[i]);

						this.texList[i].image = image;

						break;
				}
				ofs += 8;

			}

		}


	},

	readMaterials: function() {

		let mat_list = this.blocks["MAT"];

		for (let i = 0; i < mat_list.length; i++) {

			this.matList[i] = new THREE.MeshBasicMaterial();

			let ofs = mat_list[i].offset;

			if (this.bones.length) {
				this.matList[i].skinning = true;
			}

			let magic = this.readMagic(ofs);
			let len = this.view.getUint32(ofs + 4, true);
			ofs += 8;

			if (magic !== "MAT") {
				throw new Error("Invalid magic number for material");
			}

			for (let k = 0; k < mat_list[i].num; k++) {

				magic = this.readMagic(ofs);

				switch (magic) {
					case "TYPE":

						ofs += 4;
						let str = "";

						for (let j = 0; j < 12; j++) {
							let char = this.view.getUint8(ofs + j);

							if (char === 0) {
								break;
							}

							str += String.fromCharCode(char);
						}

						ofs += 12;

						break;
					case "DIFF":
						let r = this.view.getFloat32(ofs + 4, true);
						let g = this.view.getFloat32(ofs + 8, true);
						let b = this.view.getFloat32(ofs + 12, true);
						this.matList[i].color = new THREE.Color(r, g, b);
						ofs += 16;
						break;
					case "MAP":
						let map = this.view.getUint32(ofs + 4, true);
						this.matList[i].map = this.texList[map];
						ofs += 8;
						break;
					case "OPAC":
						let opacity = this.view.getFloat32(ofs + 4, true);
						//this.matList[i].opacity = opacity;
						ofs += 8;
						break;
					case "ALPT":
						let alphaTest = this.view.getFloat32(ofs + 4, true);
						this.matList[i].alphaTest = alphaTest || 0.01;
						ofs += 8;
						break;
					case "VCLR":
						let vertexColors = this.view.getUint32(ofs + 4, true);
						this.matList[i].vertexColors = vertexColors;
						ofs += 8;
						break;
					case "SIDE":
						let side = this.view.getUint32(ofs + 4, true);
						this.matList[i].side = side;
						ofs += 8;
						break;
					case "TRNS":
						let transparent = this.view.getUint32(ofs + 4, true);
						this.matList[i].transparent = transparent;
						ofs += 8;
						break;
					case "SKIN":
						let skinning = this.view.getUint32(ofs + 4, true);
						this.matList[i].skinning = skinning;
						ofs += 8;
						break;
				}

			}

		}


	},

	readFaceGroups: function() {

		let keys = ['a', 'b', 'c'];
		let face_list = this.blocks["FACE"];

		face_list.forEach(group => {

			let face, num, uv_list;
			let mat_id = group.mat_id;

			let ofs = group.offset;
			let magic = this.readMagic(ofs);
			let length = this.view.getUint32(ofs + 4, true);

			if (magic !== "FACE") {
				throw new Error("Invalid magic number for face");
			}

			ofs += 8;

			for (let i = 0; i < group.num; i++) {

				num = i % 3;
				if (num === 0) {

					face = new THREE.Face3();
					face.materialIndex = mat_id;

					uv_list = [];

					for (let k = 0; k < this.attrs.uv_count; k++) {
						uv_list[k] = [];
					}

				}

				let len = this.geometry.faces.length;
				let key = keys[num];
				let index = this.view.getUint16(ofs, true);
				ofs += 2;
				face[key] = index;

				for (let k = 0; k < this.attrs.uv_count; k++) {
					let u = this.view.getFloat32(ofs + 0, true);
					let v = this.view.getFloat32(ofs + 4, true);
					let uv = new THREE.Vector2(u, v);
					uv_list[k].push(uv);
					ofs += 8;
				}

				if (this.attrs.vertex_normals) {
					let x = this.view.getFloat32(ofs + 0, true);
					let y = this.view.getFloat32(ofs + 4, true);
					let z = this.view.getFloat32(ofs + 8, true);
					let norm = new THREE.Vector3(x, y, z);
					face.vertexNormals[num] = norm;
					ofs += 12;
				}

				if (this.attrs.vertex_colors) {
					let r = this.view.getFloat32(ofs + 0, true);
					let g = this.view.getFloat32(ofs + 4, true);
					let b = this.view.getFloat32(ofs + 8, true);
					let color = new THREE.Color(r, g, b);
					face.vertexColors[num] = color;
					ofs += 12;
				}

				// Add to face list

				if (num === 2) {

					this.geometry.faces.push(face);

					for (let k = 0; k < this.attrs.uv_count; k++) {
						this.geometry.faceVertexUvs[k].push(uv_list[k]);
					}

				}

			}

		});

	},

	readThreeAnimations: function() {

		if (this.blocks["ANIM"].length) {
			this.geometry.animations = [];
		}

		for (let i = 0; i < this.blocks["ANIM"].length; i++) {

			let anim_block = this.blocks["ANIM"][i];

			let ofs = anim_block.offset;
			let magic = this.readMagic(ofs);
			let len = this.view.getUint32(ofs + 4, true);
			let length = this.view.getFloat32(ofs + 8, true);
			ofs += 12;

			if (magic !== "ANIM") {
				throw new Error("Invalid magic number for animations");
			}

			var animation = {
				name: this.names.anim[i],
				fps: 30,
				length: length,
				hierarchy: new Array(this.bones.length)
			}

			for (let k = 0; k < animation.hierarchy.length; k++) {
				let parent = this.view.getInt32(ofs, true);
				let num_keys = this.view.getUint32(ofs + 4, true);
				ofs += 8;

				animation.hierarchy[k] = {
					parent: parent,
					keys: new Array(num_keys)
				}

				for (let j = 0; j < num_keys; j++) {

					let time = this.view.getFloat32(ofs, true);
					ofs += 4;

					let prs = this.readMagic(ofs);
					ofs += 4;

					let frame = {
						time: time
					}

					if (prs.indexOf('p') !== -1) {
						frame.pos = new Array(3);
						frame.pos[0] = this.view.getFloat32(ofs + 0, true);
						frame.pos[1] = this.view.getFloat32(ofs + 4, true);
						frame.pos[2] = this.view.getFloat32(ofs + 8, true);
						ofs += 12;
					}

					if (prs.indexOf('r') !== -1) {
						frame.rot = new Array(4);
						frame.rot[0] = this.view.getFloat32(ofs + 0, true);
						frame.rot[1] = this.view.getFloat32(ofs + 4, true);
						frame.rot[2] = this.view.getFloat32(ofs + 8, true);
						frame.rot[3] = this.view.getFloat32(ofs + 12, true);
						ofs += 16;
					}

					if (prs.indexOf('s') !== -1) {
						frame.scl = new Array(3);
						frame.scl[0] = this.view.getFloat32(ofs + 0, true);
						frame.scl[1] = this.view.getFloat32(ofs + 4, true);
						frame.scl[2] = this.view.getFloat32(ofs + 8, true);
						ofs += 12;
					}

					animation.hierarchy[k].keys[j] = frame;

				}

			};

			var clip = THREE.AnimationClip.parseAnimation(animation, this.bones);
			clip.optimize();
			this.geometry.animations.push(clip);

		}

	},


	readMatrixAnimations: function() {

		if (this.blocks["ANIM"].length) {
			this.geometry.animations = [];
		}

		for (let i = 0; i < this.blocks["ANIM"].length; i++) {

			let anim_block = this.blocks["ANIM"][i];

			let ofs = anim_block.offset;
			let magic = this.readMagic(ofs);
			let len = this.view.getUint32(ofs + 4, true);
			let length = this.view.getFloat32(ofs + 8, true);
			ofs += 12;

			if (magic !== "ANIM") {
				throw new Error("Invalid magic number for animations");
			}

			var animation = {
				name: this.names.anim[i],
				fps: 30,
				length: length,
				hierarchy: new Array(this.bones.length)
			}

			for (let k = 0; k < animation.hierarchy.length; k++) {
				let parent = this.view.getInt32(ofs, true);
				let num_keys = this.view.getUint32(ofs + 4, true);
				ofs += 8;

				animation.hierarchy[k] = {
					parent: parent,
					keys: new Array(num_keys)
				}

				for (let j = 0; j < num_keys; j++) {

					let time = this.view.getFloat32(ofs, true);
					let elements = new Array(16);
					ofs += 4;

					for (let l = 0; l < elements.length; l++) {
						elements[l] = this.view.getFloat32(ofs, true);
						ofs += 4;
					}

					let mtx = new THREE.Matrix4();
					mtx.fromArray(elements);

					let pos = new THREE.Vector3();
					let rot = new THREE.Quaternion();
					let scl = new THREE.Vector3();
					mtx.decompose(pos, rot, scl);

					animation.hierarchy[k].keys[j] = {
						time: time,
						pos: pos.toArray(),
						rot: rot.toArray(),
						scl: scl.toArray()
					};


				}

			};

			var clip = THREE.AnimationClip.parseAnimation(animation, this.bones);
			clip.optimize();
			this.geometry.animations.push(clip);


			break;
		}

	}

}
