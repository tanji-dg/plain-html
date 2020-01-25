/*-----------------------------------------------------------------------------

	DashGL Model Viewer Copyright 2018 DashGL Project 

    DashGL Model Viewer is free software: you can redistribute it and/or modify 
	it under the terms of the GNU General Public License as published by the 
	Free Software Foundation, either version 3 of the License, or (at your 
	option) any later version.

    DashGL Model Viewer is distributed in the hope that it will be useful, but 
	WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
	or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for 
	more details.

    You should have received a copy of the GNU General Public License along with
	DashGL Model Viewer. If not, see http://www.gnu.org/licenses/.

------------------------------------------------------------------------------*/

"use strict";

var camera, scene, renderer, mesh, controls, helper, mixer, action;
var clock = new THREE.Clock();
const db = new Dexie("mml_files");

db.version(1).stores({
	"files": "&name"
});

db.open();
const SCALE = -0.05;

const LOOKUP = {
	"20": {
		"name": "ServBot",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "DEMO_DAT.BIN",
				"image_name": "..\OBJ\ST03\AR00a\EM0000.TIM",
				"pallet_file": "DEMO_DAT.BIN",
				"pallet_name": "..\OBJ\ST03\AR00a\EM0000.TIM"
			}]
		}
	},
	"40": {
		"name": "Feldynaught",
		"head": 0,
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST05_01.BIN",
				"image_name": "..\OBJ\ST05\AR01\BS0000.TIM",
				"pallet_file": "ST05_01.BIN",
				"pallet_name": "..\OBJ\ST05\AR01\BS0000.TIM"
			}]
		}
	},
	"140": {
		"name": "Marlwolf",
		"head": 0,
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST0A_00.BIN",
				"image_name": "..\OBJ\ST0A\AR00A\BS0100.TIM",
				"pallet_file": "ST0A_00.BIN",
				"pallet_name": "..\OBJ\ST0A\AR00A\BS0100.TIM"
			}]
		}
	},
	"360": {
		"name": "Marlwolf Bomb 0",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST0A_00.BIN",
				"image_name": "..\OBJ\ST0A\AR00A\BS0100.TIM",
				"pallet_file": "ST0A_00.BIN",
				"pallet_name": "..\OBJ\ST0A\AR00A\BS0100.TIM"
			}]
		}
	},
	"10360": {
		"name": "Marlwolf Bomb 1",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST0A_00.BIN",
				"image_name": "..\OBJ\ST0A\AR00A\BS0100.TIM",
				"pallet_file": "ST0A_00.BIN",
				"pallet_name": "..\OBJ\ST0A\AR00A\BS0100.TIM"
			}]
		}
	},
	"20360": {
		"name": "Marlwolf Bomb 2",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST0A_00.BIN",
				"image_name": "..\OBJ\ST0A\AR00A\BS0100.TIM",
				"pallet_file": "ST0A_00.BIN",
				"pallet_name": "..\OBJ\ST0A\AR00A\BS0100.TIM"
			}]
		}
	},
	"30360": {
		"name": "Marlwolf Bomb 3",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST0A_00.BIN",
				"image_name": "..\OBJ\ST0A\AR00A\BS0100.TIM",
				"pallet_file": "ST0A_00.BIN",
				"pallet_name": "..\OBJ\ST0A\AR00A\BS0100.TIM"
			}]
		}
	},
	"220": {
		"name": "Arukoitan",
		"texture": {
			"width": 256,
			"height": 256,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST09_00.BIN",
				"image_name": "..\OBJ\ST09\AR00\EM0200.TIM",
				"pallet_file": "ST09_00.BIN",
				"pallet_name": "..\OBJ\ST09\AR00\EM0200.TIM"
			}]
		}
	},
	"240": {
		"name": "Hanmuru Doll",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST00_03.BIN",
				"image_name": "..\OBJ\ST00\AR01\BS0200x.TIM",
				"pallet_file": "ST00_03.BIN",
				"pallet_name": "..\OBJ\ST00\AR01\BS0200x.TIM",
				"pallet_index": 0
			}]
		}
	},
	"320": {
		"name": "Horokko",
		"texture": {
			"width": 256,
			"height": 128,
			"images": [{
				"image_file": "ST00_01.BIN",
				"image_name": "..\OBJ\ST00\AR01\EM0300.TIM",
				"pallet_file": "ST00_01.BIN",
				"pallet_name": "..\OBJ\ST00\AR01\EM0300.TIM",
				"pallet_index": 0
			}]
		}
	},
	"420": {
		"name": "Shekuten",
		"head": 0,
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST09_00.BIN",
				"image_name": "..\OBJ\ST09\AR00\EM0400.TIM",
				"pallet_file": "ST09_00.BIN",
				"pallet_name": "..\OBJ\ST09\AR00\EM0400.TIM"
			}]
		}
	},
	"440": {
		"name": "Cannam",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST00_02.BIN",
				"image_name": "..\OBJ\ST00\AR01\BS0400.TIM",
				"pallet_file": "ST00_02.BIN",
				"pallet_name": "..\OBJ\ST00\AR01\BS0400.TIM"
			}]
		}
	},
	"460": {
		"name": "Car 0",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST05_00.BIN",
				"image_name": "..\OBJ\ST05\AR00A\CA0000.TIM",
				"pallet_file": "ST05_00.BIN",
				"pallet_name": "..\OBJ\ST05\AR00A\CA0000.TIM"
			}]
		}
	},
	"520": {
		"name": "Roll Caskett",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST03_00.BIN",
				"image_name": "..\OBJ\ST03\AR00A\EM0500.TIM",
				"pallet_file": "ST03_00.BIN",
				"pallet_name": "..\OBJ\ST03\AR00A\EM0500.TIM"
			}]
		}
	},
	"540": {
		"name": "Megaman",
		"slice": [17,19,23],
		"hand" : 7,
		"hold" : [19, 20, 21, 22],
		"texture": {
			"width": 512,
			"height": 512,
			"images": [{
					"image_file": "INIT_DAT.BIN",
					"image_name": "..\OBJ\COMM\PL0000.TIM",
					"pallet_file": "ST00_00.BIN",
					"pallet_name": "..\OBJ\COMM\PL0000.TIM"
				},
				{
					"image_file": "ST00_00.BIN",
					"image_name": "..\OBJ\FACE\PL00B01.TIM",
					"pallet_file": "ST00_00.BIN",
					"pallet_name": "..\OBJ\FACE\PL00B01.TIM",
					"sx": 0,
					"sy": 0,
					"sWidth": 256,
					"sHeight": 256,
					"dx": 256,
					"dy": 0,
					"dWidth": 256,
					"dHeight": 256,
					"offsetX": 256,
					"offsetY": 0
				},
				{
					"image_file": "ST0D_02.BIN",
					"image_name": "..\OBJ\ST0D\AR02\DIF01.TIM",
					"pallet_file": "ST0D_02.BIN",
					"pallet_name": "..\OBJ\ST0D\AR02\DIF01.TIM",
					"sx": 0,
					"sy": 0,
					"sWidth": 256,
					"sHeight": 256,
					"dx": 0,
					"dy": 256,
					"dWidth": 256,
					"dHeight": 256,
					"offsetX": 0,
					"offsetY": 128
				}
			]
		}
	},
	"620": {
		"name": "Dustin Cowlick Kid",
		"texture": {
			"width": 128,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST03_00B.BIN",
				"image_name": "..\OBJ\ST03\AR00B\EM0600.TIM",
				"pallet_file": "ST03_00B.BIN",
				"pallet_name": "..\OBJ\ST03\AR00B\EM0600.TIM"
			}]
		}
	},
	"640": {
		"name": "Roll (Cutscene)",
		"face": [16, 17, 18],
		"slice": [17, 19],
		"hand": 4,
		"hold": [20, 21],
		"texture": {
			"width": 512,
			"height": 512,
			"images": [{
					"image_file": "ST02.BIN",
					"image_name": "..\OBJ\ST02\AR00\BS0600.TIM",
					"pallet_file": "ST02.BIN",
					"pallet_name": "..\OBJ\ST02\AR00\BS0600.TIM"
				},
				{
					"image_file": "ST02.BIN",
					"image_name": "..\OBJ\ST02\AR00\BS0603.TIM",
					"pallet_file": "ST02.BIN",
					"pallet_name": "..\OBJ\ST02\AR00\BS0603.TIM",
					"sx": 0,
					"sy": 0,
					"sWidth": 256,
					"sHeight": 256,
					"dx": 256,
					"dy": 0,
					"dWidth": 256,
					"dHeight": 256,
					"offsetX": 256,
					"offsetY": 0
				},
				{
					"image_file": "ST0D_02.BIN",
					"image_name": "..\OBJ\ST0D\AR02\DIF01.TIM",
					"pallet_file": "ST0D_02.BIN",
					"pallet_name": "..\OBJ\ST0D\AR02\DIF01.TIM",
					"sx": 0,
					"sy": 0,
					"sWidth": 256,
					"sHeight": 256,
					"dx": 0,
					"dy": 256,
					"dWidth": 256,
					"dHeight": 256,
					"offsetX": 0,
					"offsetY": 128
				}
			]
		}
	},
	"720": {
		"name": "Drache",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST05_01C.BIN",
				"image_name": "..\OBJ\ST05\AR01\EM0700.TIM",
				"pallet_file": "ST05_01C.BIN",
				"pallet_name": "..\OBJ\ST05\AR01\EM0700.TIM"
			}]
		}
	},
	"740": {
		"name": "Barrell (Cutscene)",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
					"image_file": "ST03_00.BIN",
					"image_name": "..\OBJ\ST03\AR00A\EM2500.TIM",
					"pallet_file": "ST03_00.BIN",
					"pallet_name": "..\OBJ\ST03\AR00A\EM2500.TIM"
				},
				{
					"image_file": "ST03_00.BIN",
					"image_name": "..\OBJ\ST03\AR00A\EM2500.TIM",
					"pallet_file": "ST03_00.BIN",
					"pallet_name": "..\OBJ\ST03\AR00A\EM2501.TIM",
					"sx": 101,
					"sy": 154,
					"sWidth": 155,
					"sHeight": 102,
					"dx": 101,
					"dy": 154,
					"dWidth": 155,
					"dHeight": 102
				},
				{
					"image_file": "ST03_00.BIN",
					"image_name": "..\OBJ\ST03\AR00A\EM2500.TIM",
					"pallet_file": "ST03_00.BIN",
					"pallet_name": "..\OBJ\ST03\AR00A\EM2501.TIM",
					"sx": 58,
					"sy": 143,
					"sWidth": 45,
					"sHeight": 48,
					"dx": 58,
					"dy": 143,
					"dWidth": 45,
					"dHeight": 48
				},
				{
					"image_file": "ST03_00.BIN",
					"image_name": "..\OBJ\ST03\AR00A\EM2500.TIM",
					"pallet_file": "ST03_00.BIN",
					"pallet_name": "..\OBJ\ST03\AR00A\EM2501.TIM",
					"sx": 112,
					"sy": 98,
					"sWidth": 144,
					"sHeight": 58,
					"dx": 112,
					"dy": 98,
					"dWidth": 144,
					"dHeight": 58
				}
			]
		}
	},
	"820": {
		"name": "Beast Hunter Dog",
		"texture": {
			"width": 128,
			"height": 128,
			"images": [{
				"image_file": "ST08_03.BIN",
				"image_name": "..\OBJ\ST08\AR03\EM5200.TIM",
				"pallet_file": "ST08_03.BIN",
				"pallet_name": "..\OBJ\ST08\AR03\EM5200.TIM"
			}]
		}
	},
	"840": {
		"name": "Hanmuru Doll (CutScene)",
		"head": 0,
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST00_03.BIN",
				"image_name": "..\OBJ\ST00\AR01\BS0200x.TIM",
				"pallet_file": "ST00_03.BIN",
				"pallet_name": "..\OBJ\ST00\AR01\BS0200x.TIM",
				"pallet_index": 0
			}]
		}
	},
	"920": {
		"name": "Junk Shop Lady",
		"texture": {
			"width": 256,
			"height": 128,
			"images": [{
				"image_file": "ST03_00.BIN",
				"image_name": "..\OBJ\ST03\AR00A\EM0900.TIM",
				"pallet_file": "ST03_00.BIN",
				"pallet_name": "..\OBJ\ST03\AR00A\EM0900.TIM",
				"pallet_index": 0
			}]
		}
	},
	"940": {
		"name": "Tron Bonne (Cutscene)",
		"slice": [16],
		"texture": {
			"width": 512,
			"height": 512,
			"images": [{
					"image_file": "ST05_00B.BIN",
					"image_name": "..\OBJ\ST05\AR00B\BS0900.TIM",
					"pallet_file": "ST05_00B.BIN",
					"pallet_name": "..\OBJ\ST05\AR00B\BS0900.TIM"
				},
				{
					"image_file": "ST05_00B.BIN",
					"image_name": "..\OBJ\ST05\AR00B\BS0902.TIM",
					"pallet_file": "ST05_00B.BIN",
					"pallet_name": "..\OBJ\ST05\AR00B\BS0900.TIM",
					"offsetX": 256,
					"offsetY": 0,
					"sx": 0,
					"sy": 0,
					"sWidth": 256,
					"sHeight": 256,
					"dx": 256,
					"dy": 0,
					"dWidth": 256,
					"dHeight": 256
				}
			]
		}
	},
	"a20": {
		"name": "Flutter",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST00_04.BIN",
				"image_name": "..\OBJ\ST00\AR04\EM0A00.TIM",
				"pallet_file": "ST00_04.BIN",
				"pallet_name": "..\OBJ\ST00\AR04\EM0A00.TIM",
				"pallet_index": 0
			}]
		}
	},
	"b20": {
		"name": "Gesellschaft",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST06_02.BIN",
				"image_name": "..\OBJ\ST06\AR02\EM0B00.TIM",
				"pallet_file": "ST06_02.BIN",
				"pallet_name": "..\OBJ\ST06\AR02\EM0B00.TIM"
			}]
		}
	},
	"a40": {
		"name": "Bon Bonne (Legs)",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST17C.BIN",
				"image_name": "..\OBJ\ST17\AR00\BS0A00.TIM",
				"pallet_file": "ST17C.BIN",
				"pallet_name": "..\OBJ\ST17\AR00\BS0A00.TIM"
			}]
		}
	},
	"c60": {
		"name": "Drache",
		"texture": {
			"width": 256,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST03_00.BIN",
				"image_name": "..\OBJ\ST03\AR00A\SH0C00.TIM",
				"pallet_file": "ST03_00.BIN",
				"pallet_name": "..\OBJ\ST03\AR00A\SH0C00.TIM"
			}]
		}
	},
	"b40": {
		"name": "Teisel Bonne (Cutscene)",
		"texture": {
			"width": 512,
			"height": 512,
			"images": [{
					"image_file": "ST06_03.BIN",
					"image_name": "..\OBJ\ST06\AR03\BS0B00.TIM",
					"pallet_file": "ST06_03.BIN",
					"pallet_name": "..\OBJ\ST06\AR03\BS0B00.TIM"
				},
				{
					"image_file": "ST06_03.BIN",
					"image_name": "..\OBJ\ST06\AR03\BS0B00.TIM",
					"pallet_file": "ST06_03.BIN",
					"pallet_name": "..\OBJ\FACE\BS0B03.TIM",
					"sx": 0,
					"sy": 0,
					"sWidth": 256,
					"sHeight": 256,
					"dx": 256,
					"dy": 0,
					"dWidth": 256,
					"dHeight": 256,
					"offsetX": 256,
					"offsetY": 0
				},
				{
					"image_file": "ST06_03.BIN",
					"image_name": "..\OBJ\FACE\BS0B03.TIM",
					"pallet_file": "ST06_03.BIN",
					"pallet_name": "..\OBJ\FACE\BS0B03.TIM",
					"sx": 0,
					"sy": 0,
					"sWidth": 256,
					"sHeight": 256,
					"dx": 0,
					"dy": 256,
					"dWidth": 256,
					"dHeight": 256,
					"offsetX": 0,
					"offsetY": 256
				}
			]
		}
	},
	"c40": {
		"name": "Barukon Gelede",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST0B_00.BIN",
				"image_name": "..\OBJ\ST0B\AR00\BS0C00.TIM",
				"pallet_file": "ST0B_00.BIN",
				"pallet_name": "..\OBJ\ST0B\AR00\BS0C00.TIM"
			}]
		}
	},
	"1960": {
		"name": "Barukon Gelede (Submerged)",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST0B_00.BIN",
				"image_name": "..\OBJ\ST0B\AR00\BS0C00.TIM",
				"pallet_file": "ST0B_00.BIN",
				"pallet_name": "..\OBJ\ST0B\AR00\BS0C00.TIM"
			}]
		}
	},
	"1860": {
		"name": "Missile",
		"texture": {
			"width": 256,
			"height": 256,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST0B_00.BIN",
				"image_name": "..\OBJ\ST0B\AR00\EM3100.TIM",
				"pallet_file": "ST0B_00.BIN",
				"pallet_name": "..\OBJ\ST0B\AR00\SH1800.TIM"
			}]
		}
	},
	"d20": {
		"name": "Osh",
		"texture": {
			"width": 128,
			"height": 96,
			"images": [{
				"image_file": "ST04_00.BIN",
				"image_name": "..\OBJ\ST04\AR00A\EM0d00.TIM",
				"pallet_file": "ST04_00.BIN",
				"pallet_name": "..\OBJ\ST04\AR00A\EM0d00.TIM"
			}]
		}
	},
	"d40": {
		"name": "Bon Bonne (Flying)",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST06_02.BIN",
				"image_name": "..\OBJ\ST06\AR02\BS0D00.TIM",
				"pallet_file": "ST06_02.BIN",
				"pallet_name": "..\OBJ\ST06\AR02\BS0D00.TIM"
			}]
		}
	},
	"e20": {
		"name": "Orudakoitan",
		"texture": {
			"width": 256,
			"height": 256,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST09_00.BIN",
				"image_name": "..\OBJ\ST09\AR00\EM0e00.TIM",
				"pallet_file": "ST09_00.BIN",
				"pallet_name": "..\OBJ\ST09\AR00\EM0200.TIM"
			}]
		}
	},
	"e40": {
		"name": "Wily the Boatshop Owner",
		"texture": {
			"width": 512,
			"height": 512,
			"images": [{
					"image_file": "ST0D_02.BIN",
					"image_name": "..\OBJ\ST0D\AR02\EM3800.TIM",
					"pallet_file": "ST0D_02.BIN",
					"pallet_name": "..\OBJ\ST0D\AR02\EM3800.TIM"
				},
				{
					"image_file": "ST0D_02.BIN",
					"image_name": "..\OBJ\FACE\EM3801.TIM",
					"pallet_file": "ST0D_02.BIN",
					"pallet_name": "..\OBJ\ST0D\AR02\EM3800.TIM",
					"sx": 0,
					"sy": 0,
					"sWidth": 256,
					"sHeight": 256,
					"dx": 256,
					"dy": 0,
					"dWidth": 256,
					"dHeight": 256,
					"offsetX": 256,
					"offsetY": 0
				}
			]
		}
	},
	"e60": {
		"name": "Police Car",
		"texture": {
			"width": 256,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST03_00.BIN",
				"image_name": "..\OBJ\ST03\AR00A\CA0800.TIM",
				"pallet_file": "ST03_00.BIN",
				"pallet_name": "..\OBJ\ST03\AR00A\CA0800.TIM"
			}]
		}
	},
	"2d60": {
		"name": "Police Car",
		"texture": {
			"width": 256,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST03_00.BIN",
				"image_name": "..\OBJ\ST03\AR00A\CA0800.TIM",
				"pallet_file": "ST03_00.BIN",
				"pallet_name": "..\OBJ\ST03\AR00A\CA0800.TIM"
			}]
		}
	},
	"12260": {
		"name": "Police Car",
		"texture": {
			"width": 256,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST03_00.BIN",
				"image_name": "..\OBJ\ST03\AR00A\CA0800.TIM",
				"pallet_file": "ST03_00.BIN",
				"pallet_name": "..\OBJ\ST03\AR00A\CA0800.TIM"
			}]
		}
	},
	"80460": {
		"name": "Police Car",
		"texture": {
			"width": 256,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST03_00.BIN",
				"image_name": "..\OBJ\ST03\AR00A\CA0800.TIM",
				"pallet_file": "ST03_00.BIN",
				"pallet_name": "..\OBJ\ST03\AR00A\CA0800.TIM"
			}]
		}
	},
	"f20": {
		"name": "Jim",
		"texture": {
			"width": 128,
			"height": 96,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST04_00.BIN",
				"image_name": "..\OBJ\ST04\AR00A\EM0f00.TIM",
				"pallet_file": "ST04_00.BIN",
				"pallet_name": "..\OBJ\ST04\AR00A\EM0f00.TIM"
			}]
		}
	},
	"f40": {
		"name": "Fokkerwolf",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST17C.BIN",
				"image_name": "..\OBJ\ST17\AR00\BS0F00.TIM",
				"pallet_file": "ST17C.BIN",
				"pallet_name": "..\OBJ\ST17\AR00\BS0F00.TIM"
			}]
		}
	},
	"2760": {
		"name": "Fokkerwolf Missile",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST17C.BIN",
				"image_name": "..\OBJ\ST17\AR00\BS0F00.TIM",
				"pallet_file": "ST17C.BIN",
				"pallet_name": "..\OBJ\ST17\AR00\BS0F00.TIM"
			}]
		}
	},
	"1020": {
		"name": "Bird"
	},
	"1120": {
		"name": "Data the Monkey",
		"cut": 1,
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "EXIT_MAP.BIN",
				"image_name": "..\BG\CHAR\GAUGE01u.TIM",
				"pallet_file": "EXIT_MAP.BIN",
				"pallet_name": "..\OBJ\COMM\EM1100.TIM",
				"pallet_index": 0
			}]
		}
	},
	"1140": {
		"name": "Karumuna Bash 0",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST13_00B.BIN",
				"image_name": "..\OBJ\ST13\AR00\BS1100.TIM",
				"pallet_file": "ST13_00B.BIN",
				"pallet_name": "..\OBJ\ST13\AR00\BS1100.TIM"
			}]
		}
	},
	"1240": {
		"name": "Gesellschaft (with Cannons)",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST17.BIN",
				"image_name": "..\OBJ\ST17\AR00\EM0B00.TIM",
				"pallet_file": "ST17.BIN",
				"pallet_name": "..\OBJ\ST17\AR00\EM0B00.TIM"
			}]
		}
	},
	"1160": {
		"name": "Support Car",
		"texture": {
			"width": 256,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "EXIT_MAP.BIN",
				"image_name": "..\OBJ\COMM\SH1100.TIM",
				"pallet_file": "EXIT_MAP.BIN",
				"pallet_name": "..\OBJ\COMM\SH1100.TIM",
				"pallet_index": 0
			}]
		}
	},
	"1320": {
		"name": "Junk Shop Owner",
		"texture": {
			"width": 256,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST03_00.BIN",
				"image_name": "..\OBJ\ST03\AR00A\EM1300B.TIM",
				"pallet_file": "ST03_00.BIN",
				"pallet_name": "..\OBJ\ST03\AR00A\EM1300B.TIM",
				"pallet_index": 0
			}]
		}
	},
	"1340": {
		"name": "Megaman Juno",
		"texture": {
			"width": 512,
			"height": 512,
			"images": [{
					"image_file": "ST1A_01B.BIN",
					"image_name": "..\OBJ\ST1A\AR01\BS1300.TIM",
					"pallet_file": "ST1A_01B.BIN",
					"pallet_name": "..\OBJ\ST1A\AR01\BS1300.TIM"
				},
				{
					"image_file": "ST1A_01B.BIN",
					"image_name": "..\OBJ\FACE\BS1304.TIM",
					"pallet_file": "ST1A_01B.BIN",
					"pallet_name": "..\OBJ\ST1A\AR01\BS1300.TIM",
					"sx": 0,
					"sy": 0,
					"sWidth": 256,
					"sHeight": 256,
					"dx": 256,
					"dy": 0,
					"dWidth": 256,
					"dHeight": 256,
					"offsetX": 256,
					"offsetY": 0
				}
			]
		}
	},
	"1360": {
		"name": "Mouse",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST09_00.BIN",
				"image_name": "..\OBJ\ST09\AR00\MOUSE.TIM",
				"pallet_file": "ST09_00.BIN",
				"pallet_name": "..\OBJ\ST09\AR00\MOUSE.TIM"
			}]
		}
	},
	"1420": {
		"name": "Amelia the Mayor",
		"texture": {
			"width": 256,
			"height": 128,
			"images": [{
				"image_file": "ST03_07.BIN",
				"image_name": "..\OBJ\ST03\AR07\EM1400.TIM",
				"pallet_file": "ST03_07.BIN",
				"pallet_name": "..\OBJ\ST03\AR07\EM1400.TIM"
			}]
		}
	},
	"1440": {
		"name": "Gai-nee Tooren",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST1D_02.BIN",
				"image_name": "..\OBJ\ST1D\AR02\BS1400.TIM",
				"pallet_file": "ST1D_02.BIN",
				"pallet_name": "..\OBJ\ST1D\AR02\BS1400.TIM"
			}]
		}
	},
	"1520": {
		"name": "NPC Girl",
		"texture": {
			"width": 128,
			"height": 128,
			"images": [{
				"image_file": "ST04_00D.BIN",
				"image_name": "..\OBJ\ST04\AR00D\EM1500.TIM",
				"pallet_file": "ST04_00D.BIN",
				"pallet_name": "..\OBJ\ST04\AR00D\EM1500.TIM"
			}]
		}
	},
	"1540": {
		"name": "Garudoriten (Cutscene)",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST14_00B.BIN",
				"image_name": "..\OBJ\ST14\AR00\BS1500.TIM",
				"pallet_file": "ST14_00B.BIN",
				"pallet_name": "..\OBJ\ST14\AR00\BS1500.TIM"
			}]
		}
	},
	"1560": {
		"name": "Broken Support Car",
		"texture": {
			"width": 256,
			"height": 128,
			"images": [{
				"image_file": "ST03_00.BIN",
				"image_name": "..\OBJ\ST03\AR00A\SH1500.TIM",
				"pallet_file": "ST03_00.BIN",
				"pallet_name": "..\OBJ\ST03\AR00A\SH1500.TIM",
				"pallet_index": 0
			}]
		}
	},
	"1620": {
		"name": "Bensley",
		"texture": {
			"width": 256,
			"height": 128,
			"images": [{
				"image_file": "ST04_00.BIN",
				"image_name": "..\OBJ\ST04\AR00A\EM0d00.TIM",
				"pallet_file": "ST04_00.BIN",
				"pallet_name": "..\OBJ\ST04\AR00A\EM1600.TIM",
			}]
		}
	},
	"1640": {
		"name": "Megaman Juno Stage 2",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST1A_02B.BIN",
				"image_name": "..\OBJ\ST1A\AR02\BS1600.TIM",
				"pallet_file": "ST1A_02B.BIN",
				"pallet_name": "..\OBJ\ST1A\AR02\BS1600.TIM"
			}]
		}
	},
	"1720": {
		"name": "Nurse with Short Hair",
		"texture": {
			"width": 256,
			"height": 128,
			"images": [{
				"image_file": "ST05_00J.BIN",
				"image_name": "..\OBJ\ST05\AR00J\EM1700.TIM",
				"pallet_file": "ST05_00J.BIN",
				"pallet_name": "..\OBJ\ST05\AR00J\EM1700.TIM"
			}]
		}
	},
	"11720": {
		"name": "Nurse with Pigtails",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST08_01.BIN",
				"image_name": "..\OBJ\ST08\AR01\EM6500.TIM",
				"pallet_file": "ST08_01.BIN",
				"pallet_name": "..\OBJ\ST08\AR01\EM6500.TIM"
			}]
		}
	},
	"1740": {
		"name": "Garudoriten",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST14_00B.BIN",
				"image_name": "..\OBJ\ST14\AR00\BS1500.TIM",
				"pallet_file": "ST14_00B.BIN",
				"pallet_name": "..\OBJ\ST14\AR00\BS1500.TIM"
			}]
		}
	},
	"2360": {
		"name": "Garudoriten (Dormant)",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST14_00B.BIN",
				"image_name": "..\OBJ\ST14\AR00\BS1500.TIM",
				"pallet_file": "ST14_00B.BIN",
				"pallet_name": "..\OBJ\ST14\AR00\BS1500.TIM"
			}]
		}
	},
	"1920": {
		"name": "Mirumijee",
		"texture": {
			"width": 256,
			"height": 128,
			"images": [{
				"image_file": "ST00_01.BIN",
				"image_name": "..\OBJ\ST00\AR01\EM0400.TIM",
				"pallet_file": "ST00_01.BIN",
				"pallet_name": "..\OBJ\ST00\AR01\EM0400.TIM",
				"pallet_index": 0
			}]
		}
	},
	"1a20": {
		"name": "Blumebear Cockpit 0",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST05_01.BIN",
				"image_name": "..\OBJ\ST05\AR01\EM1a00.TIM",
				"pallet_file": "ST05_01.BIN",
				"pallet_name": "..\OBJ\ST05\AR01\EM1a00.TIM"
			}]
		}
	},
	"11a20": {
		"name": "Blumebear Cockpit 1",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST05_01.BIN",
				"image_name": "..\OBJ\ST05\AR01\EM1a00.TIM",
				"pallet_file": "ST05_01.BIN",
				"pallet_name": "..\OBJ\ST05\AR01\EM1a01.TIM"
			}]
		}
	},
	"21a20": {
		"name": "Blumebear Cockpit 2",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST05_01.BIN",
				"image_name": "..\OBJ\ST05\AR01\EM1a00.TIM",
				"pallet_file": "ST05_01.BIN",
				"pallet_name": "..\OBJ\ST05\AR01\EM1a02.TIM"
			}]
		}
	},
	"31a20": {
		"name": "Blumebear Cockpit 3",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST0CB.BIN",
				"image_name": "..\OBJ\ST0C\AR00B\EM1A03.TIM",
				"pallet_file": "ST0CB.BIN",
				"pallet_name": "..\OBJ\ST0C\AR00B\EM3B00.TIM"
			}]
		}
	},
	"1a60": {
		"name": "Foo-Roo",
		"texture": {
			"width": 128,
			"height": 128,
			"images": [{
				"image_file": "ST09_05.BIN",
				"image_name": "..\OBJ\ST09\AR00\SH1A00.TIM",
				"pallet_file": "ST09_05.BIN",
				"pallet_name": "..\OBJ\ST09\AR00\SH1A00.TIM"
			}]
		}
	},
	"1b20": {
		"name": "Ira Walking",
		"texture": {
			"width": 128,
			"height": 96,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST05_00J.BIN",
				"image_name": "..\OBJ\ST05\AR00J\EM1B00.TIM",
				"pallet_file": "ST05_00J.BIN",
				"pallet_name": "..\OBJ\ST05\AR00J\EM1B00.TIM"
			}]
		}
	},
	"1c20": {
		"name": "Blumebear Tread 0",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST05_01.BIN",
				"image_name": "..\OBJ\ST05\AR01\EM1a00.TIM",
				"pallet_file": "ST05_01.BIN",
				"pallet_name": "..\OBJ\ST05\AR01\EM1a00.TIM"
			}]
		}
	},
	"10460": {
		"name": "Car 1 (Truck)",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST05_00.BIN",
				"image_name": "..\OBJ\ST05\AR00A\CA0000.TIM",
				"pallet_file": "ST05_00.BIN",
				"pallet_name": "..\OBJ\ST05\AR00A\CA0000.TIM"
			}]
		}
	},
	"11c20": {
		"name": "Blumebear Tread 1",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST05_01.BIN",
				"image_name": "..\OBJ\ST05\AR01\EM1a00.TIM",
				"pallet_file": "ST05_01.BIN",
				"pallet_name": "..\OBJ\ST05\AR01\EM1a01.TIM"
			}]
		}
	},
	"20460": {
		"name": "Car 2",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST05_00.BIN",
				"image_name": "..\OBJ\ST05\AR00A\CA0000.TIM",
				"pallet_file": "ST05_00.BIN",
				"pallet_name": "..\OBJ\ST05\AR00A\CA0000.TIM"
			}]
		}
	},
	"21c20": {
		"name": "Blumebear Tread 2",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST05_01.BIN",
				"image_name": "..\OBJ\ST05\AR01\EM1a00.TIM",
				"pallet_file": "ST05_01.BIN",
				"pallet_name": "..\OBJ\ST05\AR01\EM1a02.TIM"
			}]
		}
	},
	"30460": {
		"name": "Car 3",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST05_00.BIN",
				"image_name": "..\OBJ\ST05\AR00A\CA0000.TIM",
				"pallet_file": "ST05_00.BIN",
				"pallet_name": "..\OBJ\ST05\AR00A\CA0001.TIM"
			}]
		}
	},
	"31c20": {
		"name": "Blumebear Tread 3",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST0CB.BIN",
				"image_name": "..\OBJ\ST0C\AR00B\EM1A03.TIM",
				"pallet_file": "ST0CB.BIN",
				"pallet_name": "..\OBJ\ST0C\AR00B\EM3B00.TIM"
			}]
		}
	},
	"40460": {
		"name": "Car 4",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST05_00.BIN",
				"image_name": "..\OBJ\ST05\AR00A\CA0000.TIM",
				"pallet_file": "ST05_00.BIN",
				"pallet_name": "..\OBJ\ST05\AR00A\CA0001.TIM"
			}]
		}
	},
	"50460": {
		"name": "Car 5",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST05_00.BIN",
				"image_name": "..\OBJ\ST05\AR00A\CA0000.TIM",
				"pallet_file": "ST05_00.BIN",
				"pallet_name": "..\OBJ\ST05\AR00A\CA0001.TIM"
			}]
		}
	},
	"60460": {
		"name": "Car 6 (School Bus)",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST05_00.BIN",
				"image_name": "..\OBJ\ST05\AR00A\CA0601.TIM",
				"pallet_file": "ST05_00.BIN",
				"pallet_name": "..\OBJ\ST05\AR00A\CA0601.TIM"
			}]
		}
	},
	"1d20": {
		"name": "Seagull",
		"texture": {
			"width": 64,
			"height": 64,
			"images": [{
				"image_file": "ST00_04.BIN",
				"image_name": "..\OBJ\ST00\AR04\EM1D00.TIM",
				"pallet_file": "ST00_04.BIN",
				"pallet_name": "..\OBJ\ST00\AR04\EM1D00.TIM",
				"pallet_index": 0
			}]
		}
	},
	"1f20": {
		"name": "Horokko (wall)",
		"texture": {
			"width": 256,
			"height": 128,
			"images": [{
				"image_file": "ST00_01.BIN",
				"image_name": "..\OBJ\ST00\AR01\EM0300.TIM",
				"pallet_file": "ST00_01.BIN",
				"pallet_name": "..\OBJ\ST00\AR01\EM0300.TIM",
				"pallet_index": 0
			}]
		}
	},
	"2020": {
		"name": "Maiberu Haagen 0",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST06_02.BIN",
				"image_name": "..\OBJ\ST06\AR02\EM2000.TIM",
				"pallet_file": "ST06_02.BIN",
				"pallet_name": "..\OBJ\ST06\AR02\EM2000.TIM"
			}]
		}
	},
	"12020": {
		"name": "Maiberu Haagen 1",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST06_02.BIN",
				"image_name": "..\OBJ\ST06\AR02\EM2000.TIM",
				"pallet_file": "ST06_02.BIN",
				"pallet_name": "..\OBJ\ST06\AR02\EM2001.TIM"
			}]
		}
	},
	"2220": {
		"name": "Old Man",
		"texture": {
			"width": 256,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST05_00G.BIN",
				"image_name": "..\OBJ\ST05\AR00G\EM2200.TIM",
				"pallet_file": "ST05_00G.BIN",
				"pallet_name": "..\OBJ\ST05\AR00G\EM2200.TIM"
			}]
		}
	},
	"2320": {
		"name": "Horunisse 0",
		"texture": {
			"width": 256,
			"height": 256,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST06_02.BIN",
				"image_name": "..\OBJ\ST06\AR02\EM2300.TIM",
				"pallet_file": "ST06_02.BIN",
				"pallet_name": "..\OBJ\ST06\AR02\EM2300.TIM"
			}]
		}
	},
	"12320": {
		"name": "Horunisse 1",
		"texture": {
			"width": 256,
			"height": 256,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST06_02.BIN",
				"image_name": "..\OBJ\ST06\AR02\EM2300.TIM",
				"pallet_file": "ST06_02.BIN",
				"pallet_name": "..\OBJ\ST06\AR02\EM2300A.TIM"
			}]
		}
	},
	"22320": {
		"name": "Horunisse 2",
		"texture": {
			"width": 256,
			"height": 256,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST06_02.BIN",
				"image_name": "..\OBJ\ST06\AR02\EM2300.TIM",
				"pallet_file": "ST06_02.BIN",
				"pallet_name": "..\OBJ\ST06\AR02\EM2300B.TIM"
			}]
		}
	},
	"2420": {
		"name": "Police Man",
		"texture": {
			"width": 256,
			"height": 128,
			"images": [{
				"image_file": "ST03_00.BIN",
				"image_name": "..\OBJ\ST03\AR00A\EM2400.TIM",
				"pallet_file": "ST03_00.BIN",
				"pallet_name": "..\OBJ\ST03\AR00A\EM2400.TIM"
			}]
		}
	},
	"2520": {
		"name": "Barrell Caskett",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
					"image_file": "ST03_00.BIN",
					"image_name": "..\OBJ\ST03\AR00A\EM2500.TIM",
					"pallet_file": "ST03_00.BIN",
					"pallet_name": "..\OBJ\ST03\AR00A\EM2500.TIM"
				},
				{
					"image_file": "ST03_00.BIN",
					"image_name": "..\OBJ\ST03\AR00A\EM2500.TIM",
					"pallet_file": "ST03_00.BIN",
					"pallet_name": "..\OBJ\ST03\AR00A\EM2501.TIM",
					"sx": 101,
					"sy": 154,
					"sWidth": 155,
					"sHeight": 102,
					"dx": 101,
					"dy": 154,
					"dWidth": 155,
					"dHeight": 102
				},
				{
					"image_file": "ST03_00.BIN",
					"image_name": "..\OBJ\ST03\AR00A\EM2500.TIM",
					"pallet_file": "ST03_00.BIN",
					"pallet_name": "..\OBJ\ST03\AR00A\EM2501.TIM",
					"sx": 58,
					"sy": 143,
					"sWidth": 45,
					"sHeight": 48,
					"dx": 58,
					"dy": 143,
					"dWidth": 45,
					"dHeight": 48
				},
				{
					"image_file": "ST03_00.BIN",
					"image_name": "..\OBJ\ST03\AR00A\EM2500.TIM",
					"pallet_file": "ST03_00.BIN",
					"pallet_name": "..\OBJ\ST03\AR00A\EM2501.TIM",
					"sx": 112,
					"sy": 98,
					"sWidth": 144,
					"sHeight": 58,
					"dx": 112,
					"dy": 98,
					"dWidth": 144,
					"dHeight": 58
				}
			]
		}
	},
	"2620": {
		"name": "Inspector",
		"texture": {
			"width": 196,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST03_00.BIN",
				"image_name": "..\OBJ\ST03\AR00A\EM2600.TIM",
				"pallet_file": "ST03_00.BIN",
				"pallet_name": "..\OBJ\ST03\AR00A\EM2600.TIM"
			}]
		}
	},
	"2720": {
		"name": "Ship Wheel",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST02.BIN",
				"image_name": "..\OBJ\ST02\AR00\BS0603.TIM",
				"pallet_file": "ST02.BIN",
				"pallet_name": "..\OBJ\ST02\AR00\EM2701.TIM",
				"pallet_index": 0
			}]
		}
	},
	"2820": {
		"name": "Tron Bonne",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST05_00.BIN",
				"image_name": "..\OBJ\ST05\AR00A\EM2800.TIM",
				"pallet_file": "ST05_00.BIN",
				"pallet_name": "..\OBJ\ST05\AR00A\EM2800.TIM"
			}]
		}
	},
	"2a20": {
		"name": "Paprika",
		"texture": {
			"width": 160,
			"height": 128,
			"images": [{
				"image_file": "ST04_00.BIN",
				"image_name": "..\OBJ\ST04\AR00A\EM2a00.TIM",
				"pallet_file": "ST04_00.BIN",
				"pallet_name": "..\OBJ\ST04\AR00A\EM2a00.TIM"
			}]
		}
	},
	"2b20": {
		"name": "Bon Bonne with Legs",
		"texture": {
			"width": 256,
			"height": 256,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST07_00.BIN",
				"image_name": "..\OBJ\ST07\AR00\EM2B00.TIM",
				"pallet_file": "ST07_00.BIN",
				"pallet_name": "..\OBJ\ST07\AR00\EM2B00.TIM"
			}]
		}
	},
	"2c20": {
		"name": "Zuuf Geleido Yellow",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST0B_00.BIN",
				"image_name": "..\OBJ\ST0B\AR00\EM2C00.TIM",
				"pallet_file": "ST0B_00.BIN",
				"pallet_name": "..\OBJ\ST0B\AR00\EM2C00.TIM"
			}]
		}
	},
	"12c20": {
		"name": "Zuuf Geleido Purple",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST0B_00.BIN",
				"image_name": "..\OBJ\ST0B\AR00\EM2C00.TIM",
				"pallet_file": "ST0B_00.BIN",
				"pallet_name": "..\OBJ\ST0B\AR00\EM2C001.TIM"
			}]
		}
	},
	"31520": {
		"name": "NPC Girl (Orange)",
		"texture": {
			"width": 128,
			"height": 128,
			"images": [{
				"image_file": "ST0C.BIN",
				"image_name": "..\OBJ\ST0C\AR00A\EM1500D.TIM",
				"pallet_file": "ST0C.BIN",
				"pallet_name": "..\OBJ\ST0C\AR00A\EM1500D.TIM"
			}]
		}
	},
	"2d20": {
		"name": "Reporter",
		"texture": {
			"width": 256,
			"height": 128,
			"images": [{
				"image_file": "ST03_00C.BIN",
				"image_name": "..\OBJ\ST03\AR00B\EM2D00.TIM",
				"pallet_file": "ST03_00C.BIN",
				"pallet_name": "..\OBJ\ST03\AR00B\EM2D00.TIM"
			}]
		}
	},
	"2e20": {
		"name": "Bon Bonne Tongue",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST06_02.BIN",
				"image_name": "..\OBJ\ST06\AR02\BS0D00.TIM",
				"pallet_file": "ST06_02.BIN",
				"pallet_name": "..\OBJ\ST06\AR02\BS0D00.TIM"
			}]
		}
	},
	"2f20": {
		"name": "Bon Bonne Head",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST06_02.BIN",
				"image_name": "..\OBJ\ST06\AR02\SH1000.TIM",
				"pallet_file": "ST06_02.BIN",
				"pallet_name": "..\OBJ\ST06\AR02\BS0D00.TIM"
			}]
		}
	},
	"3020": {
		"name": "Kattelox TV Producer",
		"texture": {
			"width": 128,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST04_00E.BIN",
				"image_name": "..\OBJ\ST04\AR00E\EM3000.TIM",
				"pallet_file": "ST04_00E.BIN",
				"pallet_name": "..\OBJ\ST04\AR00E\EM3000.TIM"
			}]
		}
	},
	"3120": {
		"name": "Torpedo",
		"texture": {
			"width": 256,
			"height": 256,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST0B_00.BIN",
				"image_name": "..\OBJ\ST0B\AR00\EM3100.TIM",
				"pallet_file": "ST0B_00.BIN",
				"pallet_name": "..\OBJ\ST0B\AR00\EM3100.TIM"
			}]
		}
	},
	"3220": {
		"name": "Blue Drache",
		"texture": {
			"width": 256,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST17.BIN",
				"image_name": "..\OBJ\ST17\AR00\EM3201.TIM",
				"pallet_file": "ST17.BIN",
				"pallet_name": "..\OBJ\ST17\AR00\EM3201.TIM"
			}]
		}
	},
	"3320": {
		"name": "Leopold",
		"texture": {
			"width": 256,
			"height": 256,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST0A_00.BIN",
				"image_name": "..\OBJ\ST0A\AR00A\EM3300.TIM",
				"pallet_file": "ST0A_00.BIN",
				"pallet_name": "..\OBJ\ST0A\AR00A\EM3300.TIM"
			}]
		}
	},
	"3420": {
		"name": "Librarian",
		"texture": {
			"width": 256,
			"height": 256,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST05_02.BIN",
				"image_name": "..\OBJ\ST05\AR02\EM3400.TIM",
				"pallet_file": "ST05_02.BIN",
				"pallet_name": "..\OBJ\ST05\AR02\EM3400.TIM"
			}]
		}
	},
	"3620": {
		"name": "Old City Technician",
		"texture": {
			"width": 128,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST19_03.BIN",
				"image_name": "..\OBJ\ST19\AR00D\EM3600.TIM",
				"pallet_file": "ST19_03.BIN",
				"pallet_name": "..\OBJ\ST19\AR00D\EM3600.TIM"
			}]
		}
	},
	"3720": {
		"name": "Sharukurusu",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST09_03.BIN",
				"image_name": "..\OBJ\ST09\AR00\EM3700.TIM",
				"pallet_file": "ST09_03.BIN",
				"pallet_name": "..\OBJ\ST09\AR00\EM3700.TIM"
			}]
		}
	},
	"3820": {
		"name": "Wily the Boatshop Owner",
		"texture": {
			"width": 256,
			"height": 128,
			"images": [{
				"image_file": "ST03_07.BIN",
				"image_name": "..\OBJ\ST03\AR07\EM3800.TIM",
				"pallet_file": "ST03_07.BIN",
				"pallet_name": "..\OBJ\ST03\AR07\EM3800.TIM"
			}]
		}
	},
	"3920": {
		"name": "Pregnant Woman",
		"texture": {
			"width": 200,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST03_00C.BIN",
				"image_name": "..\OBJ\ST03\AR00B\EM3900.TIM",
				"pallet_file": "ST03_00C.BIN",
				"pallet_name": "..\OBJ\ST03\AR00B\EM3900.TIM"
			}]
		}
	},
	"3a20": {
		"name": "Homework Girl",
		"texture": {
			"width": 256,
			"height": 128,
			"images": [{
				"image_file": "ST04_00E.BIN",
				"image_name": "..\OBJ\ST04\AR00E\EM3a00.TIM",
				"pallet_file": "ST04_00E.BIN",
				"pallet_name": "..\OBJ\ST04\AR00E\EM3a00.TIM"
			}]
		}
	},
	"38e0": {
		"name": "Junk"
	},
	"3b20": {
		"name": "Gun Battery",
		"texture": {
			"width": 256,
			"height": 256,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST0CB.BIN",
				"image_name": "..\OBJ\ST0C\AR00B\EM3B00.TIM",
				"pallet_file": "ST0CB.BIN",
				"pallet_name": "..\OBJ\ST0C\AR00B\EM3B00.TIM"
			}]
		}
	},
	"3520": {
		"name": "Chest",
		"texture": {
			"width": 128,
			"height": 128,
			"images": [{
				"image_file": "ST00_01.BIN",
				"image_name": "..\OBJ\ST00\AR01\EM3500.TIM",
				"pallet_file": "ST00_01.BIN",
				"pallet_name": "..\OBJ\ST00\AR01\EM3500.TIM",
				"pallet_index": 0
			}]
		}
	},
	"3d20": {
		"name": "Kuruguru",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST09_05.BIN",
				"image_name": "..\OBJ\ST09\AR00\EM3D00.TIM",
				"pallet_file": "ST09_05.BIN",
				"pallet_name": "..\OBJ\ST09\AR00\EM3D00.TIM"
			}]
		}
	},
	"3e20": {
		"name": "Jakko",
		"texture": {
			"width": 128,
			"height": 128,
			"images": [{
				"image_file": "ST0CB.BIN",
				"image_name": "..\OBJ\ST0C\AR00B\EM3E00.TIM",
				"pallet_file": "ST0CB.BIN",
				"pallet_name": "..\OBJ\ST0C\AR00B\EM3E00.TIM"
			}]
		}
	},
	"3f20": {
		"name": "News Caster",
		"texture": {
			"width": 256,
			"height": 128,
			"images": [{
				"image_file": "ST04_05.BIN",
				"image_name": "..\OBJ\ST04\AR05\EM3F00.TIM",
				"pallet_file": "ST04_05.BIN",
				"pallet_name": "..\OBJ\ST04\AR05\EM3F00.TIM"
			}]
		}
	},
	"4020": {
		"name": "Bruno (Top)",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST19_00.BIN",
				"image_name": "..\OBJ\ST19\AR00\EM4000N.TIM",
				"pallet_file": "ST19_00.BIN",
				"pallet_name": "..\OBJ\ST19\AR00\EM4000N.TIM"
			}]
		}
	},
	"4120": {
		"name": "Bruno (Bottom)",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST19_00.BIN",
				"image_name": "..\OBJ\ST19\AR00\EM4100N.TIM",
				"pallet_file": "ST19_00.BIN",
				"pallet_name": "..\OBJ\ST19\AR00\EM4000N.TIM"
			}]
		}
	},
	"1d60": {
		"name": "Bruno Missile",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST19_00.BIN",
				"image_name": "..\OBJ\ST19\AR00\EM4100N.TIM",
				"pallet_file": "ST19_00.BIN",
				"pallet_name": "..\OBJ\ST19\AR00\EM4000N.TIM"
			}]
		}
	},
	"4220": {
		"name": "Construction Worker",
		"texture": {
			"width": 128,
			"height": 128,
			"images": [{
				"image_file": "ST04_01.BIN",
				"image_name": "..\OBJ\ST04\AR01\EM4200.TIM",
				"pallet_file": "ST04_01.BIN",
				"pallet_name": "..\OBJ\ST04\AR01\EM4200.TIM"
			}]
		}
	},
	"4320": {
		"name": "Gorubesshu",
		"texture": {
			"width": 256,
			"height": 256,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST09_05.BIN",
				"image_name": "..\OBJ\ST09\AR00\EM4300.TIM",
				"pallet_file": "ST09_05.BIN",
				"pallet_name": "..\OBJ\ST09\AR00\EM4300.TIM"
			}]
		}
	},
	"4420": {
		"name": "TV Station Receptionist",
		"texture": {
			"width": 128,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST1C.BIN",
				"image_name": "..\OBJ\ST1C\AR00\EM4400.TIM",
				"pallet_file": "ST1C.BIN",
				"pallet_name": "..\OBJ\ST1C\AR00\EM4400.TIM"
			}]
		}
	},
	"4520": {
		"name": "Artillery the Digger",
		"texture": {
			"width": 256,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST03_00B.BIN",
				"image_name": "..\OBJ\ST03\AR00B\EM4500.TIM",
				"pallet_file": "ST03_00B.BIN",
				"pallet_name": "..\OBJ\ST03\AR00B\EM4500.TIM"
			}]
		}
	},
	"4620": {
		"name": "Hand me a Wrench",
		"texture": {
			"width": 256,
			"height": 256,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST0D_02.BIN",
				"image_name": "..\OBJ\ST0D\AR02\EM4600.TIM",
				"pallet_file": "ST0D_02.BIN",
				"pallet_name": "..\OBJ\ST0D\AR02\EM4600.TIM"
			}]
		}
	},
	"4720": {
		"name": "Hipbone Clerk",
		"texture": {
			"width": 128,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST04_00F.BIN",
				"image_name": "..\OBJ\ST04\AR00F\EM4700.TIM",
				"pallet_file": "ST04_00F.BIN",
				"pallet_name": "..\OBJ\ST04\AR00F\EM4700.TIM"
			}]
		}
	},
	"4820": {
		"name": "Gai-nee Tooren Segment",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST1D_02.BIN",
				"image_name": "..\OBJ\ST1D\AR02\BS1400.TIM",
				"pallet_file": "ST1D_02.BIN",
				"pallet_name": "..\OBJ\ST1D\AR02\BS1400.TIM"
			}]
		}
	},
	"4920": {
		"name": "Hipbone Customer",
		"texture": {
			"width": 256,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST03_00C.BIN",
				"image_name": "..\OBJ\ST03\AR00B\EM4900.TIM",
				"pallet_file": "ST03_00C.BIN",
				"pallet_name": "..\OBJ\ST03\AR00B\EM4900.TIM"
			}]
		}
	},
	"4a20": {
		"name": "Museum Curator",
		"texture": {
			"width": 256,
			"height": 128,
			"images": [{
				"image_file": "ST05_00J.BIN",
				"image_name": "..\OBJ\ST05\AR00J\EM4A00.TIM",
				"pallet_file": "ST05_00J.BIN",
				"pallet_name": "..\OBJ\ST05\AR00J\EM4A00.TIM"
			}]
		}
	},
	"4b20": {
		"name": "Firushudot",
		"texture": {
			"width": 256,
			"height": 256,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST14_00.BIN",
				"image_name": "..\OBJ\ST14\AR00\EM4B00.TIM",
				"pallet_file": "ST14_00.BIN",
				"pallet_name": "..\OBJ\ST14\AR00\EM4B00.TIM"
			}]
		}
	},
	"2860": {
		"name": "Water Ripple",
		"texture": {
			"width": 256,
			"height": 256,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST14_00.BIN",
				"image_name": "..\OBJ\ST14\AR00\EM4B00.TIM",
				"pallet_file": "ST14_00.BIN",
				"pallet_name": "..\OBJ\ST14\AR00\SHIBUKI.TIM"
			}]
		}
	},
	"4c20": {
		"name": "Sitting Old Woman",
		"texture": {
			"width": 176,
			"height": 130,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST04_00B.BIN",
				"image_name": "..\OBJ\ST04\AR00B\EM4c00.TIM",
				"pallet_file": "ST04_00B.BIN",
				"pallet_name": "..\OBJ\ST04\AR00B\EM4c00.TIM"
			}]
		}
	},
	"4d20": {
		"name": "Ira in Wheel Chair",
		"texture": {
			"width": 256,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST05_00J.BIN",
				"image_name": "..\OBJ\ST05\AR00J\EM4D00.TIM",
				"pallet_file": "ST05_00J.BIN",
				"pallet_name": "..\OBJ\ST05\AR00J\EM4D00.TIM"
			}]
		}
	},
	"4f20": {
		"name": "Gesellschaft Cannons",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST17.BIN",
				"image_name": "..\OBJ\ST17\AR00\EM4F00.TIM",
				"pallet_file": "ST17.BIN",
				"pallet_name": "..\OBJ\ST17\AR00\EM4F00.TIM"
			}]
		}
	},
	"4e20": {
		"name": "Butterfly"
	},
	"5020": {
		"name": "Eisle",
		"texture": {
			"width": 256,
			"height": 256,
			"y_uv_fix": -128,
			"images": [{
					"image_file": "ST08_00.BIN",
					"image_name": "..\OBJ\ST08\AR00A\EM5000.TIM",
					"pallet_file": "ST08_00.BIN",
					"pallet_name": "..\OBJ\ST08\AR00A\EM5000.TIM"
				},
				{
					"image_file": "ST08_00.BIN",
					"image_name": "..\OBJ\ST08\AR00A\EM5000.TIM",
					"pallet_file": "ST08_00.BIN",
					"pallet_name": "..\OBJ\ST08\AR00A\EM5001.TIM",
					"sx": 128,
					"sWidth": 128,
					"dx": 128
				}
			]
		}
	},
	"5320": {
		"name": "Bank Teller",
		"texture": {
			"width": 256,
			"height": 128,
			"images": [{
				"image_file": "ST04_04.BIN",
				"image_name": "..\OBJ\ST04\AR04\EM5300.TIM",
				"pallet_file": "ST04_04.BIN",
				"pallet_name": "..\OBJ\ST04\AR04\EM5300.TIM"
			}]
		}
	},
	"5520": {
		"name": "Frog",
		"texture": {
			"width": 128,
			"height": 128,
			"x_uv_fix": -128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST0D_00.BIN",
				"image_name": "..\OBJ\ST0D\AR00\EM5500.TIM",
				"pallet_file": "ST0D_00.BIN",
				"pallet_name": "..\OBJ\ST0D\AR00\EM5500.TIM",
				"sx": 128,
				"sWidth": 128
			}]
		}
	},
	"5720": {
		"name": "Karubun 0",
		"texture": {
			"width": 256,
			"height": 256,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST1A_01.BIN",
				"image_name": "..\OBJ\ST1A\AR01\EM5700.TIM",
				"pallet_file": "ST1A_01.BIN",
				"pallet_name": "..\OBJ\ST1A\AR01\EM5700.TIM"
			}]
		}
	},
	"5820": {
		"name": "Megaman Juno Core (Broken)",
		"texture": {
			"width": 512,
			"height": 512,
			"images": [{
					"image_file": "ST1A_02C.BIN",
					"image_name": "..\OBJ\ST1A\AR02\BS1300.TIM",
					"pallet_file": "ST1A_02C.BIN",
					"pallet_name": "..\OBJ\ST1A\AR02\BS1300.TIM"
				},
				{
					"image_file": "ST1A_02C.BIN",
					"image_name": "..\OBJ\FACE\BS1303.TIM",
					"pallet_file": "ST1A_02C.BIN",
					"pallet_name": "..\OBJ\ST1A\AR02\BS1300.TIM",
					"sx": 0,
					"sy": 0,
					"sWidth": 256,
					"sHeight": 256,
					"dx": 256,
					"dy": 0,
					"dWidth": 256,
					"dHeight": 256,
					"offsetX": 256,
					"offsetY": 0
				}
			]
		}
	},
	"5920": {
		"name": "Gai-nee Tooren Path"
	},
	"5b20": {
		"name": "Megaman Juno Core",
		"texture": {
			"width": 512,
			"height": 512,
			"images": [{
					"image_file": "ST1A_01B.BIN",
					"image_name": "..\OBJ\ST1A\AR01\BS1300.TIM",
					"pallet_file": "ST1A_01B.BIN",
					"pallet_name": "..\OBJ\ST1A\AR01\BS1300.TIM"
				},
				{
					"image_file": "ST1A_01B.BIN",
					"image_name": "..\OBJ\FACE\BS1304.TIM",
					"pallet_file": "ST1A_01B.BIN",
					"pallet_name": "..\OBJ\ST1A\AR01\BS1300.TIM",
					"sx": 0,
					"sy": 0,
					"sWidth": 256,
					"sHeight": 256,
					"dx": 256,
					"dy": 0,
					"dWidth": 256,
					"dHeight": 256,
					"offsetX": 256,
					"offsetY": 0
				}
			]
		}
	},
	"5c20": {
		"name": "Kattelox TV Camera Man",
		"texture": {
			"width": 128,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST1E.BIN",
				"image_name": "..\OBJ\ST1E\AR00\EM5C00.TIM",
				"pallet_file": "ST1E.BIN",
				"pallet_name": "..\OBJ\ST1E\AR00\EM5C00.TIM"
			}]
		}
	},
	"5d20": {
		"name": "Data the Monkey",
		"texture": {
			"width": 512,
			"height": 512,
			"images": [{
					"image_file": "EXIT_MAP.BIN",
					"image_name": "..\BG\CHAR\GAUGE01u.TIM",
					"pallet_file": "ST1A_02D.BIN",
					"pallet_name": "..\OBJ\FACE\EM5D01.TIM"
				},
				{
					"image_file": "ST1A_02D.BIN",
					"image_name": "..\OBJ\FACE\EM5D01.TIM",
					"pallet_file": "ST1A_02D.BIN",
					"pallet_name": "..\OBJ\FACE\EM5D01.TIM",
					"sx": 0,
					"sy": 0,
					"sWidth": 256,
					"sHeight": 256,
					"dx": 256,
					"dy": 0,
					"dWidth": 256,
					"dHeight": 256,
					"offsetX": 256,
					"offsetY": 0
				}
			]
		}
	},
	"5e20": {
		"name": "NPC Woman",
		"texture": {
			"width": 256,
			"height": 128,
			"images": [{
				"image_file": "ST04_02.BIN",
				"image_name": "..\OBJ\ST04\AR02\EM0900.TIM",
				"pallet_file": "ST04_02.BIN",
				"pallet_name": "..\OBJ\ST04\AR02\EM0900.TIM"
			}]
		}
	},
	"5f20": {
		"name": "Bon Bonne (with Floaty)",
		"texture": {
			"width": 256,
			"height": 256,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST15_00.BIN",
				"image_name": "..\OBJ\ST15\AR00\EM5F00.TIM",
				"pallet_file": "ST15_00.BIN",
				"pallet_name": "..\OBJ\ST15\AR00\EM5F00.TIM"
			}]
		}
	},
	"6020": {
		"name": "Refractor Extractor",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
					"image_file": "ST15_00.BIN",
					"image_name": "..\OBJ\ST15\AR00\EM6000.TIM",
					"pallet_file": "ST15_00.BIN",
					"pallet_name": "..\OBJ\ST15\AR00\EM6000.TIM"
				},
				{
					"image_file": "ST15_00.BIN",
					"image_name": "..\OBJ\ST15\AR00\EM6000.TIM",
					"pallet_file": "ST15_00.BIN",
					"pallet_name": "..\OBJ\ST15\AR00\EM6001.TIM",
					"sx": 208,
					"sy": 146,
					"sWidth": 48,
					"sHeight": 31,
					"dx": 208,
					"dy": 146,
					"dWidth": 48,
					"dHeight": 31
				},
				{
					"image_file": "ST15_00.BIN",
					"image_name": "..\OBJ\ST15\AR00\EM6000.TIM",
					"pallet_file": "ST15_00.BIN",
					"pallet_name": "..\OBJ\ST15\AR00\EM6001.TIM",
					"sx": 193,
					"sy": 101,
					"sWidth": 15,
					"sHeight": 54,
					"dx": 193,
					"dy": 101,
					"dWidth": 15,
					"dHeight": 54
				}
			]
		}
	},
	"6220": {
		"name": "Cat"
	},
	"6320": {
		"name": "Old City Hound",
		"texture": {
			"width": 128,
			"height": 128,
			"x_uv_fix": -128,
			"images": [{
				"image_file": "ST19_03.BIN",
				"image_name": "..\OBJ\ST19\AR00D\EM6300.TIM",
				"pallet_file": "ST19_03.BIN",
				"pallet_name": "..\OBJ\ST19\AR00D\EM6300.TIM",
				"sx": 128,
				"sWidth": 128
			}]
		}
	},
	"6620": {
		"name": "Gesellschaft Bow",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST17.BIN",
				"image_name": "..\OBJ\ST17\AR00\EM0B00.TIM",
				"pallet_file": "ST17.BIN",
				"pallet_name": "..\OBJ\ST17\AR00\EM0B00.TIM"
			}]
		}
	},
	"10820": {
		"name": "Beast Hunter Man",
		"texture": {
			"width": 256,
			"height": 256,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST08_03.BIN",
				"image_name": "..\OBJ\ST08\AR03\EM5400.TIM",
				"pallet_file": "ST08_03.BIN",
				"pallet_name": "..\OBJ\ST08\AR03\EM5400.TIM"
			}]
		}
	},
	"2160": {
		"name": "Beaster Hunter Ball",
		"texture": {
			"width": 64,
			"height": 64,
			"images": [{
				"image_file": "ST08_03.BIN",
				"image_name": "..\OBJ\ST08\AR03\BALL.TIM",
				"pallet_file": "ST08_03.BIN",
				"pallet_name": "..\OBJ\ST08\AR03\BALL.TIM"
			}]
		}
	},
	"10920": {
		"name": "Jetlag Bakery Lady",
		"texture": {
			"width": 256,
			"height": 128,
			"images": [{
				"image_file": "ST03_00.BIN",
				"image_name": "..\OBJ\ST03\AR00A\EM0900.TIM",
				"pallet_file": "ST03_00.BIN",
				"pallet_name": "..\OBJ\ST03\AR00A\EM0900B.TIM",
				"pallet_index": 0
			}]
		}
	},
	"11140": {
		"name": "Karumuna Bash 1",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST13_00B.BIN",
				"image_name": "..\OBJ\ST13\AR00\BS1100.TIM",
				"pallet_file": "ST13_00B.BIN",
				"pallet_name": "..\OBJ\ST13\AR00\BS1101.TIM"
			}]
		}
	},
	"11320": {
		"name": "NPC Man"
	},
	"13220": {
		"name": "Drache",
		"texture": {
			"width": 256,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST03_00.BIN",
				"image_name": "..\OBJ\ST03\AR00A\SH0C00.TIM",
				"pallet_file": "ST03_00.BIN",
				"pallet_name": "..\OBJ\ST03\AR00A\SH0C00.TIM"
			}]
		}
	},
	"15720": {
		"name": "Karubun 1",
		"texture": {
			"width": 256,
			"height": 256,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST1A_01.BIN",
				"image_name": "..\OBJ\ST1A\AR01\EM5700.TIM",
				"pallet_file": "ST1A_01.BIN",
				"pallet_name": "..\OBJ\ST1A\AR01\EM5701.TIM"
			}]
		}
	},
	"15e20": {
		"name": "NPC Woman (Purple)",
		"texture": {
			"width": 256,
			"height": 128,
			"images": [{
				"image_file": "ST03_00B.BIN",
				"image_name": "..\OBJ\ST03\AR00B\EM0900B.TIM",
				"pallet_file": "ST03_00B.BIN",
				"pallet_name": "..\OBJ\ST03\AR00B\EM0900B.TIM"
			}]
		}
	},
	"11320": {
		"name": "Staple Shop Owner",
		"texture": {
			"width": 256,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST03_00C.BIN",
				"image_name": "..\OBJ\ST03\AR00B\EM1300.TIM",
				"pallet_file": "ST03_00C.BIN",
				"pallet_name": "..\OBJ\ST03\AR00B\EM1300B.TIM"
			}]
		}
	},
	"11520": {
		"name": "Paprika's Owner",
		"texture": {
			"width": 128,
			"height": 128,
			"images": [{
				"image_file": "ST04_00.BIN",
				"image_name": "..\OBJ\ST04\AR00A\EM1500b.TIM",
				"pallet_file": "ST04_00.BIN",
				"pallet_name": "..\OBJ\ST04\AR00A\EM1500b.TIM"
			}]
		}
	},
	"12720": {
		"name": "Ship Wheel (Grabbed)",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST02.BIN",
				"image_name": "..\OBJ\ST02\AR00\BS0603.TIM",
				"pallet_file": "ST02.BIN",
				"pallet_name": "..\OBJ\ST02\AR00\EM2701.TIM",
				"pallet_index": 0
			}]
		}
	},
	"15320": {
		"name": "Salary Man",
		"texture": {
			"width": 256,
			"height": 128,
			"images": [{
				"image_file": "ST04_02.BIN",
				"image_name": "..\OBJ\ST04\AR02\EM5300B.TIM",
				"pallet_file": "ST04_02.BIN",
				"pallet_name": "..\OBJ\ST04\AR02\EM5300B.TIM"
			}]
		}
	},
	"20940": {
		"name": "Tron inside Feldynaught",
		"slice": [16],
		"texture": {
			"width": 512,
			"height": 512,
			"images": [{
					"image_file": "ST05_01C.BIN",
					"image_name": "..\OBJ\ST05\AR01\BS0900.TIM",
					"pallet_file": "ST05_01C.BIN",
					"pallet_name": "..\OBJ\ST05\AR01\BS0900B.TIM"
				},
				{
					"image_file": "ST05_01C.BIN",
					"image_name": "..\OBJ\ST05\AR01\BS0901.TIM",
					"pallet_file": "ST05_01C.BIN",
					"pallet_name": "..\OBJ\ST05\AR01\BS0900B.TIM",
					"sx": 0,
					"sy": 0,
					"sWidth": 256,
					"sHeight": 256,
					"dx": 256,
					"dy": 0,
					"dWidth": 256,
					"dHeight": 256,
					"offsetX": 256,
					"offsetY": 0
				}
			]
		}
	},
	"21140": {
		"name": "Karumuna Bash 2",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST13_00B.BIN",
				"image_name": "..\OBJ\ST13\AR00\BS1100.TIM",
				"pallet_file": "ST13_00B.BIN",
				"pallet_name": "..\OBJ\ST13\AR00\BS1102.TIM"
			}]
		}
	},
	"21320": {
		"name": "NPC Man",
		"texture": {
			"width": 256,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST04_00.BIN",
				"image_name": "..\OBJ\ST04\AR00A\EM1300.TIM",
				"pallet_file": "ST04_00.BIN",
				"pallet_name": "..\OBJ\ST04\AR00A\EM1300c.TIM"
			}]
		}
	},
	"25720": {
		"name": "Karubun 2",
		"texture": {
			"width": 256,
			"height": 256,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST1A_01.BIN",
				"image_name": "..\OBJ\ST1A\AR01\EM5700.TIM",
				"pallet_file": "ST1A_01.BIN",
				"pallet_name": "..\OBJ\ST1A\AR01\EM5702.TIM"
			}]
		}
	},
	"31320": {
		"name": "High Neck Records Owner",
		"texture": {
			"width": 256,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST03_00C.BIN",
				"image_name": "..\OBJ\ST03\AR00B\EM1300.TIM",
				"pallet_file": "ST03_00C.BIN",
				"pallet_name": "..\OBJ\ST03\AR00B\EM1300.TIM"
			}]
		}
	},
	"41320": {
		"name": "NPC Man",
		"texture": {
			"width": 256,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST04_00.BIN",
				"image_name": "..\OBJ\ST04\AR00A\EM1300.TIM",
				"pallet_file": "ST04_00.BIN",
				"pallet_name": "..\OBJ\ST04\AR00A\EM1300b.TIM"
			}]
		}
	},
	"51320": {
		"name": "Bronte Vegitable Shop Owner",
		"texture": {
			"width": 256,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST03_00B.BIN",
				"image_name": "..\OBJ\ST03\AR00B\EM1300C.TIM",
				"pallet_file": "ST03_00B.BIN",
				"pallet_name": "..\OBJ\ST03\AR00B\EM1300C.TIM"
			}]
		}
	},
	"1f60": {
		"name": "Red Traffic Cone 0",
		"texture": {
			"width": 82,
			"height": 60,
			"images": [{
				"image_file": "ST05_00C.BIN",
				"image_name": "..\OBJ\ST05\AR00C\CORN.TIM",
				"pallet_file": "ST05_00C.BIN",
				"pallet_name": "..\OBJ\ST05\AR00C\CORN.TIM"
			}]
		}
	},
	"11f60": {
		"name": "Red Traffic Cone 1",
		"texture": {
			"width": 82,
			"height": 60,
			"images": [{
				"image_file": "ST05_00C.BIN",
				"image_name": "..\OBJ\ST05\AR00C\CORN.TIM",
				"pallet_file": "ST05_00C.BIN",
				"pallet_name": "..\OBJ\ST05\AR00C\CORN.TIM"
			}]
		}
	},
	"21f60": {
		"name": "Red Traffic Cone 2",
		"texture": {
			"width": 82,
			"height": 60,
			"images": [{
				"image_file": "ST05_00C.BIN",
				"image_name": "..\OBJ\ST05\AR00C\CORN.TIM",
				"pallet_file": "ST05_00C.BIN",
				"pallet_name": "..\OBJ\ST05\AR00C\CORN.TIM"
			}]
		}
	},
	"31f60": {
		"name": "Red Traffic Cone 3",
		"texture": {
			"width": 82,
			"height": 60,
			"images": [{
				"image_file": "ST05_00C.BIN",
				"image_name": "..\OBJ\ST05\AR00C\CORN.TIM",
				"pallet_file": "ST05_00C.BIN",
				"pallet_name": "..\OBJ\ST05\AR00C\CORN.TIM"
			}]
		}
	},
	"41f60": {
		"name": "Red Traffic Cone 4",
		"texture": {
			"width": 82,
			"height": 60,
			"images": [{
				"image_file": "ST05_00C.BIN",
				"image_name": "..\OBJ\ST05\AR00C\CORN.TIM",
				"pallet_file": "ST05_00C.BIN",
				"pallet_name": "..\OBJ\ST05\AR00C\CORN.TIM"
			}]
		}
	},
	"2260": {
		"name": "Car Type 2",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST05_00E.BIN",
				"image_name": "..\OBJ\ST05\AR00E\CA0000.TIM",
				"pallet_file": "ST05_00E.BIN",
				"pallet_name": "..\OBJ\ST05\AR00E\CA0001.TIM"
			}]
		}
	},
	"d60": {
		"name": "City Gate Key",
		"texture": {
			"width": 168,
			"height": 168,
			"images": [{
				"image_file": "ST05_01.BIN",
				"image_name": "..\OBJ\ST05\AR01\KEY.TIM",
				"pallet_file": "ST05_01.BIN",
				"pallet_name": "..\OBJ\ST05\AR01\KEY.TIM"
			}]
		}
	},
	"f60": {
		"name": "KTOX TV Blimp",
		"texture": {
			"width": 256,
			"height": 256,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST06_02.BIN",
				"image_name": "..\OBJ\ST06\AR02\SH0F00.TIM",
				"pallet_file": "ST06_02.BIN",
				"pallet_name": "..\OBJ\ST06\AR02\SH0F00.TIM"
			}]
		}
	},
	"1660": {
		"name": "Bon Bonne Tongue Part",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST06_02.BIN",
				"image_name": "..\OBJ\ST06\AR02\BS0D00.TIM",
				"pallet_file": "ST06_02.BIN",
				"pallet_name": "..\OBJ\ST06\AR02\BS0D00.TIM"
			}]
		}
	},
	"1760": {
		"name": "Bon Bonne Missile",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST06_02.BIN",
				"image_name": "..\OBJ\ST06\AR02\BS0D00.TIM",
				"pallet_file": "ST06_02.BIN",
				"pallet_name": "..\OBJ\ST06\AR02\BS0D00.TIM"
			}]
		}
	},
	"1060": {
		"name": "Drache Magnet",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST06_02.BIN",
				"image_name": "..\OBJ\ST06\AR02\SH1000.TIM",
				"pallet_file": "ST06_02.BIN",
				"pallet_name": "..\OBJ\ST06\AR02\SH1000.TIM"
			}]
		}
	},
	"6420": {
		"name": "Art School Student",
		"texture": {
			"width": 256,
			"height": 256,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST08_00.BIN",
				"image_name": "..\OBJ\ST08\AR00A\EM6400.TIM",
				"pallet_file": "ST08_00.BIN",
				"pallet_name": "..\OBJ\ST08\AR00A\EM6400.TIM"
			}]
		}
	},
	"2660": {
		"name": "Balloon Fantasy 0",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST08_03.BIN",
				"image_name": "..\OBJ\ST08\AR03\BALLOON.TIM",
				"pallet_file": "ST08_03.BIN",
				"pallet_name": "..\OBJ\ST08\AR03\BALLOON.TIM"
			}]
		}
	},
	"12660": {
		"name": "Balloon Fantasy 1",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST08_03.BIN",
				"image_name": "..\OBJ\ST08\AR03\BALLOON.TIM",
				"pallet_file": "ST08_03.BIN",
				"pallet_name": "..\OBJ\ST08\AR03\BALLOON.TIM"
			}]
		}
	},
	"22660": {
		"name": "Balloon Fantasy 2",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST08_03.BIN",
				"image_name": "..\OBJ\ST08\AR03\BALLOON.TIM",
				"pallet_file": "ST08_03.BIN",
				"pallet_name": "..\OBJ\ST08\AR03\BALLOON.TIM"
			}]
		}
	},
	"32660": {
		"name": "Balloon Fantasy 3",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST08_03.BIN",
				"image_name": "..\OBJ\ST08\AR03\BALLOON.TIM",
				"pallet_file": "ST08_03.BIN",
				"pallet_name": "..\OBJ\ST08\AR03\BALLOON.TIM"
			}]
		}
	},
	"42660": {
		"name": "Balloon Fantasy 4",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST08_03.BIN",
				"image_name": "..\OBJ\ST08\AR03\BALLOON.TIM",
				"pallet_file": "ST08_03.BIN",
				"pallet_name": "..\OBJ\ST08\AR03\BALLOON.TIM"
			}]
		}
	},
	"52660": {
		"name": "Balloon Fantasy 5",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST08_03.BIN",
				"image_name": "..\OBJ\ST08\AR03\BALLOON.TIM",
				"pallet_file": "ST08_03.BIN",
				"pallet_name": "..\OBJ\ST08\AR03\BALLOON.TIM"
			}]
		}
	},
	"62660": {
		"name": "Balloon Fantasy 6",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST08_03.BIN",
				"image_name": "..\OBJ\ST08\AR03\BALLOON.TIM",
				"pallet_file": "ST08_03.BIN",
				"pallet_name": "..\OBJ\ST08\AR03\BALLOON.TIM"
			}]
		}
	},
	"72660": {
		"name": "Balloon Fantasy 7",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST08_03.BIN",
				"image_name": "..\OBJ\ST08\AR03\BALLOON.TIM",
				"pallet_file": "ST08_03.BIN",
				"pallet_name": "..\OBJ\ST08\AR03\BALLOON.TIM"
			}]
		}
	},
	"b60": {
		"name": "Rotating Trap",
		"texture": {
			"width": 128,
			"height": 128,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST09_03.BIN",
				"image_name": "..\OBJ\ST09\AR00\SH0B00.TIM",
				"pallet_file": "ST09_03.BIN",
				"pallet_name": "..\OBJ\ST09\AR00\SH0B00.TIM"
			}]
		}
	},
	"1260": {
		"name": "Boat",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST0B_00.BIN",
				"image_name": "..\OBJ\ST0B\AR00\BOAT.TIM",
				"pallet_file": "ST0B_00.BIN",
				"pallet_name": "..\OBJ\ST0B\AR00\BOAT.TIM"
			}]
		}
	},
	"1460": {
		"name": "Hawk",
		"texture": {
			"width": 128,
			"height": 128,
			"images": [{
				"image_file": "ST0D_02.BIN",
				"image_name": "..\OBJ\ST0D\AR02\TONBI.TIM",
				"pallet_file": "ST0D_02.BIN",
				"pallet_name": "..\OBJ\ST0D\AR02\TONBI.TIM"
			}]
		}
	},
	"1e60": {
		"name": "Jakko Nest",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST0E.BIN",
				"image_name": "..\OBJ\ST0E\AR00\EM3E00.TIM",
				"pallet_file": "ST0E.BIN",
				"pallet_name": "..\OBJ\ST0E\AR00\EM3E00.TIM"
			}]
		}
	},
	"1b60": {
		"name": "Trash Compactor",
		"texture": {
			"width": 256,
			"height": 256,
			"y_uv_fix": -128,
			"images": [{
				"image_file": "ST0E.BIN",
				"image_name": "..\OBJ\ST0E\AR00\ROLLER.TIM",
				"pallet_file": "ST0E.BIN",
				"pallet_name": "..\OBJ\ST0E\AR00\ROLLER.TIM"
			}]
		}
	},
	"11c60": {
		"name": "Ice Platform 1",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST0E.BIN",
				"image_name": "..\SCR\st0e\md700.TIM",
				"pallet_file": "ST0E.BIN",
				"pallet_name": "..\SCR\st0e\md700.TIM"
			}]
		}

	},
	"21c60": {
		"name": "Ice Platform 2",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST0E.BIN",
				"image_name": "..\SCR\st0e\md700.TIM",
				"pallet_file": "ST0E.BIN",
				"pallet_name": "..\SCR\st0e\md700.TIM"
			}]
		}
	},
	"31c60": {
		"name": "Trash Tread Door (Left)",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST0E.BIN",
				"image_name": "..\SCR\st0e\md700.TIM",
				"pallet_file": "ST0E.BIN",
				"pallet_name": "..\SCR\st0e\md710c.TIM"
			}]
		}
	},
	"41c60": {
		"name": "Trash Tread Cover",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST0E.BIN",
				"image_name": "..\SCR\st0e\md700.TIM",
				"pallet_file": "ST0E.BIN",
				"pallet_name": "..\SCR\st0e\md750c.TIM"
			}]
		}
	},
	"51c60": {
		"name": "Trash Tread Door (Right)",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST0E.BIN",
				"image_name": "..\SCR\st0e\md700.TIM",
				"pallet_file": "ST0E.BIN",
				"pallet_name": "..\SCR\st0e\md720c.TIM"
			}]
		}
	},
	"61c60": {
		"name": "Pressure Switch",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST0E.BIN",
				"image_name": "..\SCR\st0e\md700.TIM",
				"pallet_file": "ST0E.BIN",
				"pallet_name": "..\SCR\st0e\md730c.TIM"
			}]
		}
	},
	"81c60": {
		"name": "Bridge",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST0E.BIN",
				"image_name": "..\SCR\st0e\md700.TIM",
				"pallet_file": "ST0E.BIN",
				"pallet_name": "..\SCR\st0e\md710c.TIM"
			}]
		}
	},
	"5a20": {
		"name": "Eden",
		"head": 0,
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST1A_02.BIN",
				"image_name": "..\OBJ\ST1A\AR02\EM5A00.TIM",
				"pallet_file": "ST1A_02.BIN",
				"pallet_name": "..\OBJ\ST1A\AR02\EM5A00.TIM"
			}]
		}
	},
	"3660": {
		"name": "Cloud 0",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST1E.BIN",
				"image_name": "..\SCR\ST1E\EDKUMO00.TIM",
				"pallet_file": "ST1E.BIN",
				"pallet_name": "..\SCR\ST1E\EDKUMO00.TIM"
			}]
		}
	},
	"13660": {
		"name": "Cloud 1",
		"texture": {
			"width": 256,
			"height": 256,
			"images": [{
				"image_file": "ST1E.BIN",
				"image_name": "..\SCR\ST1E\EDKUMO00.TIM",
				"pallet_file": "ST1E.BIN",
				"pallet_name": "..\SCR\ST1E\EDKUMO00.TIM"
			}]
		}
	}
};

