"use strict";

var camera, scene, renderer, mesh, controls, helper;
var db = new Dexie("mml_files");

db.version(1).stores({
	"files" : "&name"
});

db.open();
render_sidebar();

console.clear();

window.active_mat = null;

const MEMORY = {};
const SCALE = -0.05;
const LOOKUP = {
	"20" : {
		"name" : "ServBot"
	},
	"220" : {
		"name" : "Arukoitan"
	},
	"240" : {
		"name" : "Hanmuru Doll"
	},
	"320" : {
		"name" : "Horokko"
	},
	"420" : {
		"name" : "Shekuten"
	},
	"440" : {
		"name" : "Cannam"
	},
	"520" : {
		"name" : "Roll Caskett"
	},
	"2520" : {
		"name" : "Barrell Caskett"
	},
	"a20" : {
		"name" : "Futter"
	},
	"b20" : {
		"name" : "Gesellschaft"
	},
	"c60" : {
		"name" : "Drache"
	},
	"d20" : {
		"name" : "Osh"
	},
	"e20" : {
		"name" : "Orudakoitan"
	},
	"e60" : {
		"name" : "Police Car"
	},
	"f20" : {
		"name" : "Jim"
	},
	"1020" : {
		"name" : "Bird"
	},
	"1120" : {
		"name" : "Data the Monkey"
	},
	"1160" : {
		"name" : "Support Car"
	},
	"1320" : {
		"name" : "Junk Shop Owner"
	},
	"1360" : {
		"name" : "Mouse"
	},
	"1560" : {
		"name" : "Broken Support Car"
	},
	"1620" : {
		"name" : "Bensley"
	},
	"1920" : {
		"name" : "Mirumijee"
	},
	"1a60" : {
		"name" : "Foo-Roo"
	},
	"1f20" : {
		"name" : "Horokko (wall)"
	},
	"2420" : {
		"name" : "Police Man"
	},
	"2620" : {
		"name" : "Inspector"
	},
	"2820" : {
		"name" : "Tron Bonne"
	},
	"2a20" : {
		"name" : "Paprika the Dog"
	},
	"3320" : {
		"name" : "Leopold"
	},
	"3720" : {
		"name" : "Sharukurusu"
	},
	"38e0" : {
		"name" : "Junk"
	},
	"3b20" : {
		"name" : "Gun Battery"
	},
	"3520" : {
		"name" : "Chest"
	},
	"3d20" : {
		"name" : "Kuruguru"
	},
	"4320" : {
		"name" : "Gorubesshu"
	},
	"4b20" : {
		"name" : "Firushudot"
	},
	"1140" : {
		"name" : "Karumuna Bash 0"
	},
	"11140" : {
		"name" : "Karumuna Bash 1"
	},
	"21140" : {
		"name" : "Karumuna Bash 2"
	}
}

document.getElementById("canvas").addEventListener("click", function() {

	this.toBlob(function(blob) {
		let name = window.clut.name.replace("TIM", "PNG");
		name = name.substring(3);
		saveAs(blob, name);
	});

});

/*
document.getElementById("json_download").addEventListener("click", function() {

	if(!mesh) {
		return;
	}

	console.log(mesh);
	var g = mesh.geometry;
	var b = new THREE.BufferGeometry();
	b.fromGeometry(g);
	var n = new THREE.Mesh(b, mesh.material);
	console.log(n);
    var expt = new THREE.TypedGeometryExporter();
    var result = expt.parse(mesh);
	console.log(result);
		var output = JSON.stringify(result, null, "\t");
        var blob = new Blob([output], {type: "application/json"});
        saveAs(blob, mesh.name + '.gltf');



});
*/

document.getElementById("about").addEventListener("click", function() {

	var array = [
		"DashGL File Viewer by Kion",
		"Copyright 2018 GPLv3 License"
	];

	alert(array.join("\n"));

});

document.getElementById("mdl_tab").addEventListener("click", function() {

	document.getElementById("texture_list").classList.remove("active");
	document.getElementById("model_list").classList.add("active");
	document.getElementById("bone_list").classList.remove("active");

});

document.getElementById("tex_tab").addEventListener("click", function() {

	document.getElementById("texture_list").classList.add("active");
	document.getElementById("model_list").classList.remove("active");
	document.getElementById("bone_list").classList.remove("active");

});

document.getElementById("bone_tab").addEventListener("click", function() {

	document.getElementById("texture_list").classList.remove("active");
	document.getElementById("model_list").classList.remove("active");
	document.getElementById("bone_list").classList.add("active");

});

!function init () {

	var canvas = document.getElementsByClassName("pallet-canvas");
	for(var i = 0; i < canvas.length; i++) {
		canvas[i].setAttribute("data-id", i);
		canvas[i].addEventListener("click", pallet_select);
	}

	var close = document.getElementById("close");
	close.addEventListener("click", function() {
		var texture = document.getElementById("tim_preview");
		texture.classList.remove("active");
		window.active_mat = null;
	});

	var context = document.getElementById("context");
	var width = context.offsetWidth;
	var height = context.offsetHeight;
	camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 10000 );
	camera.position.z = 40;
	camera.position.y = 4;
	camera.lookAt(new THREE.Vector3(0,0,0));
	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( width, height );
	renderer.setClearColor( 0xeeeeee );
	controls = THREE.OrbitControls(camera, renderer.domElement);

	context.appendChild( renderer.domElement );
	renderer.domElement.style.margin = "0";
	renderer.domElement.style.padding = "0";

	var grid = new THREE.GridHelper(100, 10);
	scene.add(grid);
	
	var light = new THREE.AmbientLight( 0xd0d0d0 );
	scene.add( light );

	/*
	light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);
	*/

	animate();

}();

