/*
* Copyright 2017,2018 Benjamin Collins
*
* Dash Texture View is free software: you can redistribute it and/or modify it 
* under the terms of the GNU General Public License as published by the Free 
* Software Foundation, either version 3 of the License, or (at your option) any 
* later version.
*
* Dash-Model-Viewer is distributed in the hope that it will be useful, but 
* WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or 
* FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more 
* details.
*
* You should have received a copy of the GNU General Public License along with 
* Dash Texture View. If not, see http://www.gnu.org/licenses/.
*/


"use strict";

const file = document.getElementById("file");
file.addEventListener("change", function(evt) {
	
	var bin = evt.target.files[0];
	if(!bin) {
		return;
	}

	var reader = new FileReader();

	reader.onload = function(e) {
		
		var array_buffer = e.target.result;
		var tmp = new Uint8Array(array_buffer);
		window.buffer = new EcmaBuffer(tmp);
		read_headers();

	}

	reader.readAsArrayBuffer(bin);

});

const exp = document.getElementById("export");
exp.addEventListener("click", function(evt) {
	if(!window.active) {
		return;
	}
	var canvas = document.getElementById("canvas");
	var name = window.active.textContent;
	var str = name.substr(0, name.indexOf(".")) + ".PNG";

	canvas.toBlob(function(blob) {
		saveAs(blob, str);
	}, "image/png");

});


function read_headers() {

	var ofs = 0;
	var fp = window.buffer;
	var select = document.getElementById("select");
	select.innerHTML = "";
	window.active = null;

	do {
		
		var str = fp.toString("ascii", ofs+0x40, ofs+0x60);
		var dot = str.lastIndexOf(".");
		var ext = str.substr(dot, 4);

		if(ext.localeCompare(".TIM") !== 0) {
			continue;
		}

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
			"name" : str
		};

		if(tim.width === 0 || tim.height === 0) {
			continue;
		}
		
		switch(tim.nb_colors) {
			case 16:
				tim.width *= 4;
			break;
			case 256:
				tim.width *= 2;
			break;
		}

		tim.pallet = new Array(tim.nb_pallet);
		var tmp_ofs = ofs + 0x100;

		for(var i = 0; i < tim.nb_pallet; i++) {
			
			tim.pallet[i] = new Array(tim.nb_colors);

			for(var k = 0; k < tim.nb_colors; k++) {
				tim.pallet[i][k] = fp.readUInt16LE(tmp_ofs);
				tmp_ofs += 0x02;
			}

		}

		var li = document.createElement("li");
		dot = str.lastIndexOf('\\');
		li.textContent = str.substr(dot + 1);
		li.addEventListener("click", preview_texture.bind(null, li, tim));
		select.appendChild(li);

		if(window.active !== null) {
			continue;
		}
		
		preview_texture(li, tim);

	} while((ofs += 0x400) < fp.length);

}

function preview_texture(li, tim) {

	if(window.active) {
		window.active.removeAttribute("class");
	}
	
	li.setAttribute("class", "selected");
	window.active = li;

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

	var select = document.createElement("select");
	for(var i = 0; i < tim.nb_pallet; i++) {
		var option = document.createElement("option");
		option.textContent = "Pallet " + i;
		option.setAttribute("value", i);
		select.appendChild(option);
	}
	var prev = document.getElementById("pallet_select");
	prev.parentNode.replaceChild(select, prev);
	select.setAttribute("id", "pallet_select");
	select.addEventListener("change", change_pallet.bind(null, select, tim));
	display_texture(0, tim);

}

function change_pallet(select, tim) {

	var index = parseInt(select.selectedIndex);
	display_texture(index, tim);

}

function display_texture(index, tim) {

	var pallet = tim.pallet[index];

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
	
	var fp = window.buffer;

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
	
	var canvas = document.getElementById("canvas");
	canvas.width = tim.width;
	canvas.height = tim.height;
	var ctx = canvas.getContext("2d");
	
	var ofs = 0;
	for(y = 0; y < tim.height; y++) {
		
		for(x = 0; x < tim.width; x++) {
			var r = ((image_body[ofs] >> 0x00) & 0x1f) << 3;
			var g = ((image_body[ofs] >> 0x05) & 0x1f) << 3;
			var b = ((image_body[ofs] >> 0x0a) & 0x1f) << 3;
			var a = image_body[ofs] > 0 ? 1 : 0;
			ctx.fillStyle = "rgba("+r+","+g+","+b+","+a+")";
			ctx.fillRect(x, y, 1, 1);
			ofs++;
		}

	}
}


