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

	var camera, scene, renderer, mesh, controls, helper, mixer, action;
	var clock = new THREE.Clock();

	var main = document.getElementById("main");
	var width = main.offsetWidth;
	var height = main.offsetHeight;

	camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10000);
	camera.position.z = 55;
	camera.position.y = 19;
	camera.position.x = 3;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({
		"antialias" : true
	});

	renderer.setSize(width, height);
	renderer.domElement.style.margin = "0";
	renderer.domElement.style.padding = "0";
	renderer.setClearColor(0xeeeeee, 1);
	main.appendChild(renderer.domElement);

	controls = THREE.OrbitControls(camera, renderer.domElement);
	
	var grid = new THREE.GridHelper(100, 10);
	scene.add(grid);

	var light = new THREE.AmbientLight(0xffffff);
	scene.add(light);
	animate();

	function animate() {
		
		requestAnimationFrame(animate);
		renderer.render(scene, camera);

		if(mixer) {
			var delta = clock.getDelta();
			mixer.update(delta);
		}

	}

	var select = document.getElementById("select");
	select.addEventListener("change", function() {
		if(action) {
			action.stop();
		}
		
		if(this.value === "none") {
			return;
		}

		mixer = new THREE.AnimationMixer(mesh);		
		var clip = mesh.geometry.animations[parseInt(this.value)];
		action = mixer.clipAction(clip, mesh);
		action.timeScale = 0.5;
		action.setLoop(THREE.LoopRepeat);
		action.play();

	});


	window.set_active_mesh = function(geometry, armSkeleton, texture) {
		
		if(mesh) {
			scene.remove(mesh);
		}

		if(helper) {
			scene.remove(helper);
		}

		if(mixer) {
			mixer = null;
		}
		
		var select = document.getElementById("select");
		select.innerHTML = "";

		var option = document.createElement("option");
		option.setAttribute("value", "none");
		option.textContent = "static pose";
		select.appendChild(option);

		var material = new THREE.MeshNormalMaterial({
			"skinning": true
		});

		if(!armSkeleton) {
			mesh = new THREE.Mesh(geometry, material);
			mesh.rotation.y = Math.PI;
			scene.add(mesh);
			select.setAttribute("disabled", "disabled");
			return;
		}

		mesh = new THREE.SkinnedMesh(geometry, material);
		mesh.add(armSkeleton.bones[0]);
		mesh.rotation.y = Math.PI;
		mesh.bind(armSkeleton);

		helper = new THREE.SkeletonHelper(mesh);
		helper.material.linewidth = 3;

		scene.add(helper);
		scene.add(mesh);

		if (!mesh.geometry.animations) {
			select.setAttribute("disabled", "disabled");
			return;
		}

		select.removeAttribute("disabled");
		for(var i = 0; i < geometry.animations.length; i++) {
			option = document.createElement("option");
			
			var num = i.toString();
			while(num.length < 3) {
				num = "0" + num;
			}

			option.textContent = "animation_" + num;
			option.value = i;
			select.appendChild(option);
		}
		
	}

})();