function animate() {

	requestAnimationFrame( animate );
	renderer.render( scene, camera );

}

var unload = document.getElementById("unload");
unload.addEventListener("click", function(evt) {

	for(var key in MEMORY) {
		unload_files(key);
	}

	var sidebar = document.getElementById("sidebar");

	for(var i = 0; i < sidebar.children.length; i++) {
		sidebar.children[i].classList.remove("loaded");
	}

});

var files = document.getElementById("files");
files.addEventListener("change", function(evt) {

	async.eachSeries(evt.target.files, function(file, nextFile) {
		var reader = new FileReader();

		reader.onload = function(e) {
			
			var array_buffer = e.target.result;
			var buffer = new Uint8Array(array_buffer);

			var query = {
				"name" : file.name,
				"data" : buffer
			};

			db.files.put(query);
			nextFile();

		}

		reader.readAsArrayBuffer(file);
		
	}, function() {
		
		render_sidebar();

	});

});

function render_sidebar() {
	
	var article = document.createElement("article");

	db.files.each(function(file) {
		
		var li = document.createElement("li");
		li.setAttribute("class", "archive");
		li.textContent = file.name;
		article.appendChild(li);
		li.addEventListener("click", archive_click);

	}).then(function() {
		
		var sidebar = document.getElementById("sidebar");
		sidebar.parentNode.replaceChild(article, sidebar);
		article.setAttribute("id", "sidebar");

	});
}

function archive_click() {

	if(this.classList.contains("loaded")) {
		this.classList.remove("loaded");
		unload_files(this.textContent);
	} else {
		this.classList.add("loaded");
		load_files(this.textContent);
	}

}

function load_files(name) {

	var query = {
		"name" : name
	};
	
	var loaded = document.getElementById("loaded");

	MEMORY[name] = {
		".TIM" : [],
		"CLUT" : [],
		".EBD" : [],
		".PBD" : []
	};

	db.files.where(query).first(file => {
		
		var fp = new EcmaBuffer(file.data);
		var ofs = 0;
		
		do {
			
			var str = fp.toString("ascii", ofs+0x40, ofs+0x60);
			var dot = str.lastIndexOf(".");
			var ext = str.substr(dot, 4);

			var li = document.createElement("li");
			li.setAttribute("data-file", name);
			li.textContent = str;
			li.setAttribute("data-file", name);

			switch(ext) {
				case ".TIM":
					
					var tim = {
						"offset" : ofs,
						"pallet_x" : fp.readUInt32LE(ofs + 0x0c),
						"pallet_y" : fp.readUInt32LE(ofs + 0x10),
						"nb_colors" : fp.readUInt32LE(ofs + 0x14),
						"nb_pallet" : fp.readUInt32LE(ofs + 0x18),
						"image_x" : fp.readUInt32LE(ofs + 0x1C),
						"image_y" : fp.readUInt32LE(ofs + 0x20),
						"width" : fp.readUInt32LE(ofs + 0x24),
						"height" : fp.readUInt32LE(ofs + 0x28),
						"name" : str,
						"file" : name
					};
					
					tim.pallet = new Array(tim.nb_pallet);
					
					var tmp = ofs + 0x100;
					for(var i = 0; i < tim.pallet.length; i++) {
						
						tim.pallet[i] = new Array(tim.nb_colors);

						for(var k = 0; k < tim.nb_colors; k++) {
							tim.pallet[i][k] = fp.readUInt16LE(tmp);
							tmp += 0x02;
						}

					}
					
					switch(tim.nb_colors) {
						case 16:
							tim.width *= 4;
						break;
						case 256:
							tim.width *= 2;
						break;
					}

					if(tim.width === 0) {
						MEMORY[name]["CLUT"].push(tim);
						continue;
					}

					MEMORY[name][ext].push(tim);
					li.addEventListener("click", tim_callback);

				break;
				case ".EBD":
					
					var ebd = {
						"offset" : ofs,
						"memory" : fp.readUInt32LE(ofs + 0x0c),
						"name" : str,
						"file" : name
					};

					MEMORY[name][ext].push(ebd);
					li.addEventListener("click", ebd_callback);;

				break;
				case ".PBD":

				break;
				default:
					continue;
				break;
			}
			loaded.appendChild(li);

		} while((ofs += 0x400) < fp.length);
		
	}).catch(function(err) {
		console.log(err);
	});

}

function unload_files(name) {

	var loaded = document.getElementById("loaded");
	var remove = [];
	delete MEMORY[name];

	for(var i = 0; i < loaded.children.length; i++) {
		
		var file = loaded.children[i].getAttribute("data-file");
		if(file !== name) {
			continue;
		}
		remove.push(loaded.children[i]);
	}

	remove.forEach(function(elem) {
		
		elem.parentNode.removeChild(elem);

	});

}

