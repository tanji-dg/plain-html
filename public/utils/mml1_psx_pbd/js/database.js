/*-----------------------------------------------------------------------------

	Copyright 2018 DashGL Project 

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

------------------------------------------------------------------------------*/

"use strict";

const database = {};
database.connection = new Dexie("mml_psx_bin");
database.connection.version(1).stores({"files":"&name","images":"&name"});
database.file_input = document.getElementById('file-input');
database.file_list = document.getElementById('file_list');
database.save = function(files) {
	
	async.eachSeries(files, (file, nextFile) => {

		var reader = new FileReader();

		reader.onload = (evt) => {
			
			let array = evt.target.result;
			let hash = SparkMD5.ArrayBuffer.hash(array);
			let query = {
				name : file.name,
				data : array
			}

			if(file.name === "INIT_DAT.BIN") {
				console.log("init dat");
				let arc = new LegendsArchive(query);
				let images = arc.render();
				console.log(images);

				for(let i = 0; i < images.length; i++) {
					database.connection.images.put(images[i]);
				}

			}

			database.connection.files.put(query);

			nextFile();

		}
		
		reader.readAsArrayBuffer(file);

	}, () => {
	
		console.log('saved to db');
		database.checkFiles();

	});

}

database.checkFiles = async function() {
	
	let div = database.file_list;
	for(let i = 0; i < div.children.length; i++) {
		
		let query = ({name:div.children[i].textContent});
		let file = await database.connection.files.get(query);
		
		if(!file) {
			div.children[i].classList.remove("loaded");
			continue;
		}
		
		div.children[i].classList.add("loaded");

	}

}


document.body.addEventListener('dragover', function(evt) {

	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy';

});

document.body.addEventListener('drop', function(evt) {

	evt.stopPropagation();
	evt.preventDefault();
	let files = evt.dataTransfer.files;
	database.save(files);

});

database.file_input.addEventListener('change', function(evt) {
	
	let files = evt.target.files;
	database.save(files);

});

document.addEventListener('DOMContentLoaded', function() {

	database.checkFiles();

});

database.file_list.addEventListener('click', async function(evt) {

	let elem = evt.target;

	if(!elem.classList.contains('loaded')) {
		return;
	}

	let query = {name : elem.textContent};
	
	let file = await database.connection.files.get(query);
	let head = await database.connection.images.get({name:'..\\OBJ\\FACE\\PL00B00.TIM'});
	let body = await database.connection.images.get({name:'..\\OBJ\\COMM\\PL0000.TIM'});
	let canvas = await database.renderCanvas(head, body, elem.textContent);
	console.log(canvas);

	let arc = new LegendsArchive(file);
	let meshes = arc.parse(canvas);
	console.log(meshes);

	viewport.set(meshes);

});

database.renderCanvas = function(head, body, name) {

	return new Promise( function(resolve, reject) {

		let canvas = document.createElement("canvas");
		canvas.width = 256;
		canvas.height = 256;
		let ctx = canvas.getContext('2d');

		if(!head || !body) {
			
			console.log("one");
			console.log(head);
			console.log(body);

			ctx.fillStyle = '#fff';
			ctx.fillRect(0,0,canvas.width, canvas.height);
			resolve(canvas);

		} else if(name === 'HEAD01.BIN') {
			
			console.log("two");
			let img = new Image();
			img.src = head.data;

			img.onload = function() {

				ctx.drawImage(img, 0, 0);
				resolve(canvas);

			}

		} else if(name === 'HEAD00.BIN') {
			
			console.log("three");
			let img = new Image();
			img.src = body.data;
			console.log(img);

			img.onload = function() {
				
				console.log("load");

				ctx.drawImage(img, 0, 0);
				
				img = new Image();
				img.src = head.data;

				img.onload = function() {
					
					console.log("resolve");
					ctx.drawImage(img, 0, 0, 42, 52, 0, 0, 42, 52);
					ctx.drawImage(img, 126, 204, 130, 52, 126, 204, 130, 52);
					// draw face
					// draw hair

					resolve(canvas);
				}

			}

		} else {
			
			console.log("four");
			let img = new Image();
			img.src = body.data;
	
			img.onload = function() {

				ctx.drawImage(img, 0, 0);
				resolve(canvas);

			}


		}


	});


}
