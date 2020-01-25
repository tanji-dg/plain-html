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

const renderer = new THREE.WebGLRenderer();
renderer.setSize( width, height );
main.appendChild( renderer.domElement );

const keys = {
	up : false, 
	down: false,
	left : false,
	right : false
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
	}

});

const raycast = new THREE.Raycaster(new THREE.Vector3(0,2,0), new THREE.Vector3(0, -1, 0), 0, 10);
const player = new THREE.Object3D();
var geometry = new THREE.CylinderBufferGeometry( 0.8, 0.8, 4, 8);
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
const placeholder = new THREE.Mesh( geometry, material );
placeholder.position.y = 2;
player.add(placeholder);
scene.add(player);

placeholder.add(camera);

// Floor geometry

var material = [
	new THREE.MeshBasicMaterial({color:0x003333}),
	new THREE.MeshBasicMaterial({color:0xffa500})
];

var vertices = [
	{x:-14, y:0, z:5},
	{x:-14, y:0, z:-5},
	{x:14, y:0, z:5},
	{x:14, y:0, z:-5},

	{x:-5, y:0, z:5},
	{x:-5, y:0, z:8},
	{x:5, y:0, z:5},
	{x:5, y:0, z:8},

	{x:-14, y:0, z:8},
	{x:-14, y:0, z:38},
	{x:14, y:0, z:8},
	{x:14, y:0, z:38},

	{x:-5, y:0, z:38},
	{x:-5, y:0, z:41},
	{x:5, y:0, z:38},
	{x:5, y:0, z:41},

	{x:-14, y:0, z:41},
	{x:-14, y:0, z:71},
	{x:14, y:0, z:41},
	{x:14, y:0, z:71},

	{x:-5, y:0, z:71},
	{x:-5, y:0, z:74},
	{x:5, y:0, z:71},
	{x:5, y:0, z:74},

	{x:-14, y:0, z:74},
	{x:-14, y:0, z:84},
	{x:14, y:0, z:74},
	{x:14, y:0, z:84},
];

var faces = [
	{a:1,b:0,c:3,m:0},
	{a:0,b:2,c:3,m:0},
	{a:4,b:5,c:6,m:1},
	{a:6,b:5,c:7,m:1},
	{a:8,b:9,c:10,m:0},
	{a:10,b:9,c:11,m:0},
	{a:12,b:13,c:14,m:1},
	{a:14,b:13,c:15,m:1},
	{a:16,b:17,c:18,m:0},
	{a:18,b:17,c:19,m:0},
	{a:20,b:21,c:22,m:1},
	{a:22,b:21,c:23,m:1},
	{a:24,b:25,c:26,m:0},
	{a:26,b:25,c:27,m:0},
];

var geometry = new THREE.Geometry();
for(let i = 0; i < vertices.length; i++) {
	let v = vertices[i];
	let vertex = new THREE.Vector3(v.x, v.y, v.z);
	geometry.vertices.push(vertex);
}

for(let i = 0; i < faces.length; i++) {
	let f = faces[i];
	let face = new THREE.Face3(f.a, f.b, f.c);
	face.materialIndex = f.m;
	geometry.faces.push(face);
}

var floor = new THREE.Mesh(geometry, material);
scene.add(floor);

// Switches

var geometry = new THREE.BoxGeometry( 2, 3, 2 );
var material = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe:true} );
var button = new THREE.Mesh( geometry, material );
button.position.y = 1.5;

var b1 = button.clone();
b1.position.x = -12;
b1.position.z = 36;
scene.add(b1);

var b2 = button.clone();
b2.position.x = -1;
b2.position.z = 82;
scene.add(b2);

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

		raycast.ray.origin.x = player.position.x + Math.sin(placeholder.rotation.y) * 0.5;
		raycast.ray.origin.z = player.position.z + Math.cos(placeholder.rotation.y) * 0.5;
		
		let test = raycast.intersectObject(floor);
		if(test.length) {
			player.position.x = test[0].point.x;
			player.position.z = test[0].point.z;
		}

	}

	renderer.render( scene, camera );
};

animate();