function tim_callback() {

	var tim;
	var name = this.textContent;
	var tim_list = MEMORY[this.getAttribute("data-file")][".TIM"];
	var clut_list = MEMORY[this.getAttribute("data-file")]["CLUT"];

	for(var i = 0; i < tim_list.length; i++) {
		
		if(tim_list[i].name !== this.textContent) {
			continue;
		}

		tim = tim_list[i];
		break;
	}

	if(!tim) {
		throw new Error("TIM file not found: " + this.textContent);
	}
	
	var elem = document.getElementById("tim_preview");
	elem.classList.add("active");
	
	var keys = [
		"pallet_x",
		"pallet_y",
		"nb_colors",
		"nb_pallet",
		"image_x",
		"image_y",
		"width",
		"height"
	];

	for(var i = 0; i < keys.length; i++) {
		var elem = document.getElementById(keys[i]);
		elem.textContent = tim[keys[i]];
	}

	var ctx;
	var canvas = document.getElementsByClassName("pallet-canvas");
	
	for(var i = 0; i < canvas.length; i++) {
		ctx = canvas[i].getContext("2d");
		ctx.clearRect(0,0,canvas[i].width, canvas[i].height);
	}

	for(var i = 0; i < tim.nb_pallet; i++) {
		ctx = canvas[i].getContext("2d");
		
		for(var k = 0; k < tim.nb_colors; k++) {
			var r = ((tim.pallet[i][k] >> 0x00) & 0x1f) << 3;
			var g = ((tim.pallet[i][k] >> 0x05) & 0x1f) << 3;
			var b = ((tim.pallet[i][k] >> 0x0a) & 0x1f) << 3;
			var a = tim.pallet[i][k] > 0 ? 1 : 0;
			ctx.fillStyle = "rgba("+r+","+g+","+b+","+a+")";
			ctx.fillRect(k*14, 0, 14, 18);
		}
	}

	var pallet_fix = document.getElementById("pallet_fix");
	pallet_fix.innerHTML = "";

	var li = document.createElement("li");
	var input = document.createElement("input");
	input.setAttribute("type", "radio");
	input.checked = true;
	var text = document.createTextNode(this.textContent);
	input.value = -1;
	input.setAttribute("name", "pallet_fix");
	li.addEventListener("click", pallet_callback.bind(null, tim, tim, input));
	li.appendChild(input);
	li.appendChild(text);
	pallet_fix.appendChild(li);

	window.tim = tim;
	window.clut = tim;

	for(var i = 0; i <  tim_list.length; i++) {
		
		if(tim_list[i] === tim) {
			continue;
		}

		if(tim_list[i].nb_colors !== tim.nb_colors) {
			continue;
		}

		li = document.createElement("li");
		input = document.createElement("input");
		input.setAttribute("type", "radio");
		text = document.createTextNode(tim_list[i].name);
		input.value = i;
		input.setAttribute("name", "pallet_fix");
		
		li.addEventListener("click", pallet_callback.bind(null, tim_list[i], tim, input));
		li.appendChild(input);
		li.appendChild(text);
		pallet_fix.appendChild(li);
		
	}

	for(var i = 0; i <  clut_list.length; i++) {
		
		if(clut_list[i].nb_colors !== tim.nb_colors) {
			continue;
		}

		li = document.createElement("li");
		input = document.createElement("input");
		input.setAttribute("type", "radio");
		text = document.createTextNode(clut_list[i].name);
		input.value = i;
		input.setAttribute("name", "pallet_fix");
		
		li.addEventListener("click", pallet_callback.bind(null, clut_list[i], tim, input));
		li.appendChild(input);
		li.appendChild(text);
		pallet_fix.appendChild(li);
		
	}
	
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,canvas.width, canvas.height);

	display_texture(tim.pallet[0], tim, ctx);

}

function pallet_callback(clut, tim, input) {
	
	if(input.checked) {
		return;
	}
	var keys = [
		"pallet_x",
		"pallet_y"
	];

	for(var i = 0; i < keys.length; i++) {
		var elem = document.getElementById(keys[i]);
		elem.textContent = clut[keys[i]];
	}

	input.checked = true;
	window.clut = clut;
	console.log(clut);

	var ctx;
	var canvas = document.getElementsByClassName("pallet-canvas");
	
	for(var i = 0; i < canvas.length; i++) {
		ctx = canvas[i].getContext("2d");
		ctx.clearRect(0,0,canvas[i].width, canvas[i].height);
	}

	for(var i = 0; i < tim.nb_pallet; i++) {
		ctx = canvas[i].getContext("2d");
		
		for(var k = 0; k < tim.nb_colors; k++) {
			var r = ((clut.pallet[i][k] >> 0x00) & 0x1f) << 3;
			var g = ((clut.pallet[i][k] >> 0x05) & 0x1f) << 3;
			var b = ((clut.pallet[i][k] >> 0x0a) & 0x1f) << 3;
			var a = clut.pallet[i][k] > 0 ? 1 : 0;
			ctx.fillStyle = "rgba("+r+","+g+","+b+","+a+")";
			ctx.fillRect(k*14, 0, 14, 18);
		}
	}
	
	if(window.active_mat) {
		window.active_mat.pallet_file.textContent = "\"" + clut.file + "\",";
		window.active_mat.pallet_name.textContent = "\"" + clut.name + "\"";
		window.active_mat.pallet_num.textContent = 0;
	}

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,canvas.width, canvas.height);

	display_texture(clut.pallet[0], tim, ctx);

}

function pallet_select() {

	var id = this.getAttribute("data-id");
	
	if(id >= window.clut.pallet.length) {
		return;
	}
	
	if(window.active_mat) {
		window.active_mat.pallet_num = id;
		window.active_mat.pallet_index.textContent = "Selected Pallet:" + id;
	}

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,canvas.width, canvas.height);

	display_texture(window.clut.pallet[id], window.tim, ctx);

}

