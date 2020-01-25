"use strict";

var db = new Dexie("mml2_files");

db.version(1).stores({
	"files": "&name"
});

db.open();

var files = document.getElementById("files");

var dialog = document.getElementById("scanning");
var dialog_about = document.getElementById("about-dialog");
var dialog_info = document.getElementById("info-dialog");
var show = document.getElementById("show-dialog");
var show_about = document.getElementById("show-about");
var close_about = document.getElementById("close-about");

show_about.addEventListener("click", function() {
	dialog_about.show();
});

close_about.addEventListener("click", function() {
	dialog_about.close();
});

var show_info = document.getElementById("show-info");
var close_info = document.getElementById("close-info");

show_info.addEventListener("click", function() {
	dialog_info.show();
});

close_info.addEventListener("click", function() {
	dialog_info.close();
});

document.getElementById("clear-db").addEventListener("click", function() {

	db.delete().then(function() {
		document.getElementById("ul").innerHTML = "";
	}).catch(function(err) {
		throw err;
	});

});

show.addEventListener("click", function () {
	console.log("loading files");
	files.click();
});

if (!dialog.showModal) {
	dialogPolyfill.registerDialog(dialog);
	dialogPolyfill.registerDialog(dialog_about);
	dialogPolyfill.registerDialog(dialog_info);
}

window.active = null;
render_sidebar();

var files = document.getElementById("files");
files.addEventListener("change", function (evt) {

	dialog.showModal();
	async.eachSeries(evt.target.files, function (file, nextFile) {
		
		var reader = new FileReader();

		reader.onload = function (e) {

			var array_buffer = e.target.result;
			var buffer = new Uint8Array(array_buffer);

			var fp = new Buffer(buffer);
			var ofs = 0;

			// Check for PC files
			
			var found = false;
			do {
			
				if(fp.toString("ascii", ofs, ofs + 0x10) === "dummy header    ") {
					break;
				}
			
				var type = fp.readUInt32LE(ofs);
				var length = fp.readUInt32LE(ofs + 4);
				
				if(type !== 4) {
					continue;
				}
				
				found = true;
				break;

			} while( (ofs += 0x10) < 0x800);

			if(!found) {
				return nextFile();
			}

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
		dialog.close();

	});

});

function render_sidebar() {

	var ul = document.createElement("ul");
	ul.setAttribute("class", "mdl-list");
	ul.style.margin = "0";

	db.files.each(function (file) {

		var li = document.createElement("li");
		li.setAttribute("class", "mdl-list__item");
		var txt = document.createTextNode(file.name);
		var span = document.createElement("span");
		span.setAttribute("class", "mdl-list__item-primary-content");
		var i = document.createElement("i");
		i.setAttribute("class", "material-icons mdl-list__item-icon");
		span.appendChild(i);
		span.appendChild(txt);
		li.appendChild(span);
		ul.appendChild(li);
		li.addEventListener("click", list_itemcallback);

		if (window.active === null) {
			window.active = li;
			li.click();
		}

	}).then(function () {

		var sidebar = document.getElementById("ul");
		sidebar.parentNode.replaceChild(ul, sidebar);
		ul.setAttribute("id", "ul");

	});

}

function list_itemcallback() {

	window.active.classList.remove("active");
	window.active = this;
	window.active.classList.add("active");

	db.files.get({
		"name": this.textContent
	}).then(function (file) {
		
		var fp = new Buffer(file.data);
		
		// Read Header

		var ofs = 0;
		var ptr = 0x800;

		var files = [];

		do {
			
			if(fp.toString("ascii", ofs, ofs + 0x10) === "dummy header    ") {
				break;
			}
			
			var type = fp.readUInt32LE(ofs);
			var length = fp.readUInt32LE(ofs + 4);

			files.push ({
				"type" : type,
				"offset" : ptr
			});

			ptr += length;
		
		} while( (ofs += 0x10) < 0x800);

		var body = document.getElementById("body");
		body.innerHTML = "";

		for(var i = 0; i < files.length; i++) {
			if(files[i].type !== 4) {
				continue;
			}
			
			// Read Pallet First
			var ofs = files[i].offset;
			var pallet_length = fp.readUInt32LE(ofs) - 12;
			var pallet_buffer_x = fp.readUInt16LE(ofs + 4);
			var pallet_buffer_y = fp.readUInt16LE(ofs + 6);
			var pallet_colors = fp.readUInt16LE(ofs + 8);
			var pallet_count = fp.readUInt16LE(ofs + 10);
			ofs += 12;

			var pallet = new Array(pallet_colors);
			for(var k = 0; k < pallet_colors; k++) {
				pallet[k] = fp.readUInt16LE(ofs + (k*2));
			}

			ofs += pallet_length;

			console.log("Offset: 0x%s", ofs.toString(16));

			// Read Image
			var image_length = fp.readUInt32LE(ofs) - 12;
			var image_buffer_x = fp.readUInt16LE(ofs + 4);
			var image_buffer_y = fp.readUInt16LE(ofs + 6);
			var image_width = fp.readUInt16LE(ofs + 8);
			var image_height = fp.readUInt16LE(ofs + 10);
			ofs += 12;
			
			console.log("Image length: 0x%s", image_length.toString(16));
			console.log("0x%s 0x%s", image_width.toString(16), image_height.toString(16));

			var image_body = new Array();
			for(var k = 0; k < image_length; k++) {
				var byte = fp.readUInt8(ofs + k);

				if(image_length === 0x10000) {
					image_body.push(pallet[byte]);
				} else if(pallet_colors === 0x100) {
					image_body.push(pallet[byte]);
				} else {
					image_body.push(pallet[(byte & 0xf)]);
					image_body.push(pallet[(byte >> 4)]);
				}
			}
			
			image_width = 256;
			image_height = 256;
			
			var canvas = document.createElement("canvas");
			canvas.width = 256;
			canvas.height = 256;
			var ctx = canvas.getContext("2d");

			if(image_length === 0x2000) {
				image_width = 128;
			}

			var ofs = 0;
			for(var y = 0; y < image_height; y++) {
				for(var x = 0; x < image_width; x++) {
					
					var r = ((image_body[ofs] >> 0x00) & 0x1f) << 3;
					var g = ((image_body[ofs] >> 0x05) & 0x1f) << 3;
					var b = ((image_body[ofs] >> 0x0a) & 0x1f) << 3;
					var a = image_body[ofs] > 0 ? 1 : 0;
					ctx.fillStyle = "rgba("+r+","+g+","+b+","+a+")";
					ctx.fillRect(x, y, 1, 1);
					ofs++;
				}
			}
			
			var card = document.createElement("div");
			card.setAttribute("class", "demo-card-square mdl-card mdl-shadow--2dp");
			var img = document.createElement("div");
			img.setAttribute("class", "mdl-card__title mdl-card--expand");
			img.appendChild(canvas);
			card.appendChild(img);
			var text = document.createElement("div");
			text.setAttribute("class", "mdl-card__supporting-text");
			card.appendChild(text);
			text.innerText = "Pallet Size: 0x" + pallet_colors.toString(16) + " count(" + pallet_count + ")\nImage Offset: 0x" + files[i].offset.toString(16) + "\n Image Length: 0x" + image_length.toString(16) + "\nWidth: 0x" + image_width.toString(16) + " Height 0x" + image_height.toString(16);
			body.appendChild(card);

		}

	});

}
