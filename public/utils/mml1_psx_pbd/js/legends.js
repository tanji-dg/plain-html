/*-----------------------------------------------------------------------------

    Copyright 2018 DashGL Project

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

------------------------------------------------------------------------------*/

"use strict";

function LegendsArchive (file) {

	this.name = file.name;
	this.buffer = file.data;
	this.view = new DataView(this.buffer);
	this.files = [];
	this.meshes = [];
	this.images = [];

}

LegendsArchive.prototype = {

	constructor : LegendsArchive,

	parse : function(canvas) {

		let texture = new THREE.Texture(canvas);
		texture.flipY = false;
		texture.needsUpdate = true;

		this.material = new THREE.MeshBasicMaterial({
			map : texture
		});

		this.readFileNames();

		for(let i = 0; i < this.files.length; i++) {
				
			this.view = new DataView(this.buffer);
					
			switch(this.files[i].extension) {
			case 'PBD':
				if(this.files[i].type === 0) {
					this.readPlayerBinaryData(this.files[i]);
				}
			}
		
		}
		
		return this.meshes;

	},

	readTextureImageMap : function(file) {

		let ofs = file.offset;
		let inc = 1;
		let block_width = 64;
		let block_height = 32;
		
		this.view = new DataView(this.buffer, file.offset);
		
		let tim = {
			pallet_x : this.view.getUint32(0x0c, true),
			pallet_y : this.view.getUint32(0x10, true),
			nb_colors : this.view.getUint32(0x14, true),
			nb_pallet : this.view.getUint32(0x18, true),
			image_x : this.view.getUint32(0x1c, true),
			image_y : this.view.getUint32(0x20, true),
			width : this.view.getUint32(0x24, true),
			height : this.view.getUint32(0x28, true)
		}

		if(tim.width === 0) {
			return;
		}

		switch(tim.nb_colors) {
		case 16:
			tim.width *= 4;
			inc *= 2;
			block_width *= 2;
			break;
		case 256:
			tim.width *= 2;
			break;
		}

		tim.pallet = new Array(tim.nb_colors);
		ofs = 0x100;

		for(let i = 0; i < tim.nb_colors; i++) {
			tim.pallet[i] = this.view.getUint16(ofs, true);
			ofs += 2;
		}

		this.view = new DataView(this.buffer, file.offset + 0x800);
		let image_body = new Array(tim.width * tim.height);
		ofs = 0;

		for(let y = 0; y < tim.height; y += block_height) {
			for(let x = 0; x < tim.width; x += block_width) {
				for(let by = 0; by < block_height; by++) {
					for(let bx = 0; bx < block_width; bx += inc) {
						
						let byte = this.view.getUint8(ofs++);
						let pos;

						switch(tim.nb_colors) {
						case 16:
							
							pos = ((y + by) * tim.width) + (x + bx);
							image_body[pos] = tim.pallet[byte & 0xf];
							pos = ((y + by) * tim.width) + (x + bx + 1);
							image_body[pos] = tim.pallet[byte >> 4];

							break;
						case 256:
							
							pos = ((y + by) * tim.width) + (x + bx);
							image_body[pos] = tim.pallet[byte];

							break;

						}
					}
				}
			}
		}

		let canvas = document.createElement('canvas');
		canvas.width = 256;
		canvas.height = 256;
		let ctx = canvas.getContext('2d');

		ofs = 0;
		for(let y = 0; y < tim.height; y++) {
			
			for(let x = 0; x < tim.width; x++) {
				let r = ((image_body[ofs] >> 0x00) & 0x1f) << 3;
				let g = ((image_body[ofs] >> 0x05) & 0x1f) << 3;
				let b = ((image_body[ofs] >> 0x0a) & 0x1f) << 3;
				let a = image_body[ofs] > 0 ? 1 : 0;
				ctx.fillStyle = "rgba("+r+","+g+","+b+","+a+")";
				ctx.fillRect(x, y, 1, 1);
				ofs++;
			}

		}
		
		let url = canvas.toDataURL();

		this.images.push({
			name : file.filename,
			data : url
		});

	},

	readFileNames : function() {

		// Iterate over the file and find all of the names

		for(let ofs = 0; ofs < this.buffer.byteLength; ofs += 0x400) {
			
			let type = this.view.getInt32(ofs, true);

			if(type === -1) {
				break;
			}

			let dots = this.view.getUint16(ofs + 0x40, true);
			if(dots !== 0x2e2e) {
				continue;
			}
			
			let str = '';
			for(let k = 0; k < 0x20; k++) {
				let ch = this.view.getUint8(ofs + 0x40 + k);
				str += String.fromCharCode(ch);
			}
			
			str = str.replace(/\0/g, '');

			if(str.indexOf("S.PBD") !== -1) {
				continue;
			} else if(str.indexOf("M.PBD") !== -1) {
				continue;
			}

			let filename = str;

			let ext = str.split('.').pop();

			switch(ext) {
			case 'PBD':
				this.files.push({
					type : type,
					offset : ofs,
					filename : filename,
					extension : ext
				});
				break;
			case 'TIM':
				this.files.push({
					type : type,
					offset : ofs,
					filename : filename,
					extension : ext
				});
				break;
			case 'bin':
			case 'vab':
				continue;
				break;
			default:
				console.log('Unhandled extension: %s', ext);
				break;
			}
		}

	},

	readPlayerBinaryData : function(file) {

		let length = this.view.getUint32(file.offset + 4, true);
		let type = this.view.getUint32(file.offset + 8, true);
		let memory = this.view.getUint32(file.offset + 12, true);

		this.geometry = new THREE.Geometry();

		this.view = new DataView(this.buffer, file.offset + 0x800);

		let endOfs = this.view.getUint32(4, true);
		
		if(!(endOfs & 0x80000000)) {
			return;
		}

		endOfs -= memory;
		let strips = [];

		for(let ofs = 0; ofs < endOfs; ofs += 16) {
			strips.push({
				nbTri : this.view.getUint8(ofs + 0),
				nbQuad : this.view.getUint8(ofs + 1),
				nbVert : this.view.getUint8(ofs + 2),
				boneId : this.view.getUint8(ofs + 3),
				triOfs : this.view.getUint32(ofs + 4, true) - memory,
				quadOfs : this.view.getUint32(ofs + 8, true) - memory,
				vertOfs : this.view.getUint32(ofs + 12, true) - memory
			});
		}
	
		this.vertexOfs = 0;

		

		strips.forEach( strip => {
			
			this.limit = this.vertexOfs + strip.nbVert;
			this.readVertexList(strip.nbVert, strip.vertOfs);
			this.readTriList(strip.nbTri, strip.triOfs);
			this.readQuadList(strip.nbQuad, strip.quadOfs);
			this.vertexOfs += strip.nbVert;

		});


		this.geometry.computeFaceNormals();
		let mesh = new THREE.Mesh(this.geometry, this.material);
		this.meshes.push(mesh);

		delete this.geometry;
		delete this.vertexOfs;

		
	},

	readTriList : function(nbFace, ofs) {

		if(ofs < 0) {
			return;
		}

		let uv = new Array(3);

		for(let i = 0; i < nbFace; i++) {
			
			ofs += 40;
			
			for(let k = 0; k < uv.length; k++) {
				ofs += 4;
				uv[k] = new THREE.Vector2(
					this.view.getUint8(ofs + 0) / 255,
					this.view.getUint8(ofs + 1) / 255
				);
				ofs += 4;
			}
			
			let a = this.view.getUint8(ofs + 0) + this.vertexOfs;
			let b = this.view.getUint8(ofs + 1) + this.vertexOfs;
			let c = this.view.getUint8(ofs + 2) + this.vertexOfs;
			ofs += 4;
			
			this.geometry.faces.push(new THREE.Face3(a, b, c));
			this.geometry.faceVertexUvs[0].push([uv[0], uv[1], uv[2]]);

		}


	},

	readQuadList : function(nbFace, ofs) {

		if(ofs < 0) {
			return;
		}

		let uv = new Array(4);

		for(let i = 0; i < nbFace; i++) {
			
			ofs += 48;
			
			for(let k = 0; k < uv.length; k++) {
				ofs += 4;
				uv[k] = new THREE.Vector2(
					this.view.getUint8(ofs + 0) / 255,
					this.view.getUint8(ofs + 1) / 255
				);
				ofs += 4;
			}
			
			let a = this.view.getUint8(ofs + 0) + this.vertexOfs;
			let b = this.view.getUint8(ofs + 1) + this.vertexOfs;
			let c = this.view.getUint8(ofs + 2) + this.vertexOfs;
			let d = this.view.getUint8(ofs + 3) + this.vertexOfs;
			ofs += 4;
			
			this.geometry.faces.push(new THREE.Face3(a, b, c));
			this.geometry.faces.push(new THREE.Face3(b, d, c));
			this.geometry.faceVertexUvs[0].push([uv[0], uv[1], uv[2]]);
			this.geometry.faceVertexUvs[0].push([uv[1], uv[3], uv[2]]);

		}


	},

	readVertexList : function(nbVert, ofs) {

		let matrix = new THREE.Matrix4();
		matrix.makeScale(1/20, -1/20, 1/20);

		for(let i = 0; i < nbVert; i++) {
			
			let vertex = new THREE.Vector3();
			vertex.x = this.view.getInt16(ofs + 0, true);
			vertex.y = this.view.getInt16(ofs + 2, true);
			vertex.z = this.view.getInt16(ofs + 4, true);
			ofs += 8;
			vertex.applyMatrix4(matrix);
			this.geometry.vertices.push(vertex);

		}

	}

}