function display_texture(pallet, tim, ctx, texture) {

	var query = {
		"name" : tim.file
	};
	
	db.files.where(query).first(file => {
	
	var fp = new EcmaBuffer(file.data);

	var inc = 1;
	var block_width = 64;
	var block_height = 32;

	if(tim.nb_colors === 16) {
		inc *= 2;
		block_width *= 2;
	}
	
	var ofs = tim.offset + 0x800;
	var image_body = new Array(tim.width * tim.height);
	var y, x, by, bx, pos, byte;

	for(y = 0; y < tim.height; y += block_height) {
		for(x = 0; x < tim.width; x += block_width) {
			for(by = 0; by < block_height; by++) {
				for(bx = 0; bx < block_width; bx += inc) {

					byte = fp.readUInt8(ofs++);

					switch(tim.nb_colors) {
						case 16:
							
							pos = ((y + by) * tim.width) + (x + bx);
							image_body[pos] = pallet[byte & 0xf];
							pos = ((y + by) * tim.width) + (x + bx + 1);
							image_body[pos] = pallet[byte >> 4];

						break;
						case 256:

							pos = ((y + by) * tim.width) + (x + bx);
							image_body[pos] = pallet[byte];

						break;
					}

				}
			}
		}
	}

	console.log(tim)
	let y_ofs = tim.image_y % 256;
	let x_ofs = ((tim.image_x - 320) % 64) * 4;

	var ofs = 0;
	for(y = 0; y < tim.height; y++) {
		
		for(x = 0; x < tim.width; x++) {
			var r = ((image_body[ofs] >> 0x00) & 0x1f) << 3;
			var g = ((image_body[ofs] >> 0x05) & 0x1f) << 3;
			var b = ((image_body[ofs] >> 0x0a) & 0x1f) << 3;
			var a = image_body[ofs] > 0 ? 1 : 0;
			ctx.fillStyle = "rgba("+r+","+g+","+b+","+a+")";
			ctx.fillRect(x + x_ofs, y + y_ofs, 1, 1);
			ofs++;
		}

	}

	if(false && tim.height < 256) {

	var ofs = 0;
	for(y = 0; y < tim.height; y++) {
		
		for(x = 0; x < tim.width; x++) {
			var r = ((image_body[ofs] >> 0x00) & 0x1f) << 3;
			var g = ((image_body[ofs] >> 0x05) & 0x1f) << 3;
			var b = ((image_body[ofs] >> 0x0a) & 0x1f) << 3;
			var a = image_body[ofs] > 0 ? 1 : 0;
			ctx.fillStyle = "rgba("+r+","+g+","+b+","+a+")";
			ctx.fillRect(x, y + 128, 1, 1);
			ofs++;
		}

	}


	}

	if(texture) {
		texture();
	}

	if(window.active_mat) {
		window.active_mat.ctx.clearRect(0,0,256,256);
		window.active_mat.ctx.drawImage(canvas, 0, 0, 256, 256);
		mesh.material.needsUpdate = true;
		mesh.material[window.active_mat.index].map.needsUpdate = true;
		mesh.needsUpdate = true;
	}

	});
}

function ebd_callback() {
	
	var ebd;
	var ebd_list = MEMORY[this.getAttribute("data-file")][".EBD"];
	for(var i = 0; i < ebd_list.length; i++) {
		
		if(ebd_list[i].name !== this.textContent) {
			continue;
		}

		ebd = ebd_list[i];
		break;
	}

	var query = {
		"name" : ebd.file
	};
	
	db.files.where(query).first(file => {
		
		var fp = new EcmaBuffer(file.data);
		var ofs = ebd.offset + 0x800;
		
		var nb_model = fp.readUInt32LE(ofs);
		var elem = document.getElementById("mdl_tab");
		elem.textContent = "Models (" + nb_model + ")";

		ofs += 4;
	
		window.ebd_list = [];
		window.filepointer = fp;

		var model_list = document.getElementById("model_list");
		model_list.innerHTML = "";

		for(var i = 0; i < nb_model; i++) {
			
			var mdl = {
				"flags" : fp.readUInt32LE(ofs + 0x00),
				"mesh_ofs" : fp.readUInt32LE(ofs + 0x04),
				"bone_ofs" : fp.readUInt32LE(ofs + 0x08),
				"anim_ofs" : fp.readUInt32LE(ofs + 0x0c),
				"file" : ebd.file,
				"memory" : ebd.memory,
				"offset" : ebd.offset
			}

			if(mdl.mesh_ofs) {
				mdl.mesh_ofs -= ebd.memory;
				mdl.mesh_ofs += ebd.offset;
				mdl.mesh_ofs += 0x800;
			}

			if(mdl.bone_ofs) {
				mdl.bone_ofs -= ebd.memory;
				mdl.bone_ofs += ebd.offset;
				mdl.bone_ofs += 0x800;
			}

			if(mdl.anim_ofs) {
				mdl.anim_ofs -= ebd.memory;
				mdl.anim_ofs += ebd.offset;
				mdl.anim_ofs += 0x800;
			}

			ofs += 0x10;

			var li = document.createElement("li");
			var key = mdl.flags.toString(16);
			if(LOOKUP[key]) {
				key = LOOKUP[key].name;
			}
			li.textContent = key;
			model_list.appendChild(li);
			li.addEventListener("click", click_callback);
			li.setAttribute("data-id", i);
			
			window.ebd_list.push(mdl);

		}
		
	});

}

function click_callback(evt) {

	var index = this.getAttribute("data-id");
	
	if(mesh) {
		scene.remove(mesh);
		scene.remove(helper);
	}
	
	mesh = null;
	load_ebd(parseInt(index), this.textContent);

}