var FILES = [];


document.addEventListener("DOMContentLoaded", function () {

	// Set up THREE.js Context

	var context = document.getElementById("context");
	var width = context.offsetWidth;
	var height = context.offsetHeight;
	camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10000);
	camera.position.z = 55;
	camera.position.y = 19;
	camera.position.x = 3;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(width, height);
	renderer.domElement.style.margin = "0";
	renderer.domElement.style.padding = "0";
	renderer.setClearColor(0xeeeeee, 1);
	context.appendChild(renderer.domElement);

	controls = THREE.OrbitControls(camera, renderer.domElement);

	var grid = new THREE.GridHelper(100, 10);
	scene.add(grid);

	var light = new THREE.AmbientLight(0xffffff);
	scene.add(light);

	/*
	light = new THREE.PointLight(0xffffff);
	light.position.set(10,250,20);
	scene.add(light);
	*/

	render_sidebar();
	animate();

	var btn;
	btn = document.getElementById("download_dae");
	btn.addEventListener("click", function() {
		if (!mesh) {
			return;
		}
		
		var expt = new THREE.ColladaExporter();
		var output = expt.parse(mesh);
		var blob = new Blob([output], {
			type: "model/vnd.collada+xml"
		});
		saveAs(blob, mesh.name + '.dae');

	});

	btn = document.getElementById("download_json");
	btn.addEventListener("click", function() {
		if (!mesh) {
			return;
		}

		var exporter = new THREE.GLTFExporter();
		console.log(mesh);
		
		mesh.geometry.userData = {};
		exporter.parse(mesh, function(gltf) {
		console.log(gltf);
			
			var blob = new Blob([JSON.stringify(gltf)], {
				type: "application/json"
			});
			saveAs(blob, mesh.name + '.gltf');

		}, {});

	});

	btn = document.getElementById("download_img");
	btn.addEventListener("click", function() {
		if (!mesh) {
			return;
		}
		
		var canvas = mesh.material.map.image;
		
		if(!canvas) {
			return;
		}

		canvas.toBlob(function(blob) {
			saveAs(blob, mesh.name + ".png");
		}, "image/png");

	});

	var upload = document.getElementById("upload");
	upload.addEventListener("click", function () {

		var f = document.getElementById("files");
		f.click();

	});

	document.getElementById("files").addEventListener("change", function (evt) {

		async.eachSeries(evt.target.files, function (file, nextFile) {

			var reader = new FileReader();

			reader.onload = function (e) {

				var array_buffer = e.target.result;
				var buffer = new Uint8Array(array_buffer);

				var query = {
					"name": file.name,
					"data": buffer
				};

				db.files.put(query);
				nextFile();

			}

			reader.readAsArrayBuffer(file);

		}, function () {

			render_sidebar();

		});

	});

	document.getElementById("about").addEventListener("click", function () {

		var txt = [
			"Megaman Legends Animation Viewer by Kion",
			"Copyright 2018 DashGL Project GPLv3 License",
			"",
			"Special Thanks:",
			"xDaniel for DashViewer Source",
			"Dashe for NPC Names (Various)",
			"MegaTuga for Artillary's name",
			"Rockman Striker for Yoyogi Game school reference",
			"Xinus22 for format feedback"
		];

		alert(txt.join("\n"));
	});

	var select = document.getElementById("select");
	select.addEventListener("change", function (evt) {

		action.stop();
		var num = parseInt(this.value);
		if (num === -1) {
			return;
		}

		var clip = mesh.geometry.animations[num];
		action = mixer.clipAction(clip, mesh);
		action.timeScale = 0.5;
		action.setLoop(THREE.LoopRepeat);
		action.play();

	});

});

