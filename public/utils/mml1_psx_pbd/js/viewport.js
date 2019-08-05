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

const viewport = {};
viewport.container = document.getElementById('viewport');
viewport.width = viewport.container.offsetWidth;
viewport.height = viewport.container.offsetHeight;
viewport.aspect = viewport.width / viewport.height;
viewport.camera = new THREE.PerspectiveCamera(70, viewport.aspect, 0.01, 10000);
viewport.scene = new THREE.Scene();
viewport.renderer = new THREE.WebGLRenderer({
	antialias : true,
	alpha : true
});
viewport.controls = THREE.OrbitControls(viewport.camera, viewport.renderer.domElement);

(function() {

	viewport.camera.position.x = 3;
	viewport.camera.position.y = 19;
	viewport.camera.position.z = -55;
	viewport.camera.lookAt(new THREE.Vector3(0,0,0));
	viewport.renderer.setSize(viewport.width, viewport.height);
	viewport.renderer.domElement.style.margin = "0";
	viewport.renderer.domElement.style.padding = "0";
	viewport.renderer.setClearColor(0x263238, 1);
	viewport.container.appendChild(viewport.renderer.domElement);
	animate();

	let grid = new THREE.GridHelper(100, 10);
	viewport.scene.add(grid);

	let light = new THREE.AmbientLight(0xffffff);
	viewport.scene.add(light);

})();

window.addEventListener('resize', function() {

	viewport.width = viewport.container.offsetWidth;
	viewport.height = viewport.container.offsetHeight;
	viewport.aspect = viewport.width / viewport.height;
	viewport.renderer.setSize(viewport.width, viewport.height);

});

function animate() {
	
	requestAnimationFrame(animate);
	viewport.renderer.render(viewport.scene, viewport.camera);

}

viewport.set = function(meshes) {

	for(let i = viewport.scene.children.length - 1; i >= 0; i--) {
		if(viewport.scene.children[i].type !== "Mesh") {
			continue;
		}
		
		viewport.scene.remove(viewport.scene.children[i]);
	}

	for(let i = 0; i < meshes.length; i++) {
		viewport.scene.add(meshes[i]);
	}

}