function load_ebd(index, name) {

	console.log(this);

	var fp = window.filepointer;
	var ebd = window.ebd_list[index];
	
	if(!ebd) {
		return;
	}
	
	var ofs = ebd.mesh_ofs;
	
	var geometry = new THREE.Geometry();
	geometry.faceVertexUvs[0] = []
	var bones = [];

	var tmp = ebd.bone_ofs;
	var nb_prim = fp.readUInt8(ofs + 0x11);
	var threeBones = [];

	if(ebd.bone_ofs) {
		
		tmp = fp.readUInt32LE(ebd.bone_ofs);
		tmp -= ebd.memory;
		tmp += ebd.offset;
		tmp += 0x800;

		for(var i = 0; i < nb_prim; i++) {
			var pos = {
				"x" : fp.readInt16LE(tmp + 0) * SCALE,
				"y" : fp.readInt16LE(tmp + 2) * SCALE,
				"z" : fp.readInt16LE(tmp + 4) * SCALE
			};
			
			if(i === 0) {
				pos.x = 0;
				pos.y = 0;
				pos.z = 0;
			}

			tmp += 8;
			bones.push(pos);
			threeBones[i] = new THREE.Bone();
			threeBones[i].position.x = pos.x;
			threeBones[i].position.y = pos.y;
			threeBones[i].position.z = pos.z;
			threeBones[i].updateMatrix();
		}

	} else {

		for(var i = 0; i < nb_prim; i++) {
			var pos = {
				"x" : 0,
				"y" : 0,
				"z" : 0
			};
			bones.push(pos);
			threeBones[i] = new THREE.Bone();
		}

	}

	var list = document.getElementById("bone_list");
	list.innerHTML = "";

	var parents = [null];

	tmp = ofs + 0x14;
	for(var i = 0; i < nb_prim - 1; i++) {
		
		var b = fp.readUInt8(tmp);
		var parent = fp.readUInt8(tmp + 1);
		parents[b] = parent;
		
		tmp += 4;
		if (parent === b) {
			continue;
		}

		if(!threeBones[b]) {
			threeBones[b] = new THREE.Bone();
			nb_prim++;
		}
		threeBones[parent].add(threeBones[b]);
		threeBones[b].updateMatrixWorld();
	}

	var armSkeleton = new THREE.Skeleton(threeBones);

	ofs += 0x90;
	var mats = [];
	var prim_list = [];

	var elem = document.getElementById("bone_tab");
	elem.textContent = "Bones (" + nb_prim + ")";

	for(var i = 0; i < nb_prim; i++) {

		var prim = {
			"nb_tri" : fp.readUInt8(ofs + 0x00),
			"nb_quad" : fp.readUInt8(ofs + 0x01),
			"nb_vert" : fp.readUInt8(ofs + 0x02),
			"bone" : fp.readUInt8(ofs + 0x03),
			"tri_ofs" : fp.readUInt32LE(ofs + 0x04),
			"quad_ofs" : fp.readUInt32LE(ofs + 0x08),
			"vert_ofs" : fp.readUInt32LE(ofs + 0x10)
		}
		
		if(prim.vert_ofs) {
			prim.vert_ofs -= ebd.memory;
			prim.vert_ofs += ebd.offset;
			prim.vert_ofs += 0x800;
		}

		if(prim.tri_ofs) {
			prim.tri_ofs -= ebd.memory;
			prim.tri_ofs += ebd.offset;
			prim.tri_ofs += 0x800;
		}

		if(prim.quad_ofs) {
			prim.quad_ofs -= ebd.memory;
			prim.quad_ofs += ebd.offset;
			prim.quad_ofs += 0x800;
		}

		var mat = {
			"texture" : fp.readUInt32LE(ofs + 0x0c),
			"image_page" : fp.readUInt16LE(ofs + 0x0c),
			"pallet_page" : fp.readUInt16LE(ofs + 0x0e),
			"file" : ebd.file
		};
		
		mat.debug = mat.texture.toString(16);
		mat.image_x = (mat.image_page & 0x0f) << 6;
		mat.image_y = null;
		mat.pallet_x = (mat.pallet_page & 0b111111) << 4;
		mat.pallet_y = mat.pallet_page >> 6;

		for(var k = 0; k < mats.length; k++) {
			if(mats[k].texture !== mat.texture) {
				continue;
			}
			prim.mat = k;
			break;
		}
		
		if(prim.mat === undefined) {
			prim.mat = mats.length;
			mats.push(mat);
		}
		
		prim_list.push(prim);
		ofs += 0x14;
		
		var ul = document.createElement("ul");

		var li = document.createElement("li");
		li.textContent = "Bone: " + i;
		ul.appendChild(li);
		
		li = document.createElement("li");
		li.textContent = "Parent: " + parents[i];
		ul.appendChild(li);
		
		li = document.createElement("li");
		li.textContent = "Material: " + prim.mat;
		ul.appendChild(li);
		
		if(!bones[i]) {
			bones[i] = {"x":0,"y":0,"z":0};
		}
		li = document.createElement("li");
		li.textContent = "X: " + bones[i].x;
		ul.appendChild(li);
		
		li = document.createElement("li");
		li.textContent = "Y: " + bones[i].y;
		ul.appendChild(li);
		
		li = document.createElement("li");
		li.textContent = "Z: " + bones[i].z;
		ul.appendChild(li);
		
		list.appendChild(ul);
	}

	tmp = ebd.mesh_ofs + 0x14;
	for(var i = 0; i < nb_prim - 1; i++) {
		
		var b = fp.readUInt8(tmp);
		var parent = fp.readUInt8(tmp + 1);

		bones[b].x += bones[parent].x;
		bones[b].y += bones[parent].y;
		bones[b].z += bones[parent].z;
		
		tmp += 4;
	}
	
	var min_y = 0;
	var nb_vertex = 0;
	prim_list.forEach(function(prim) {
		
		if(!prim.nb_vert || !prim.vert_ofs) {
			return;
		}
		
		ofs = prim.vert_ofs;
		for(var i = 0; i < prim.nb_vert; i++) {
			
			var vertex = new THREE.Vector3();
			vertex.x = fp.readInt16LE(ofs + 0x00) * SCALE;
			vertex.y = fp.readInt16LE(ofs + 0x02) * SCALE;
			vertex.z = fp.readInt16LE(ofs + 0x04) * SCALE;

			vertex.x += bones[prim.bone].x;
			vertex.y += bones[prim.bone].y;
			vertex.z += bones[prim.bone].z;

			if(vertex.y < min_y) {
				min_y = vertex.y;
			}

			ofs += 0x08;

			geometry.vertices.push( vertex );
			geometry.skinIndices.push(new THREE.Vector4(prim.bone, 0, 0, 0));
			geometry.skinWeights.push(new THREE.Vector4(1.0, 0, 0, 0));

		}

		ofs = prim.tri_ofs;
		if(prim.nb_tri) {
		
			for(var i = 0; i < prim.nb_tri; i++) {
				var a = fp.readUInt8(ofs + 0x08);
				var b = fp.readUInt8(ofs + 0x09);
				var c = fp.readUInt8(ofs + 0x0a);
				var auv = new THREE.Vector2(
					fp.readUInt8(ofs + 0x00) / 256,
					fp.readUInt8(ofs + 0x01) / 256
				);
				var buv = new THREE.Vector2(
					fp.readUInt8(ofs + 0x02) / 256,
					fp.readUInt8(ofs + 0x03) / 256
				);
				var cuv = new THREE.Vector2(
					fp.readUInt8(ofs + 0x04) / 256,
					fp.readUInt8(ofs + 0x05) / 256
				);
				var face = new THREE.Face3();
				face.materialIndex = prim.mat;
				face.a = a + nb_vertex;
				face.b = b + nb_vertex;
				face.c = c + nb_vertex;
				geometry.faceVertexUvs[0][geometry.faces.length]=[auv,buv,cuv];
				geometry.faces.push( face );
				ofs += 0x0c;
			}

		}

		ofs = prim.quad_ofs;
		if(prim.nb_quad) {
		
			for(var i = 0; i < prim.nb_quad; i++) {
				var a = fp.readUInt8(ofs + 0x08);
				var b = fp.readUInt8(ofs + 0x09);
				var c = fp.readUInt8(ofs + 0x0a);
				var d = fp.readUInt8(ofs + 0x0b);
				var auv = new THREE.Vector2(
					fp.readUInt8(ofs + 0x00) / 256,
					fp.readUInt8(ofs + 0x01) / 256
				);
				var buv = new THREE.Vector2(
					fp.readUInt8(ofs + 0x02) / 256,
					fp.readUInt8(ofs + 0x03) / 256
				);
				var cuv = new THREE.Vector2(
					fp.readUInt8(ofs + 0x04) / 256,
					fp.readUInt8(ofs + 0x05) / 256
				);
				var duv = new THREE.Vector2(
					fp.readUInt8(ofs + 0x06) / 256,
					fp.readUInt8(ofs + 0x07) / 256
				);

				var face = new THREE.Face3();
				face.materialIndex = prim.mat;
				face.a = a + nb_vertex;
				face.b = b + nb_vertex;
				face.c = c + nb_vertex;
				geometry.faceVertexUvs[0][geometry.faces.length]=[auv,buv,cuv];
				geometry.faces.push( face );
				var face = new THREE.Face3();
				face.materialIndex = prim.mat;
				face.a = b + nb_vertex;
				face.b = d + nb_vertex;
				face.c = c + nb_vertex;
				geometry.faceVertexUvs[0][geometry.faces.length]=[buv,duv,cuv];
				geometry.faces.push( face );
				ofs += 0x0c;

			}

		}

		nb_vertex += prim.nb_vert;

	});
	
     
	create_material(mats, geometry, name, armSkeleton);

}

