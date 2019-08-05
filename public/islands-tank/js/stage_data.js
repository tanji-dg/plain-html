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
	new THREE.MeshBasicMaterial({color:0x0b51ff}),
	new THREE.MeshBasicMaterial({color:0xff08ff}),
	new THREE.MeshBasicMaterial({color:0xe0f664}),
	new THREE.MeshBasicMaterial({color:0x177b2f})
];

const FLOOR = 0;
const DOOR = 1;
const END = 2;
const JUMP = 3;
const THIN = 4;
const BARS = 5;
const SHOCK = 6;
const GRASS = 7;

var a01 = 14;
var a02 = 41;
var a03 = 75;
var a04 = -45;

var a05 = 3;
var a06 = -145;

var a07 = 36;
var a08 = -234;
var a09 = 54;

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
				{x:-8, y:8, z:41},
				{x:-8, y:8, z:56},
				// Platform Top
				{x:-8, y:8, z:41},
				{x:-8, y:8, z:56},
				{x:-24, y:8, z:41},
				{x:-24, y:8, z:56},
				// Platform Side
				{x:-8, y:0, z:56},
				{x:-8, y:8, z:56},
				{x:-24, y:0, z:56},
				{x:-24, y:8, z:56},
				// Platform Side
				{x:-8, y:0, z:41},
				{x:-8, y:8, z:41},
				{x:-24, y:0, z:41},
				{x:-24, y:8, z:41},
				// Platform Doorway
				{x:-24, y:8, z:43.5},
				{x:-24, y:8, z:53.5},
				{x:-27, y:8, z:43.5},
				{x:-27, y:8, z:53.5},

				// Enemy Platform
				{x:-27, y:8, z:56},
				{x:-27, y:8, z:26},
				{x:-57, y:8, z:56},
				{x:-57, y:8, z:26},

				// Archway
				{x:-37, y:8, z:56},
				{x:-37, y:8, z:59},
				{x:-47, y:8, z:56},
				{x:-47, y:8, z:59},

				// Chest
				{x:-33, y:8, z:59},
				{x:-33, y:8, z:69},
				{x:-51, y:8, z:59},
				{x:-51, y:8, z:69},

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

				// Thin Door
				{x:-77, y:0, z:110},
				{x:-77, y:0, z:113},
				{x:-83, y:0, z:110},
				{x:-83, y:0, z:113},

				// Room with Hole
				{x:-55, y:0, z:113},
				{x:-55, y:0, z:128},
				{x:-105, y:0, z:113},
				{x:-105, y:0, z:128},

				// Room with Hole
				{x:-55, y:0, z:148},
				{x:-55, y:0, z:163},
				{x:-105, y:0, z:148},
				{x:-105, y:0, z:163},

				// Room with Hole
				{x:-55, y:0, z:128},
				{x:-55, y:0, z:148},
				{x:-65, y:0, z:128},
				{x:-65, y:0, z:148},

				// Room with Hole
				{x:-90, y:0, z:128},
				{x:-90, y:0, z:148},
				{x:-105, y:0, z:128},
				{x:-105, y:0, z:148},

				// Doorway after room with door
				{x:-52, y:0, z:150},
				{x:-52, y:0, z:160},
				{x:-55, y:0, z:150},
				{x:-55, y:0, z:160},

				// Hallway (west)
				{x:-12, y:0, z:147},
				{x:-12, y:0, z:163},
				{x:-52, y:0, z:147},
				{x:-52, y:0, z:163},

				// Hallway (north)
				{x:-12, y:0, z:163},
				{x:-12, y:0, z:190},
				{x:-28, y:0, z:163},
				{x:-28, y:0, z:190},

				// Hallway Thin Door
				{x:-9, y:0, z:181},
				{x:-9, y:0, z:187},
				{x:-12, y:0, z:181},
				{x:-12, y:0, z:187},

				// Room with pathway
				{x:34, y:0, z:110},
				{x:34, y:0, z:190},
				{x:-9, y:0, z:110},
				{x:-9, y:0, z:190},

				// Bars
				{x:37, y:0, z:113},
				{x:37, y:0, z:119},
				{x:34, y:0, z:113},
				{x:34, y:0, z:119},

				// Hallway
				{x:57, y:0, z:110},
				{x:57, y:0, z:121},
				{x:37, y:0, z:110},
				{x:37, y:0, z:121},

				// End
				{x:60, y:0, z:113},
				{x:60, y:0, z:119},
				{x:57, y:0, z:113},
				{x:57, y:0, z:119},

				// Refractor Room
				{x:84, y:0, z:100},
				{x:84, y:0, z:132},
				{x:60, y:0, z:100},
				{x:60, y:0, z:132},

				// Raised Jump Area
				{x:-36, y:4.5, z:40},
				{x:-36, y:4.5, z:60},
				{x:20, y:4.5, z:40},
				{x:20, y:4.5, z:60},

				// Raised Jump Wall
				{x:-36, y:0, z:40},
				{x:-36, y:4.5, z:40},
				{x:20, y:0, z:40},
				{x:20, y:4.5, z:40},

				// Raised Jump Wall
				{x:1, y:4.5, z:110},
				{x:1, y:4.5, z:134},
				{x:-9, y:4.5, z:110},
				{x:-9, y:4.5, z:134},

				// Raised Jump Wall
				{x:1, y:0, z:110},
				{x:1, y:0, z:134},
				{x:1, y:4.5, z:110},
				{x:1, y:4.5, z:134},

				// Raised Jump Wall
				{x:1, y:0, z:134},
				{x:1, y:4.5, z:134},
				{x:-9, y:0, z:134},
				{x:-9, y:4.5, z:134},

				// Shock Floor
				{x:34, y:0.1, z:134},
				{x:34, y:0.1, z:141},
				{x:-9, y:0.1, z:134},
				{x:-9, y:0.1, z:141},

				// Shock Floor
				{x:15, y:0.1, z:141},
				{x:15, y:0.1, z:190},
				{x:9, y:0.1, z:141},
				{x:9, y:0.1, z:190},

				// Raised Jump Wall
				{x:-1, y:4.5, z:107},
				{x:-1, y:4.5, z:110},
				{x:-7, y:4.5, z:107},
				{x:-7, y:4.5, z:110},

				// Raised Jump Wall
				{x:30, y:4.5, z:97},
				{x:30, y:4.5, z:107},
				{x:-9, y:4.5, z:97},
				{x:-9, y:4.5, z:107},
				

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

				{a:37,b:36,c:38,m:THIN},
				{a:37,b:38,c:39,m:THIN},

				{a:41,b:40,c:42,m:FLOOR},
				{a:41,b:42,c:43,m:FLOOR},

                {a:45,b:44,c:46,m:FLOOR},
                {a:45,b:46,c:47,m:FLOOR},

                {a:49,b:48,c:50,m:FLOOR},
                {a:49,b:50,c:51,m:FLOOR},

                {a:53,b:52,c:54,m:FLOOR},
                {a:53,b:54,c:55,m:FLOOR},

                {a:57,b:56,c:58,m:DOOR},
                {a:57,b:58,c:59,m:DOOR},

                {a:61,b:60,c:62,m:FLOOR},
                {a:61,b:62,c:63,m:FLOOR},

                {a:65,b:64,c:66,m:FLOOR},
                {a:65,b:66,c:67,m:FLOOR},

                {a:69,b:68,c:70,m:THIN},
                {a:69,b:70,c:71,m:THIN},

                {a:73,b:72,c:74,m:FLOOR},
                {a:73,b:74,c:75,m:FLOOR},

                {a:77,b:76,c:78,m:BARS},
                {a:77,b:78,c:79,m:BARS},

                {a:81,b:80,c:82,m:FLOOR},
                {a:81,b:82,c:83,m:FLOOR},

                {a:85,b:84,c:86,m:END},
                {a:85,b:86,c:87,m:END},

                {a:89,b:88,c:90,m:FLOOR},
                {a:89,b:90,c:91,m:FLOOR},
				
                {a:92,b:93,c:94,m:JUMP},
                {a:94,b:93,c:95,m:JUMP},

                {a:96,b:97,c:98,m:JUMP},
                {a:98,b:97,c:99,m:JUMP},

                {a:101,b:100,c:102,m:JUMP},
                {a:101,b:102,c:103,m:JUMP},

                {a:105,b:104,c:106,m:JUMP},
                {a:105,b:106,c:107,m:JUMP},

                {a:108,b:109,c:110,m:JUMP},
                {a:110,b:109,c:111,m:JUMP},

                {a:113,b:112,c:114,m:SHOCK},
                {a:113,b:114,c:115,m:SHOCK},

                {a:117,b:116,c:118,m:SHOCK},
                {a:117,b:118,c:119,m:SHOCK},

                {a:121,b:120,c:122,m:THIN},
                {a:121,b:122,c:123,m:THIN},

                {a:125,b:124,c:126,m:JUMP},
                {a:125,b:126,c:127,m:JUMP},

			]

		},

		"Stage 03" : {
			"meta" : {
				rot_y : Math.PI/2
			},
			"vertices" : [
				{x:0,y:0,z:0},
				{x:Math.cos(Math.PI*2/8*0) * a01, y:0, z: Math.sin(Math.PI*2/8*0) * a01},
				{x:Math.cos(Math.PI*2/8*1) * a01, y:0, z: Math.sin(Math.PI*2/8*1) * a01},
				{x:Math.cos(Math.PI*2/8*2) * a01, y:0, z: Math.sin(Math.PI*2/8*2) * a01},
				{x:Math.cos(Math.PI*2/8*3) * a01, y:0, z: Math.sin(Math.PI*2/8*3) * a01},
				{x:Math.cos(Math.PI*2/8*4) * a01, y:0, z: Math.sin(Math.PI*2/8*4) * a01},
				{x:Math.cos(Math.PI*2/8*5) * a01, y:0, z: Math.sin(Math.PI*2/8*5) * a01},
				{x:Math.cos(Math.PI*2/8*6) * a01, y:0, z: Math.sin(Math.PI*2/8*6) * a01},
				{x:Math.cos(Math.PI*2/8*7) * a01, y:0, z: Math.sin(Math.PI*2/8*7) * a01},
				
				{x:0,y:0,z:-5},
				{x:0,y:0,z:5},
				{x:34,y:0,z:5},
				{x:34,y:0,z:-5},
				
				{x:68,y:0,z:-9},
				{x:54,y:0,z:-34},

				{x:a03,y:0,z:a04},
				{x:Math.cos(Math.PI*2/8*0) * a02 + a03, y:0, z: Math.sin(Math.PI*2/8*0) * a02 + a04},
				{x:Math.cos(Math.PI*2/8*1) * a02 + a03, y:0, z: Math.sin(Math.PI*2/8*1) * a02 + a04},
				{x:Math.cos(Math.PI*2/8*2) * a02 + a03, y:0, z: Math.sin(Math.PI*2/8*2) * a02 + a04},
				{x:Math.cos(Math.PI*2/8*3) * a02 + a03, y:0, z: Math.sin(Math.PI*2/8*3) * a02 + a04},
				{x:Math.cos(Math.PI*2/8*4) * a02 + a03, y:0, z: Math.sin(Math.PI*2/8*4) * a02 + a04},
				{x:Math.cos(Math.PI*2/8*5) * a02 + a03, y:0, z: Math.sin(Math.PI*2/8*5) * a02 + a04},
				{x:Math.cos(Math.PI*2/8*6) * a02 + a03, y:0, z: Math.sin(Math.PI*2/8*6) * a02 + a04},
				{x:Math.cos(Math.PI*2/8*7) * a02 + a03, y:0, z: Math.sin(Math.PI*2/8*7) * a02 + a04},

				{x:Math.cos(Math.PI/4)*8 + a03, y:0, z: Math.sin(Math.PI/4)*-8 + a04},
				{x:Math.cos(Math.PI/4)*-8 + a03, y:0, z: Math.sin(Math.PI/4)*8 + a04},

				{x:Math.cos(Math.PI/4)*8 + a05, y:0, z: Math.sin(Math.PI/4)*-8 + a06},
				{x:-2, y:0, z: -139},
				
				{x:-2, y:0, z: -139},
				{x:-2, y:0, z: -179},
				{x:14, y:0, z: -139},
				{x:14, y:0, z: -179},
				
				{x:-2, y:0, z: -179},
				{x:15, y:0, z: -177},
				{x:2, y:0, z: -204},
				{x:24, y:0, z: -194},

				{x:a07,y:0,z:a08},
				{x:Math.cos(Math.PI*2/8*0) * a09 + a07, y:0, z: Math.sin(Math.PI*2/8*0) * a09 + a08},
				{x:Math.cos(Math.PI*2/8*1) * a09 + a07, y:0, z: Math.sin(Math.PI*2/8*1) * a09 + a08},
				{x:Math.cos(Math.PI*2/8*2) * a09 + a07, y:0, z: Math.sin(Math.PI*2/8*2) * a09 + a08},
				{x:Math.cos(Math.PI*2/8*3) * a09 + a07, y:0, z: Math.sin(Math.PI*2/8*3) * a09 + a08},
				{x:Math.cos(Math.PI*2/8*4) * a09 + a07, y:0, z: Math.sin(Math.PI*2/8*4) * a09 + a08},
				{x:Math.cos(Math.PI*2/8*5) * a09 + a07, y:0, z: Math.sin(Math.PI*2/8*5) * a09 + a08},
				{x:Math.cos(Math.PI*2/8*6) * a09 + a07, y:0, z: Math.sin(Math.PI*2/8*6) * a09 + a08},
				{x:Math.cos(Math.PI*2/8*7) * a09 + a07, y:0, z: Math.sin(Math.PI*2/8*7) * a09 + a08},
				
				{x:53, y:0.1, z: -268},
				{x:71, y:0.1, z: -250},
				{x:77, y:0.1, z: -254},
				{x:58, y:0.1, z: -272},


			],

			"faces" : [

                {a:1,b:0,c:2,m:FLOOR},
                {a:2,b:0,c:3,m:FLOOR},
                {a:3,b:0,c:4,m:FLOOR},
                {a:4,b:0,c:5,m:FLOOR},
                {a:5,b:0,c:6,m:FLOOR},
                {a:6,b:0,c:7,m:FLOOR},
                {a:7,b:0,c:8,m:FLOOR},
                {a:8,b:0,c:1,m:FLOOR},
                
				{a:9,b:10,c:11,m:FLOOR},
				{a:9,b:11,c:12,m:FLOOR},
				
				{a:11,b:13,c:12,m:FLOOR},
				{a:12,b:13,c:14,m:FLOOR},

                {a:16,b:15,c:17,m:FLOOR},
                {a:17,b:15,c:18,m:FLOOR},
                {a:18,b:15,c:19,m:FLOOR},
                {a:19,b:15,c:20,m:FLOOR},
                {a:20,b:15,c:21,m:FLOOR},
                {a:21,b:15,c:22,m:FLOOR},
                {a:22,b:15,c:23,m:FLOOR},
                {a:23,b:15,c:16,m:FLOOR},

                {a:25,b:24,c:26,m:FLOOR},
                {a:25,b:26,c:27,m:FLOOR},

                {a:31,b:29,c:30,m:FLOOR},
                {a:29,b:28,c:30,m:FLOOR},

                {a:33,b:35,c:34,m:FLOOR},
                {a:32,b:33,c:34,m:FLOOR},

                {a:37,b:36,c:38,m:FLOOR},
                {a:38,b:36,c:39,m:FLOOR},
                {a:39,b:36,c:40,m:FLOOR},
                {a:40,b:36,c:41,m:FLOOR},
                {a:41,b:36,c:42,m:FLOOR},
                {a:42,b:36,c:43,m:FLOOR},
                {a:43,b:36,c:44,m:FLOOR},
                {a:44,b:36,c:37,m:FLOOR},

                {a:45,b:46,c:48,m:END},
                {a:46,b:47,c:48,m:END},

			]

		},

		"Stage 04" : {

			"meta" : {
				rot_y : 0
			},
			
			"vertices" : [
				
				{ x: 80, y: 0, z: 80 },
				{ x: 80, y: 0, z: -80 },
				{ x: -80, y: 0, z: 80 },
				{ x: -80, y: 0, z: -80 },
				
				{ x: 10, y: 0.2, z: 10 },
				{ x: 60, y: 0.2, z: 10 },
				{ x: 10, y: 0.2, z: 60 },
				{ x: 60, y: 0.2, z: 60 },
				
				{ x: -10, y: 0.2, z: 10 },
				{ x: -60, y: 0.2, z: 10 },
				{ x: -10, y: 0.2, z: 60 },
				{ x: -60, y: 0.2, z: 60 },
				
				{ x: 10, y: 0.2, z: -10 },
				{ x: 60, y: 0.2, z: -10 },
				{ x: 10, y: 0.2, z: -60 },
				{ x: 60, y: 0.2, z: -60 },
				
				{ x: -10, y: 0.2, z: -10 },
				{ x: -60, y: 0.2, z: -10 },
				{ x: -10, y: 0.2, z: -60 },
				{ x: -60, y: 0.2, z: -60 },

			],

			"faces" : [
                
				{a:0,b:1,c:3,m:FLOOR},
                {a:0,b:3,c:2,m:FLOOR},
                
				{a:4,b:7,c:5,m:GRASS},
				{a:7,b:4,c:6,m:GRASS},
                
				{a:11,b:8,c:9,m:GRASS},
				{a:8,b:11,c:10,m:GRASS},
                
				{a:15,b:12,c:13,m:GRASS},
				{a:12,b:15,c:14,m:GRASS},
                
				{a:16,b:19,c:17,m:GRASS},
				{a:19,b:16,c:18,m:GRASS},


			]

		}

	}

};

console.log("x: %d", Math.cos(Math.PI/4)*-8 + a05);
console.log("z: %d", Math.sin(Math.PI/4)* 8 + a06);

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