function render_sidebar() {

	// Read Files from IndexedDB
	FILES = [];
	var elem = document.getElementById("ebd_list");
	elem.innerHTML = "";

	db.files.each(function (file) {
		
		var buffer = new Buffer(file.data);
		var ofs = 0;

		do {

			var str = buffer.toString("ascii", ofs + 0x40, ofs + 0x60);
			var ext = str.split(".").pop();

			if (ext !== "EBD") {
				continue;
			}

			if (FILES.indexOf(str) !== -1) {
				continue;
			}

			FILES.push(str);

			var li = document.createElement("li");
			var a = document.createElement("a");
			a.textContent = str;
			a.setAttribute("class", "nav-link");
			li.setAttribute("class", "nav-item");
			li.appendChild(a);
			elem.appendChild(li);

			li.setAttribute("data-offset", ofs);
			li.setAttribute("data-file", file.name);
			li.addEventListener("click", ebd_click_callback);

			if(!mesh) {
				mesh = 1;
				li.click();
			}

		} while ((ofs += 0x400) < buffer.length);

	});


}

var run = true;
var first = true;

function animate() {

	requestAnimationFrame(animate);
	renderer.render(scene, camera);

	if (mixer) {
		var delta = clock.getDelta();
		mixer.update(delta);
	}

}