function create_material (mat_list, geometry, name, armSkeleton) {

	var mats = [];
	
	if(!mat_list.length) {
		return mats;
	}

	// Get keys
	var filenames = Object.keys(MEMORY);
	var names = [];
	var mat_name = mat_list[0].file;
	names.push(mat_name);

	for(var i = 0; i < filenames.length; i++) {
		if(filenames[i] === mat_name) {
			continue;
		}
		names.push(filenames[i]);
	}

	var elem = document.getElementById("tex_tab");
	elem.textContent = "Textures (" + mat_list.length + ")";

	var tex_list = document.getElementById("texture_list");
	tex_list.innerHTML = "";

	var mat_num = 0;

	window.mat_list = [];

	async.eachSeries(mat_list, function(mat, nextMat) {
		
		var clut, image;
		
		mat.index = mat_num;

		var li;
		var ul = document.createElement("div");

		var label = document.createElement("li");
		label.textContent = "Material: " + mat_num++;
		ul.appendChild(label);
		
		li = document.createElement("li");
		li.textContent = "Pallet X:" + mat.pallet_x;
		ul.appendChild(li);

		li = document.createElement("li");
		li.textContent = "Pallet Y:" + mat.pallet_y;
		ul.appendChild(li);

		li = document.createElement("li");
		li.textContent = "Image X:" + mat.image_x;
		ul.appendChild(li);

		li = document.createElement("li");
		li.textContent = "Image Y:" + mat.image_y;
		ul.appendChild(li);

		li = document.createElement("li");
		li.textContent = "Pallet Index";
		var pallet_index = li;
		ul.appendChild(li);

		li = document.createElement("li");
		li.textContent = "{";
		ul.appendChild(li);

		li = document.createElement("li");
		li.textContent = "\"image_file\":";
		li.appendChild(document.createElement("br"));
		var image_file = document.createElement("span");
		image_file.textContent = "Not Found";
		li.appendChild(image_file);
		ul.appendChild(li);

		li = document.createElement("li");
		li.textContent = "\"image_name\":";
		li.appendChild(document.createElement("br"));
		var image_name = document.createElement("span");
		image_name.textContent = "Not Found";
		li.appendChild(image_name);
		ul.appendChild(li);

		li = document.createElement("li");
		li.textContent = "\"pallet_file\":";
		li.appendChild(document.createElement("br"));
		var pallet_file = document.createElement("span");
		pallet_file.textContent = "Not Found";
		li.appendChild(pallet_file);
		ul.appendChild(li);

		li = document.createElement("li");
		li.textContent = "\"pallet_name\":";
		li.appendChild(document.createElement("br"));
		var pallet_name = document.createElement("span");
		pallet_name.textContent = "Not Found";
		li.appendChild(pallet_name);
		ul.appendChild(li);

		li = document.createElement("li");
		li.textContent = "}";
		ul.appendChild(li);

		var canvas = document.createElement("canvas");
		canvas.width = 256;
		canvas.height = 256;
		var ctx = canvas.getContext("2d");
		ul.appendChild(canvas);

		mat.pallet_file = pallet_file;
		mat.pallet_name = pallet_name;
		mat.image_file = image_file;
		mat.image_name = image_name;
		mat.canvas = canvas;
		mat.ctx = ctx;
		mat.pallet_num = 0;
		mat.pallet_index = pallet_index;

		var table = document.createElement("table");
		var row = table.insertRow();
		var cell = row.insertCell();
		var btn1 = document.createElement("button");
		btn1.textContent = "Change Image";
		btn1.addEventListener("click", preview_image);
		btn1.setAttribute("data-id", mat.index);
		cell.appendChild(btn1);
		cell = row.insertCell();
		var btn2 = document.createElement("button");
		btn2.textContent = "Change Pallet";
		btn2.setAttribute("data-id", mat.index);
		btn2.addEventListener("click", canvas_pallet_click);
		cell.appendChild(btn2);
		ul.appendChild(table);

		tex_list.appendChild(ul);

		// find pallet	
		
		var p_found = false;
		var i_found = false;
		

		for(var i = 0; i < names.length; i++) {
			

			for(var k = 0; k < MEMORY[names[i]][".TIM"].length; k++) {
				
				if(mat.pallet_x !== MEMORY[names[i]][".TIM"][k].pallet_x) {
					continue;
				}

				if(mat.pallet_y !== MEMORY[names[i]][".TIM"][k].pallet_y) {
					continue;
				}
				
				clut = MEMORY[names[i]][".TIM"][k];
				pallet_file.textContent = "\"" + clut.file + "\",";
				pallet_name.textContent = "\"" + clut.name + "\"";
				p_found = true;
				mat.clut = clut;
				break;
			}
		
			for(var k = 0; k < MEMORY[names[i]]["CLUT"].length; k++) {
				if(p_found) {
					break;
				}
				
				if(mat.pallet_x !== MEMORY[names[i]]["CLUT"][k].pallet_x) {
					continue;
				}

				if(mat.pallet_y !== MEMORY[names[i]]["CLUT"][k].pallet_y) {
					continue;
				}

				clut = MEMORY[names[i]]["CLUT"][k];
				pallet_file.textContent = "\"" + clut.file + "\",";
				pallet_name.textContent = "\"" + clut.name + "\"";
				p_found = true;
				mat.clut = clut;
				break;
			}
			
			if(p_found) {
				break;
			}

		}

		// find image

		for(var i = 0; i < names.length; i++) {
		
			for(var k = 0; k < MEMORY[names[i]][".TIM"].length; k++) {
				
				if(mat.image_x !== MEMORY[names[i]][".TIM"][k].image_x) {
					continue;
				}
			
				/*
				if(mat.image_y !== MEMORY[names[i]][".TIM"][k].image_y) {
					continue;
				}
				*/

				image = MEMORY[names[i]][".TIM"][k];
				image_name.textContent = "\"" + image.name + "\",";
				image_file.textContent = "\"" + image.file + "\",";
				i_found = true;
				mat.image = image;
				break;
			}
			
			if(i_found) {
				break;
			}

		}
		
		window.mat_list.push(mat);

		if(!p_found || !i_found) {

			ctx.fillStyle = "#f00";
			ctx.fillRect(0,0,256,256);
	
			ctx.font = '20pt Arial';
			ctx.fillStyle = 'red';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'white';
			ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);
			ctx.fillStyle = 'black';
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(new Date().getTime(), canvas.width/2, canvas.height/2);

			var texture = new THREE.Texture(canvas);
			texture.needsUpdate = true;

			var m = new THREE.MeshPhongMaterial({
				"color" : 0xFFFFFF,
				"map" : texture,
				"alphaTest" : 0.1
			});

			mats.push(m);
			return nextMat();

		}

		ctx.clearRect(0,0,256,256);
		display_texture(clut.pallet[0], image, ctx, function() {
			
			var texture = new THREE.Texture(canvas);
			/*
			texture.wrapS = THREE.RepeatWrapping;
			texture.repeat.x = - 1;
			*/
			texture.flipY = false;
			texture.needsUpdate = true;

			var m = new THREE.MeshToonMaterial({
				"color" : 0xFFFFFF,
				"map" : texture,
				"transparent" : true,
				"alphaTest" : 0.01
			});
			
			mats.push(m);
			nextMat();

		});

	}, function() {
		
		window.active_mat = null;
		mesh = new THREE.SkinnedMesh(geometry, mats);
		var rootBone = armSkeleton.bones[0];
		mesh.add(rootBone);
		mesh.bind(armSkeleton);
		helper = new THREE.SkeletonHelper(mesh);
		mesh.name = name;
		scene.add(mesh);
		scene.add(helper);

	});

	
}

