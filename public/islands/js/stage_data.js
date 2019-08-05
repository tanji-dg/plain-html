/**
 * Copyright 2018 Kion DashGL.com
 * MIT License
 **/

"use strict";

const MATERIALS = [
	new THREE.MeshBasicMaterial({color:0xc2bfbf}),
	new THREE.MeshBasicMaterial({color:0xd19d59}),
	new THREE.MeshBasicMaterial({color:0x1bff1b}),
	new THREE.MeshBasicMaterial({color:0xb48ad7}),
	new THREE.MeshBasicMaterial({color:0x0b51ff})
];

const FLOOR = 0;
const DOOR = 1;
const END = 2;
const JUMP = 3;
const THIN = 4;

const STAGE_DATA = {

	"Sealos Island" : {

		"Stage 01" : {

			"vertices" : [
				// Spawn Room
				{x:-14, y:0, z:5},
				{x:-14, y:0, z:-5},
				{x:14, y:0, z:5},
				{x:14, y:0, z:-5},
				// Spawn Doorway
				{x:-5, y:0, z:5},
				{x:-5, y:0, z:8},
				{x:5, y:0, z:5},
				{x:5, y:0, z:8},
				// First Room (with switch)
				{x:-14, y:0, z:8},
				{x:-14, y:0, z:38},
				{x:14, y:0, z:8},
				{x:14, y:0, z:38},
				// First Room Doorway
				{x:-5, y:0, z:38},
				{x:-5, y:0, z:41},
				{x:5, y:0, z:38},
				{x:5, y:0, z:41},
				// Second Room
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

				// Platform
				{x:-8, y:0, z:41},
				{x:-8, y:0, z:56},
				{x:-8, y:4, z:41},
				{x:-8, y:4, z:56},
				// Platform Top
				{x:-8, y:4, z:41},
				{x:-8, y:4, z:56},
				{x:-24, y:4, z:41},
				{x:-24, y:4, z:56},
				// Platform Side
				{x:-8, y:0, z:56},
				{x:-8, y:4, z:56},
				{x:-24, y:0, z:56},
				{x:-24, y:4, z:56},
				// Platform Side
				{x:-8, y:0, z:41},
				{x:-8, y:4, z:41},
				{x:-24, y:0, z:41},
				{x:-24, y:4, z:41},
				// Platform Doorway
				{x:-24, y:4, z:43.5},
				{x:-24, y:4, z:53.5},
				{x:-27, y:4, z:43.5},
				{x:-27, y:4, z:53.5},

				// Enemy Platform
				{x:-27, y:4, z:56},
				{x:-27, y:4, z:26},
				{x:-57, y:4, z:56},
				{x:-57, y:4, z:26},

				// Archway
				{x:-37, y:4, z:56},
				{x:-37, y:4, z:59},
				{x:-47, y:4, z:56},
				{x:-47, y:4, z:59},

				// Chest
				{x:-33, y:4, z:59},
				{x:-33, y:4, z:69},
				{x:-51, y:4, z:59},
				{x:-51, y:4, z:69},

			],

			"faces" : [
				{a:1,b:0,c:3,m:FLOOR},
				{a:0,b:2,c:3,m:FLOOR},
				{a:4,b:5,c:6,m:DOOR},
				{a:6,b:5,c:7,m:DOOR},
				{a:8,b:9,c:10,m:FLOOR},
				{a:10,b:9,c:11,m:FLOOR},
				{a:12,b:13,c:14,m:DOOR},
				{a:14,b:13,c:15,m:DOOR},
				{a:16,b:17,c:18,m:FLOOR},
				{a:18,b:17,c:19,m:FLOOR},
				{a:20,b:21,c:22,m:END},
				{a:22,b:21,c:23,m:END},
				{a:24,b:25,c:26,m:FLOOR},
				{a:26,b:25,c:27,m:FLOOR},

				{a:29,b:28,c:30,m:JUMP},
				{a:29,b:30,c:31,m:JUMP},

				{a:33,b:32,c:34,m:JUMP},
				{a:33,b:34,c:35,m:JUMP},
				{a:32,b:33,c:34,m:JUMP},
				{a:34,b:33,c:35,m:JUMP},

				{a:37,b:36,c:38,m:JUMP},
				{a:37,b:38,c:39,m:JUMP},
				{a:36,b:37,c:38,m:JUMP},
				{a:38,b:37,c:39,m:JUMP},

				{a:41,b:40,c:42,m:JUMP},
				{a:41,b:42,c:43,m:JUMP},
				{a:40,b:41,c:42,m:JUMP},
				{a:42,b:41,c:43,m:JUMP},

				{a:45,b:44,c:46,m:DOOR},
				{a:45,b:46,c:47,m:DOOR},

				{a:48,b:49,c:50,m:JUMP},
				{a:50,b:49,c:51,m:JUMP},
				{a:49,b:48,c:50,m:JUMP},
				{a:49,b:50,c:51,m:JUMP},

				{a:53,b:52,c:54,m:DOOR},
				{a:53,b:54,c:55,m:DOOR},

				{a:57,b:56,c:58,m:JUMP},
				{a:57,b:58,c:59,m:JUMP},
				{a:56,b:57,c:58,m:JUMP},
				{a:58,b:57,c:59,m:JUMP},
			],

			"objects" : [
				{
					"type" : "switch",
					"pos" : { x : -12, y: 0, z : 36 }
				},
				{
					"type" : "switch",
					"pos" : { x : -1, y: 0, z : 82 }
				}
			]

		},

		"Stage 02" : {

			"vertices" : [
				// Spawn Room
				{x:-10, y:0, z:5},
				{x:-10, y:0, z:-5},
				{x:10, y:0, z:5},
				{x:10, y:0, z:-5},
				// Spawn Doorway
				{x:-5, y:0, z:5},
				{x:-5, y:0, z:8},
				{x:5, y:0, z:5},
				{x:5, y:0, z:8},
				// First Room Entry
				{x:-10, y:0, z:8},
				{x:-10, y:0, z:18},
				{x:10, y:0, z:8},
				{x:10, y:0, z:18},
				// First Room
				{x:-36, y:0, z:18},
				{x:-36, y:0, z:60},
				{x:20, y:0, z:18},
				{x:20, y:0, z:60},

				// First Doorway
				{x:-36, y:0, z:26},
				{x:-36, y:0, z:36},
				{x:-39, y:0, z:26},
				{x:-39, y:0, z:36},

				// First Hallway
				{x:-39, y:0, z:22},
				{x:-39, y:0, z:40},
				{x:-89, y:0, z:22},
				{x:-89, y:0, z:40},

				// First Hallway (turn)
				{x:-71, y:0, z:40},
				{x:-71, y:0, z:70},
				{x:-89, y:0, z:40},
				{x:-89, y:0, z:70},

				// Second Doorway
				{x:-75, y:0, z:70},
				{x:-75, y:0, z:73},
				{x:-85, y:0, z:70},
				{x:-85, y:0, z:73},

				// First Enemy Room
				{x:-55, y:0, z:73},
				{x:-55, y:0, z:110},
				{x:-105, y:0, z:73},
				{x:-105, y:0, z:110},

			],

			"faces" : [

				{a:1,b:0,c:3,m:FLOOR},
				{a:0,b:2,c:3,m:FLOOR},
				{a:4,b:5,c:6,m:DOOR},
				{a:6,b:5,c:7,m:DOOR},
				{a:8,b:9,c:10,m:FLOOR},
				{a:10,b:9,c:11,m:FLOOR},

				{a:12,b:13,c:14,m:FLOOR},
				{a:14,b:13,c:15,m:FLOOR},

				{a:17,b:16,c:18,m:DOOR},
				{a:17,b:18,c:19,m:DOOR},

				{a:21,b:20,c:22,m:FLOOR},
				{a:21,b:22,c:23,m:FLOOR},

				{a:25,b:24,c:26,m:FLOOR},
				{a:25,b:26,c:27,m:FLOOR},

				{a:29,b:28,c:30,m:DOOR},
				{a:29,b:30,c:31,m:DOOR},

				{a:33,b:32,c:34,m:FLOOR},
				{a:33,b:34,c:35,m:FLOOR},

			]

		}

	}

};


function makeStageGeometry(stage) {

	let geometry = new THREE.Geometry();
	stage.vertices.forEach( function(v) {
		let vertex = new THREE.Vector3(v.x, v.y, v.z);	
		geometry.vertices.push(vertex);
	});

	stage.faces.forEach( function(f) {
		let face = new THREE.Face3(f.a, f.b, f.c);
		face.materialIndex = f.m;
		geometry.faces.push(face);
	});

	let mesh = new THREE.Mesh(geometry, MATERIALS);
	return mesh;

}

function makeButtonObject(pos) {

	var geometry = new THREE.BoxGeometry( 2, 3, 2 );
	var material = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe:true} );
	var button = new THREE.Mesh( geometry, material );
	button.position.x = pos.x;
	button.position.y = pos.y + 1.5;
	button.position.z = pos.z;
	return button;

}