function ebd_click_callback() {

	var offset = this.getAttribute("data-offset");
	var file = this.getAttribute("data-file");
	var ofs = parseInt(offset);

	if (window.active) {
		window.active.classList.remove("active");
	}
	this.classList.add("active");
	window.active = this;

	var elem = document.getElementById("mdl_list");
	elem.innerHTML = "";

	db.files.get({
		"name": file
	}).then(file => {
		if (file === undefined) {
			throw new Error("Unable to load: " + file.name);
		}

		var buffer = new Buffer(file.data);
		var memory = buffer.readUInt32LE(ofs + 0x0C);

		var nbModels = buffer.readUInt32LE(ofs + 0x800);
		ofs += 0x804;

		for (let i = 0; i < nbModels; i++) {

			var model = {
				"flag": buffer.readUInt32LE(ofs + 0x00),
				"mesh": buffer.readUInt32LE(ofs + 0x04),
				"bone": buffer.readUInt32LE(ofs + 0x08),
				"anim": buffer.readUInt32LE(ofs + 0x0C),
				"memory": memory,
				"buffer": buffer,
				"offset": parseInt(offset),
				"face": [],
				"file" : file.name
			};

			ofs += 0x10;

			switch (model.flag.toString(16).slice(-2)) {
			case "20":
			case "40":
			case "60":
				break;
			default:
				continue;
				break;
			}

			/*
			if (!model.bone) {
				continue;
			}
			*/

			var name = LOOKUP[model.flag.toString(16)];
			if (name) {
				model.name = name.name;
				model.head = name.head;
				model.face = name.face;
				model.cut = name.cut;
				model.texture = name.texture;
				model.slice = name.slice;
				model.hand = name.hand;
				model.hold = name.hold;
			} else {
				model.name = "0x" + model.flag.toString(16);;
			}

			var li = document.createElement("li");
			var a = document.createElement("a");
			a.textContent = model.name;
			a.setAttribute("title", model.flag.toString(16));
			a.setAttribute("class", "nav-link");
			li.setAttribute("class", "nav-item");
			li.appendChild(a);
			elem.appendChild(li);
			li.addEventListener("click", mdl_click_callback.bind(model));
			
			if(mesh === 1) {
				li.click();
			}
		}

	}).catch(function (err) {
		throw err;
	});

}