document.getElementById("cancel").addEventListener("click", function() {

	var elem = document.getElementById("image_preview");
	elem.classList.remove("active");

});

function preview_image() {

	var index = parseInt(this.getAttribute("data-id"));
	var mat = window.mat_list[index];

	var elem = document.getElementById("image_preview");
	elem.classList.add("active");
	
	var div = document.getElementById("images");
	images.innerHTML = "";

	var names = Object.keys(MEMORY);
	
	names.forEach(function(name) {

		var row, cell, canvas, ctx;
		var label = document.createElement("label");
		label.textContent = name;

		var table = document.createElement("table");
		var i = 0;

		MEMORY[name][".TIM"].forEach(function(tim) {
			
			if((i % 3) === 0) {
				row = table.insertRow();
			}

			i++;
			cell = row.insertCell();
			canvas = document.createElement("canvas");
			canvas.setAttribute("data-id", index);
			canvas.width = 256;
			canvas.height = 256;
			ctx = canvas.getContext("2d");
			
			display_texture(tim.pallet[0], tim, ctx);
			cell.appendChild(canvas);

			var p = document.createElement("p");
			if(tim.image_x === mat.image_x) {
				p.textContent = "Image X Match";
			} else {
				p.textContent = "No Match";
			}

			canvas.addEventListener("click", canvas_image_click.bind(canvas, tim));

			cell.appendChild(p);

		});
		
		div.appendChild(label);
		div.appendChild(table);

	});

}

