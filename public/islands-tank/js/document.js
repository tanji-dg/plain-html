/**
 * Copyright 2018 Kion DashGL.com
 * MIT License
 **/

"use strict";

const main = document.getElementById('main');
const width = main.offsetWidth;
const height = main.offsetHeight;
const aspect = width / height;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
	alpha : true
});
renderer.setSize( width, height );
renderer.setClearColor(0x1d4159);
main.appendChild( renderer.domElement );

const keys = {
	up : false, 
	down: false,
	left : false,
	right : false,
	rise : false,
	fall : false
};

document.addEventListener("keydown", function(evt) {

	switch(evt.keyCode) {
	case 87:
		keys.up = true;
		break;
	case 83:
		keys.down = true;
		break;
	case 65:
		keys.left = true;
		break;
	case 68:
		keys.right = true;
		break;
	case 38:
		keys.rise = true;
		break;
	case 40:
		keys.fall = true;
		break;
	case 32:
		console.log(player.position);
		break;
	}

});

document.addEventListener("keyup", function(evt) {

	switch(evt.keyCode) {
	case 87:
		keys.up = false;
		break;
	case 83:
		keys.down = false;
		break;
	case 65:
		keys.left = false;
		break;
	case 68:
		keys.right = false;
		break;
	case 38:
		keys.rise = false;
		break;
	case 40:
		keys.fall = false;
		break;
	}

});

const origin = new THREE.Vector3(0,20,0);
const y_down = new THREE.Vector3(0, -1, 0);

const raycast = new THREE.Raycaster(origin, y_down, 0, 40);
const player = new THREE.Object3D();
var geometry = new THREE.CylinderBufferGeometry( 0.8, 0.8, 4, 8);
var material = new THREE.MeshBasicMaterial( { color: 0x363b7d, opacity : 0.8 });
const placeholder = new THREE.Mesh( geometry, material );
placeholder.position.y = 2;
player.add(placeholder);
scene.add(player);
placeholder.add(camera);

// Floor geometry

var url = new URL(window.location.href);
var island = url.searchParams.get("island") || "Sealos Island";
var stage = url.searchParams.get("stage") || "Stage 04";
var data = STAGE_DATA[island][stage]
var floor = makeStageGeometry(data);
scene.add(floor);

if(data.meta && data.meta.rot_y) {
	placeholder.rotation.y = data.meta.rot_y;
}

	/*
    let opts = { author : "Kion Attribution 3.0 Unported (CC BY 3.0)" };
    let expt = new THREE.ColladaExporter();
    let res = expt.parse(floor, function(res) {

        let blob = new Blob([res.data]);
        saveAs(blob, "stage_01_03.dae");

    }, opts);
	*/

console.log(data.meta);

camera.position.z = -8;
camera.position.y = 3;
camera.lookAt(new THREE.Vector3(0, 2, 0));

const animate = function () {
	requestAnimationFrame( animate );

	if(keys.left) {
		placeholder.rotation.y += 0.045;	
	}

	if(keys.right) {
		placeholder.rotation.y -= 0.045;	
	}

	if(keys.up) {
		
		let s = Math.sin(placeholder.rotation.y) * 0.5;
		let c = Math.cos(placeholder.rotation.y) * 0.5;
		raycast.ray.origin.x = player.position.x + s;
		raycast.ray.origin.z = player.position.z + c;
		
		let test = raycast.intersectObject(floor);

		if(test.length) {
			player.position.x = test[0].point.x;
			player.position.y = test[0].point.y;
			player.position.z = test[0].point.z;
		}

	}

	renderer.render( scene, camera );
};

animate();