function mdl_click_callback() {

	if (mesh) {
		scene.remove(mesh);
	} else {
		var btn = document.getElementById("download");
		download.removeAttribute("disabled", "disabled");
	}
	if (helper) {
		scene.remove(helper);
	}

	var selected = document.getElementById("selected");
	selected.textContent = this.name;

	// Declare Variables

	var buffer = this.buffer;
	var geometry = new THREE.Geometry();
	var mesh_ofs = this.mesh - this.memory + 0x800 + this.offset;
	var bone_ofs = this.bone - this.memory + 0x800 + this.offset;
	var anim_ofs = this.anim - this.memory + 0x800 + this.offset;

	var nbBone = buffer.readUInt8(mesh_ofs + 0x11);
	if (this.cut) {
		nbBone -= this.cut;
	}
	var bones = new Array(nbBone);

	// Read Bones

	var ofs = buffer.readUInt32LE(bone_ofs) - this.memory + 0x800 + this.offset;

	this.face = this.face || [];
	for (let i = 0; i < nbBone; i++) {

		bones[i] = new THREE.Bone();

		if (!i || !this.bone) {
			ofs += 8;
			continue;
		}

		bones[i].position.x = buffer.readInt16LE(ofs + 0) * SCALE;
		bones[i].position.y = buffer.readInt16LE(ofs + 2) * SCALE;
		bones[i].position.z = buffer.readInt16LE(ofs + 4) * SCALE;

		console.log(bones[i].position);
		console.log(this.hold);
		if (this.hold && this.hold.indexOf(i) !== -1) {
			console.log("hold object found!!!!");
			bones[i].position.x = 0;
			bones[i].position.y = 0;
			bones[i].position.z = 0;
			bones[i].hold = true;
		} else if (Math.abs(bones[i].position.y) > 1000 || this.face.indexOf(i) !== -1 ||
			Math.abs(bones[i].position.x) > 1000 || Math.abs(bones[i].position.z) > 1000) {
			bones[i].position.x = 0;
			bones[i].position.y = 0;
			bones[i].position.z = 0;
			bones[i].face = true;
		}

		bones[i].updateMatrix();
		ofs += 8;

	}


	var head = this.head !== undefined ? this.head : 1;
	ofs = mesh_ofs + 0x14;
	for (let i = 0; i < nbBone; i++) {
		var child = buffer.readUInt8(ofs + 0);
		var parent = buffer.readUInt8(ofs + 1);
		ofs += 4;

		if (parent === child) {
			continue;
		}

		if (!bones[child]) {
			console.log("Unknown bone: %d", child);
			console.log("Number of prims: %d", nbBone);
			bones[child] = new THREE.Bone();
			nbBone++;
			bones[child].face = true;
		}

		if (this.hold && this.hold.indexOf(child) !== -1) {
			bones[this.hand].add(bones[child]);
		} else if (bones[child].face) {
			bones[head].add(bones[child]);
		} else {
			bones[parent].add(bones[child]);
		}

	}

	for (let i = 0; i < nbBone; i++) {
		if(!bones[i]) {
			bones[i] = new THREE.Bone();
		}
		bones[i].updateMatrixWorld();
	}

	var armSkeleton = new THREE.Skeleton(bones);

	// Read Mesh

	var prims = [];
	var texList = [];
	ofs = mesh_ofs + 0x90;
	for (let i = 0; i < nbBone; i++) {

		var prim = {
			"nb_tri": buffer.readUInt8(ofs + 0x00),
			"nb_quad": buffer.readUInt8(ofs + 0x01),
			"nb_vert": buffer.readUInt8(ofs + 0x02),
			"bone": buffer.readUInt8(ofs + 0x03),
			"tri_ofs": buffer.readUInt32LE(ofs + 0x04),
			"quad_ofs": buffer.readUInt32LE(ofs + 0x08),
			"vert_ofs": buffer.readUInt32LE(ofs + 0x10),
			"texture": buffer.readUInt32LE(ofs + 0x0c)
		};

		if (texList.indexOf(prim.texture) === -1) {
			texList.push(prim.texture);
		}

		prim.matId = texList.indexOf(prim.texture);

		if (prim.vert_ofs) {
			prim.vert_ofs -= this.memory;
			prim.vert_ofs += this.offset;
			prim.vert_ofs += 0x800;
		}

		if (prim.tri_ofs) {
			prim.tri_ofs -= this.memory;
			prim.tri_ofs += this.offset;
			prim.tri_ofs += 0x800;
		} else {
			prim.nb_tri = 0;
		}

		if (prim.quad_ofs) {
			prim.quad_ofs -= this.memory;
			prim.quad_ofs += this.offset;
			prim.quad_ofs += 0x800;
		} else {
			prim.nb_quad = 0;
		}

		prims.push(prim);
		ofs += 0x14;
	}

	console.log(texList);
	console.log(prims);

	var vertexOfs = 0;
	var y_fix = 0;
	var x_fix = 0;
	if (this.texture) {
		geometry.faceVertexUvs[0] = []
		y_fix = this.texture.y_uv_fix || 0;
		x_fix = this.texture.x_uv_fix || 0;
	}

	var slice = this.slice || [];

	prims.forEach(prim => {

		if (slice.indexOf(prim.bone) !== -1) {
			return;
		}
		if(!bones[prim.bone]) {
			return;
		}

		ofs = prim.vert_ofs;
		for (var i = 0; i < prim.nb_vert; i++) {
			var vertex = new THREE.Vector3();
			vertex.x = buffer.readInt16LE(ofs + 0x00) * SCALE;
			vertex.y = buffer.readInt16LE(ofs + 0x02) * SCALE;
			vertex.z = buffer.readInt16LE(ofs + 0x04) * SCALE;
			geometry.skinIndices.push(new THREE.Vector4(prim.bone, 0, 0, 0));
			geometry.skinWeights.push(new THREE.Vector4(1.0, 0, 0, 0));
			var b = bones[prim.bone];
			vertex.applyMatrix4(b.matrixWorld);
			geometry.vertices.push(vertex);
			ofs += 0x08;
		}

		var ofsX = 0;
		var ofsY = 0;

		if (this.texture) {
			var img = this.texture.images[prim.matId] || {};
			ofsX = img.offsetX || 0;
			ofsY = img.offsetY || 0;
			console.log("Offsets: %d %d", ofsX, ofsY);
		}

		ofs = prim.tri_ofs;
		for (var i = 0; i < prim.nb_tri; i++) {
			var a = buffer.readUInt8(ofs + 0x08) + vertexOfs;
			var b = buffer.readUInt8(ofs + 0x09) + vertexOfs;
			var c = buffer.readUInt8(ofs + 0x0a) + vertexOfs;
			geometry.faces.push(new THREE.Face3(a, b, c));

			if (this.texture) {
				var a = new THREE.Vector2(
					(buffer.readUInt8(ofs + 0x00) + x_fix + ofsX) / (this.texture.width - 1),
					(buffer.readUInt8(ofs + 0x01) + y_fix + ofsY) / (this.texture.height - 1)
				);
				var b = new THREE.Vector2(
					(buffer.readUInt8(ofs + 0x02) + x_fix + ofsX) / (this.texture.width - 1),
					(buffer.readUInt8(ofs + 0x03) + y_fix + ofsY) / (this.texture.height - 1)
				);
				var c = new THREE.Vector2(
					(buffer.readUInt8(ofs + 0x04) + x_fix + ofsX) / (this.texture.width - 1),
					(buffer.readUInt8(ofs + 0x05) + y_fix + ofsY) / (this.texture.height - 1)
				);
				geometry.faceVertexUvs[0].push([a, b, c]);
			}
			ofs += 0x0C;
		}

		ofs = prim.quad_ofs;
		for (var i = 0; i < prim.nb_quad; i++) {
			var a = buffer.readUInt8(ofs + 0x08) + vertexOfs;
			var b = buffer.readUInt8(ofs + 0x09) + vertexOfs;
			var c = buffer.readUInt8(ofs + 0x0a) + vertexOfs;
			var d = buffer.readUInt8(ofs + 0x0b) + vertexOfs;
			geometry.faces.push(new THREE.Face3(a, b, c));
			geometry.faces.push(new THREE.Face3(b, d, c));

			if (this.texture) {
				var a = new THREE.Vector2(
					(buffer.readUInt8(ofs + 0x00) + x_fix + ofsX) / (this.texture.width - 1),
					(buffer.readUInt8(ofs + 0x01) + y_fix + ofsY) / (this.texture.height - 1)
				);
				var b = new THREE.Vector2(
					(buffer.readUInt8(ofs + 0x02) + x_fix + ofsX) / (this.texture.width - 1),
					(buffer.readUInt8(ofs + 0x03) + y_fix + ofsY) / (this.texture.height - 1)
				);
				var c = new THREE.Vector2(
					(buffer.readUInt8(ofs + 0x04) + x_fix + ofsX) / (this.texture.width - 1),
					(buffer.readUInt8(ofs + 0x05) + y_fix + ofsY) / (this.texture.height - 1)
				);
				var d = new THREE.Vector2(
					(buffer.readUInt8(ofs + 0x06) + x_fix + ofsX) / (this.texture.width - 1),
					(buffer.readUInt8(ofs + 0x07) + y_fix + ofsY) / (this.texture.height - 1)
				);
				geometry.faceVertexUvs[0].push([a, b, c]);
				geometry.faceVertexUvs[0].push([b, d, c]);
			}
			ofs += 0x0C;
		}

		vertexOfs += prim.nb_vert;
	});

	var material;

	if (!this.texture) {
		material = new THREE.MeshNormalMaterial({
			"skinning": true
		});
	} else {

		var canvas = document.createElement("canvas");
		canvas.width = this.texture.width;
		canvas.height = this.texture.height;
		var texture = new THREE.Texture(canvas);
		texture.flipY = false;

		material = new THREE.MeshPhongMaterial({
			"map": texture,
			"alphaTest": 0.1,
			"skinning": true
		});

		draw_texture(canvas, texture, this.texture.images);

	}
	geometry.computeFaceNormals();


	if (!bone_ofs) {
		append_mesh(geometry, material, armSkeleton, this.name);
		return;
	}

	for (var i = 0; i < armSkeleton.bones.length; i++) {
		if(!armSkeleton.bones[i]) {
			armSkeleton.bones[i] = new THREE.Bone();
		}
		armSkeleton.bones[i].name = i.toString();
	}

	// Try to parse and play first mesh

	ofs = bone_ofs;
	var first_ofs = buffer.readUInt32LE(ofs);
	first_ofs = first_ofs - this.memory + 0x800 + this.offset;

	var anims = [];
	for (let i = ofs + 4; i < first_ofs; i += 4) {

		var tmp = buffer.readUInt32LE(i);
		if (tmp === 0) {
			continue;
		}

		tmp = tmp - this.memory + 0x800 + this.offset;
		anims.push(tmp);

	}

	geometry.animations = [];
	var select = document.getElementById("select");
	select.innerHTML = "";

	var opt = document.createElement("option");
	opt.textContent = "Select Animation";
	opt.setAttribute("value", "-1");
	select.appendChild(opt);
	var anim_num = 0;

	anims.forEach(anim => {
		var first_ofs = buffer.readUInt32LE(anim);
		first_ofs = first_ofs - this.memory + 0x800 + this.offset;

		var ptrs = [];
		for (var i = anim; i < first_ofs; i += 4) {
			var ptr = buffer.readUInt32LE(i);
			ptr = ptr - this.memory + 0x800 + this.offset;
			ptrs.push(ptr);
		}

		var len = ptrs[1] - ptrs[0];
		var bones = Math.floor((len - 4.5) / 4.5);

		var fps = 30;
		var length = (ptrs.length - 1) / fps;

		var animation = {
			"name": null,
			"fps": 30,
			"length": (ptrs.length - 1) / 30,
			"hierarchy": []
		};

		for (var i = 0; i < bones; i++) {
			animation.hierarchy.push({
				"parent": i - 1,
				"keys": []
			});
		}


		for (var i = 0; i < ptrs.length; i++) {

			var ofs = ptrs[i];
			var pos = {
				"x": buffer.readUInt16LE(ofs + 0) & 0xFFF,
				"y": buffer.readUInt16LE(ofs + 1) >> 4,
				"z": buffer.readUInt16LE(ofs + 3) & 0xFFF
			};

			if (pos.x & 0x800) {
				pos.x = (0x800 - (pos.x & 0x7ff)) * -1;
			}
			pos.x *= SCALE;

			if (pos.y & 0x800) {
				pos.y = (0x800 - (pos.y & 0x7ff)) * -1;
			}
			pos.y *= SCALE;

			if (pos.z & 0x800) {
				pos.z = (0x800 - (pos.z & 0x7ff)) * -1;
			}
			pos.z *= SCALE;

			ofs += 4;
			for (var k = 0; k < bones; k++) {

				var r;
				if ((k % 2) === 0) {
					r = {
						"x": (buffer.readUInt16LE(ofs + 0) >> 4) / 0xFFF * 360,
						"y": (buffer.readUInt16LE(ofs + 2) & 0xFFF) / 0xFFF * 360,
						"z": (buffer.readUInt16LE(ofs + 3) >> 4) / 0xFFF * 360,
					}

					ofs += 5;
				} else {
					r = {
						"x": (buffer.readUInt16LE(ofs + 0) & 0xFFF) / 0xFFF * 360,
						"y": (buffer.readUInt16LE(ofs + 1) >> 4) / 0xFFF * 360,
						"z": (buffer.readUInt16LE(ofs + 3) & 0xFFF) / 0xFFF * 360,
					}

					ofs += 4;
				}


				var e = new THREE.Euler(
					r.x * Math.PI / 180,
					r.y * Math.PI / 180,
					r.z * Math.PI / 180,
				);

				var q = new THREE.Quaternion();
				q.setFromEuler(e);
				var key = {
					"time": i / fps,
					"rot": q.toArray(),
					"scl": [1, 1, 1]
				};

				if (k === 0) {
					key.pos = [pos.x, pos.y, pos.z];
					//key.pos = [0, 0, 0];
				} else {
					key.pos = [
						armSkeleton.bones[k].position.x,
						armSkeleton.bones[k].position.y,
						armSkeleton.bones[k].position.z
					];
				}

				animation.hierarchy[k].keys.push(key);
			}

			// End time
		}

		var clip = THREE.AnimationClip.parseAnimation(animation, armSkeleton.bones);
		if (!clip) {
			return;
		}
		clip.optimize()
		geometry.animations.push(clip);

		var num = anim_num.toString();
		while (num.length < 3) {
			num = "0" + num;
		}
		var option = document.createElement("option");
		option.textContent = "anim_" + num;
		option.setAttribute("value", anim_num);
		select.appendChild(option);
		anim_num++;

	});

	append_mesh(geometry, material, armSkeleton, this.name.replace(/ /g, "_"));

}