function canvas_image_click(tim) {

	var index = parseInt(this.getAttribute("data-id"));
	var mat = window.mat_list[index];

	mat.image = tim;
	if(!mat.clut) {
		mat.clut = tim;

		mat.pallet_file.textContent = "\"" + tim.file.toString() + "\",";
		mat.pallet_name.textContent = "\"" + tim.name + "\"";
		mat.pallet_num = 0;
	}
	
	console.log("setting tim");
	console.log(tim);
	mat.image_file.textContent = "\"" + tim.file.toString() + "\",";
	mat.image_name.textContent = "\"" + tim.name + "\",";
	mat.ctx.clearRect(0,0,256,256);

	display_texture(mat.clut.pallet[mat.pallet_num], mat.image, mat.ctx, function() {
		
		console.log(mesh.material[index]);
		/*
		var texture = new THREE.Texture(canvas);
		texture.flipY = false;
		texture.needsUpdate = true;

		var m = new THREE.MeshToonMaterial({
			"color" : 0xFFFFFF,
			"map" : texture
		});

		mesh.material[index].map = texture;
		*/
		mesh.material.needsUpdate = true;
		mesh.material[index].map.needsUpdate = true;
		mesh.needsUpdate = true;

	});

	var elem = document.getElementById("image_preview");
	elem.classList.remove("active");

}

function canvas_pallet_click() {

	var index = parseInt(this.getAttribute("data-id"));
	var mat = window.mat_list[index];
	window.active_mat = mat;

	if(!mat.image) {
		alert("Please select an image first");
		return;
	}

	window.tim = mat.image;
	window.clut = mat.clut || mat.image;

	var tim_list = MEMORY[window.tim.file][".TIM"];
	var clut_list = MEMORY[window.tim.file]["CLUT"];

	var elem = document.getElementById("tim_preview");
	elem.classList.add("active");
	
	var keys = [
		"pallet_x",
		"pallet_y",
		"nb_colors",
		"nb_pallet",
		"image_x",
		"image_y",
		"width",
		"height"
	];

	for(var i = 0; i < keys.length; i++) {
		var elem = document.getElementById(keys[i]);
		elem.textContent = tim[keys[i]];
	}

	var ctx;
	var canvas = document.getElementsByClassName("pallet-canvas");
	
	for(var i = 0; i < canvas.length; i++) {
		ctx = canvas[i].getContext("2d");
		ctx.clearRect(0,0,canvas[i].width, canvas[i].height);
	}

	for(var i = 0; i < clut.nb_pallet; i++) {
		ctx = canvas[i].getContext("2d");
		
		for(var k = 0; k < tim.nb_colors; k++) {
			var r = ((tim.pallet[i][k] >> 0x00) & 0x1f) << 3;
			var g = ((tim.pallet[i][k] >> 0x05) & 0x1f) << 3;
			var b = ((tim.pallet[i][k] >> 0x0a) & 0x1f) << 3;
			var a = tim.pallet[i][k] > 0 ? 1 : 0;
			ctx.fillStyle = "rgba("+r+","+g+","+b+","+a+")";
			ctx.fillRect(k*14, 0, 14, 18);
		}
	}

	var pallet_fix = document.getElementById("pallet_fix");
	pallet_fix.innerHTML = "";

	var li = document.createElement("li");
	var input = document.createElement("input");
	input.setAttribute("type", "radio");
	input.checked = true;
	var text = document.createTextNode(window.tim.name);
	input.value = -1;
	input.setAttribute("name", "pallet_fix");
	li.addEventListener("click", pallet_callback.bind(null, tim, tim, input));
	li.appendChild(input);
	li.appendChild(text);
	pallet_fix.appendChild(li);

	window.tim = tim;
	window.clut = tim;

	for(var i = 0; i <  clut_list.length; i++) {
		
		if(clut_list[i].nb_colors !== tim.nb_colors) {
			continue;
		}

		li = document.createElement("li");
		input = document.createElement("input");
		input.setAttribute("type", "radio");
		text = document.createTextNode(clut_list[i].name);
		input.value = i;
		input.setAttribute("name", "pallet_fix");
		
		li.addEventListener("click", pallet_callback.bind(null, clut_list[i], tim, input));
		li.appendChild(input);
		li.appendChild(text);
		pallet_fix.appendChild(li);
		
	}
	
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,canvas.width, canvas.height);

	display_texture(mat.clut.pallet[mat.pallet_num], mat.image, ctx);

}
