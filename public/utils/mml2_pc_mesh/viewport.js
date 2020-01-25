/*-----------------------------------------------------------------------------

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

	var camera, scene, renderer, mesh, controls, helper, mixer, action, zip;
	const clock = new THREE.Clock();

	const section = document.getElementById("section");
	var width = section.offsetWidth;
	var height = section.offsetHeight;

	camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10000);
	camera.position.z = 55;
	camera.position.y = 19;
	camera.position.x = 3;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	camera.updateProjectionMatrix();
	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({
		"antialias" : true,
		"alpha" : true
	});

	renderer.setSize(width, height);
	renderer.domElement.style.margin = "0";
	renderer.domElement.style.padding = "0";
	renderer.setClearColor(0x263238, 1);
	section.appendChild(renderer.domElement);

	controls = THREE.OrbitControls(camera, section);
	var grid = new THREE.GridHelper(100, 10);
	scene.add(grid);

	var light = new THREE.AmbientLight(0xffffff);
	scene.add(light);
	animate();
	
	var anim_select = document.getElementById("anim-select");

	anim_select.addEventListener("click", function(evt) {

		if(action) {
			action.stop();
		}

		var index = parseInt(this.value);

		if(index === -1) {
			return;
		}

		mixer = new THREE.AnimationMixer(mesh);
		var clip = mesh.geometry.animations[index];
		action = mixer.clipAction(clip, mesh);
		action.timeScale = 0.5;
		action.setLoop(THREE.LoopRepeat);
		action.play();

	});

	function animate() {
		requestAnimationFrame(animate);

		if(mixer) {
			var delta = clock.getDelta();
			mixer.update(delta);
		}

		renderer.render(scene, camera);
	}

	window.addEventListener("resize", function() {

		var width = section.offsetWidth;
		var height = section.offsetHeight;

		camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10000);
		camera.updateProjectionMatrix();
		renderer.setSize(width, height);

	});

	window.append_mesh = function(m, h, a) {
		
		if(mesh) {
			scene.remove(mesh);
		}
		
		if(helper) {
			scene.remove(helper);
		}
			
		populate_zip(m);

		scene.add(m);
		mesh = m;
		helper = h;

		if(helper) {
			scene.add(helper);
		}

		if(!a) {
			anim_select.innerHTML = "";
			anim_select.setAttribute("disabled", "disabled");
			return;
		}

		anim_select.removeAttribute("disabled");
		anim_select.innerHTML = "";

		var opt = document.createElement("option");
		opt.textContent = "none";
		opt.setAttribute("value", "-1");
		anim_select.appendChild(opt);

		var len = m.geometry.animations.length;
		for(var i = 0; i < len; i++) {

			var opt = document.createElement("option");
			var str = i.toString();
			while(str.length < 3) {
				str = "0" + str;
			}

			opt.textContent = "anim_" + str;
			opt.setAttribute("value", i);
			anim_select.appendChild(opt);
		}

	}

	function populate_zip (m) {

		zip = new JSZip();
		zip.name = m.name;

		// Add in readme

		var readme = [
			"Exported from https://mml.dashgl.com/mml.dashgl.com/tools/mml2_pc_mesh/",
			"Attribution appreciated not requied (Kion at Dashgl.com)",
			"Source Code is avaiable under GPLv3 License https://gitlab.com/kion-dgl/JS_MML2_PC_MESH",
			"",
			"Included Formats:",
			".dae Collada format (usable with Blender)",
			".png Texture for Collada file",
			".json Threejs JSON format https://github.com/mrdoob/three.js/",
			".gltf GL Transmission Format https://github.com/KhronosGroup/glTF",
			".glb Binary version of gltf",
			".json, .gltf, and .glb can be viewed at: https://threejs.org/editor/"
		];

		zip.file("readme.txt", readme.join("\n"));

		// Export to Collada

		var expt;
		expt = new THREE.ColladaExporter();
		try {
			var data = expt.parse(m);
		} catch(err) {
			console.log(err);
		}
		let str = vkbeautify.xml(data.data);
		zip.file(m.name + ".dae", str);

		// Export texture as PNG

		var mat = m.material;
		if(mat.map) {
			var canvas = mat.map.image;
			var base = canvas.toDataURL();
			var index = base.indexOf(",") + 1;
			zip.file(m.name + ".png", base.substr(index), {base64:true});
		} else {
			m = m.clone();
			m.material = new THREE.MeshBasicMaterial({
				skinning : true
			});
		}

		// Export to JSON
		
		var json_text = m.toJSON();
		json_text = JSON.stringify(json_text, null, 4);
		zip.file(m.name + ".json", json_text);

		// Export to glTF

		var gltf = new THREE.GLTFExporter();
		gltf.parse( m, function( result ) {
			
			var output = JSON.stringify( result, null, 4 );
			zip.file(m.name + ".gltf", output);

		}, {binary : false});

		// Export to glb

		var glb = new THREE.GLTFExporter();
		glb.parse( m, function( result ) {
			
			var output = new Blob( [ result ], { type: 'application/octet-stream' } );
			zip.file(m.name + ".glb", output);

		}, {binary : true});

	}


    var export_toggle = document.getElementById("export-toggle");
    export_toggle.addEventListener("click", function(evt) {
		
		if(!zip) {
			return;
		}

		zip.generateAsync({type:"blob"}).then(function(content) {
			saveAs(content, zip.name+".zip");
		});

    });

})();