function append_mesh(geometry, material, armSkeleton, name) {

	mesh = new THREE.SkinnedMesh(geometry, material);
	var rootBone = armSkeleton.bones[0];
	mesh.add(rootBone);
	mesh.bind(armSkeleton);
	mesh.name = name;
	helper = new THREE.SkeletonHelper(mesh);
	helper.material.linewidth = 3;
	scene.add(helper);
	scene.add(mesh);

	if (!mesh.geometry.animations.length) {
		return;
	}

	mixer = new THREE.AnimationMixer(mesh);
	var clip = mesh.geometry.animations[0];
	action = mixer.clipAction(clip, mesh);
	action.timeScale = 0.5;
	action.setLoop(THREE.LoopRepeat);
	// action.play();

}

async function draw_texture(canvas, texture, list) {

	for(let z = 0; z < list.length; z++) {

		let img = list[z];
		var tmp = document.createElement("canvas");
		var ctx = tmp.getContext("2d");

		var pallet_file = await db.files.get({name:img.pallet_file});
		var image_file = await db.files.get({name:img.image_file});

			var buffer = new Buffer(pallet_file.data);
			var ofs = 0;

			var pallet;
			console.log(img.pallet_name);
			do {

				var str = buffer.toString("ascii", ofs + 0x40, ofs + 0x60);

				if (str.indexOf("..") == 0) {
					console.log(str);
				}

				if (str.replace(/\\/g, '') !== img.pallet_name) {
					continue;
				}

				var nbColors = buffer.readUInt32LE(ofs + 0x14);
				var nbPallet = buffer.readUInt32LE(ofs + 0x18);

				pallet = new Array(nbColors);
				ofs += 0x100;
				// ofs += nbColors * img.pallet_index * 2;

				for (let i = 0; i < nbColors; i++) {
					pallet[i] = buffer.readUInt16LE(ofs);
					ofs += 2;
				}

				break;

			} while ((ofs += 0x400) < buffer.length);

			if (!pallet) {
				throw new Error("Could not locate pallet");
			}

			buffer = new Buffer(image_file.data);

			ofs = 0;
			var width, height, nbColors;
			var inc = 1;
			var block_width = 64;
			var block_height = 32;
			var y, x, by, bx, pos, byte;

			do {

				var str = buffer.toString("ascii", ofs + 0x40, ofs + 0x60);
				if (str.replace(/\\/g, "") !== img.image_name) {
					continue;
				}

				width = buffer.readUInt32LE(ofs + 0x24);
				height = buffer.readUInt32LE(ofs + 0x28);
				nbColors = buffer.readUInt32LE(ofs + 0x14);
				if (nbColors === 16) {
					inc *= 2;
					block_width *= 2;
					width *= 4;
				} else {
					width *= 2;
				}
				ofs += 0x800;
				break;

			} while ((ofs += 0x400) < buffer.length);

			if (!width) {
				throw new Error("Could not find image");
			}

			var image_body = new Array(width * height);
			for (y = 0; y < height; y += block_height) {
				for (x = 0; x < width; x += block_width) {
					for (by = 0; by < block_height; by++) {
						for (bx = 0; bx < block_width; bx += inc) {

							byte = buffer.readUInt8(ofs++);

							switch (nbColors) {
							case 16:

								pos = ((y + by) * width) + (x + bx);
								image_body[pos] = pallet[byte & 0xf];
								pos = ((y + by) * width) + (x + bx + 1);
								image_body[pos] = pallet[byte >> 4];

								break;
							case 256:

								pos = ((y + by) * width) + (x + bx);
								image_body[pos] = pallet[byte];

								break;
							}

						}
					}
				}
			}

			tmp.width = width;
			tmp.height = height;
			var i = 0;
			for (y = 0; y < height; y++) {

				for (x = 0; x < width; x++) {
					var r = ((image_body[i] >> 0x00) & 0x1f) << 3;
					var g = ((image_body[i] >> 0x05) & 0x1f) << 3;
					var b = ((image_body[i] >> 0x0a) & 0x1f) << 3;
					var a = image_body[i] > 0 ? 1 : 0;
					ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
					ctx.fillRect(x, y, 1, 1);
					i++;
				}
			}

			var context = canvas.getContext("2d");
			var sx = img.sx || 0;
			var sy = img.sy || 0;
			var sWidth = img.sWidth || width;
			var sHeight = img.sHeight || height;
			var dx = img.dx || 0;
			var dy = img.dy || 0;
			var dWidth = sWidth;
			var dHeight = sHeight;
			context.drawImage(tmp, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

	}

	texture.needsUpdate = true;


}
