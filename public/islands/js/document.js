MW.install(THREE);
var loadMesh = function (url) {
	return new Promise(function (resolve, reject) {
		var loader = new THREE.JSONLoader();
		loader.load(url, function (geometry, materials) {
			resolve({
				geometry: geometry,
				materials: materials
			});
		});
	});
};

const clock = new THREE.Clock();
const scene = new THREE.Scene();

var camera, renderer;
var ambientLight, terrainMesh, characterMesh, box, sphere;
var world, min, max, partition, octree,
	playerRadius = 1,
	playerObjectHolder, playerController;
var keyInputControl;
var tpsCameraControl;
var animationController;
var vent = new THREE.EventDispatcher();
world = new MW.World();
min = new THREE.Vector3(-150, -150, -150);
max = new THREE.Vector3( 150,  150,  150);
partition = 5;
octree = new MW.Octree(min, max, partition);
world.add(octree);
const width = 1280;
const height = 720;

camera = new THREE.PerspectiveCamera(40, width / height, 1, 1000);
camera.position.set(0, 5, 30);
renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);

const main = document.getElementById('main');
main.appendChild(renderer.domElement);

ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(ambientLight);
playerObjectHolder = new THREE.Object3D();
playerObjectHolder.position.set(0, 10, 0);
scene.add(playerObjectHolder);
playerController = new MW.CharacterController(playerObjectHolder, playerRadius);
world.add(playerController);
keyInputControl = new MW.KeyInputControl();
tpsCameraControl = new MW.TPSCameraControl(
	camera, // three.js camera
	playerObjectHolder, // tracking object
	{
		el: renderer.domElement,
		offset: new THREE.Vector3(0, 1.8, 0),
		rigidObjects: []
	}
);
// bind events
keyInputControl.addEventListener('movekeyon', function () {
	playerController.isRunning = true;
});
keyInputControl.addEventListener('movekeyoff', function () {
	playerController.isRunning = false;
});
keyInputControl.addEventListener('jumpkeypress', function () {
	playerController.jump();
});
// synk with keybord input and camera control input
keyInputControl.addEventListener('movekeychange', function () {

	var cameraFrontAngle = tpsCameraControl.getFrontAngle();
	var characterFrontAngle = keyInputControl.frontAngle;
	playerController.direction = THREE.Math.degToRad(360) - cameraFrontAngle + characterFrontAngle;
});
// 'updated' event is fired by `tpsCameraControl.update()`
tpsCameraControl.addEventListener('updated', function () {
	var cameraFrontAngle = tpsCameraControl.getFrontAngle();
	var characterFrontAngle = keyInputControl.frontAngle;
	playerController.direction = THREE.Math.degToRad(360) - cameraFrontAngle + characterFrontAngle;

});

async function init(result) {

	var characterData = await loadMesh('assets/miku.json');
	
	let loader = new THREE.DashLoader();
	characterMesh = await loader.load('assets/Megaman.dmf');

	characterMesh.geometry.animations = [
		characterMesh.geometry.animations[0],
		characterMesh.geometry.animations[1],
		characterMesh.geometry.animations[6],
		characterMesh.geometry.animations[7]
	]
	
	characterMesh.geometry.animations[0].name = 'idle';
	characterMesh.geometry.animations[1].name = 'run';
	characterMesh.geometry.animations[2].name = 'jump';
	characterMesh.geometry.animations[3].name = 'slide';

	terrainMesh = makeStageGeometry(STAGE_DATA["Sealos Island"]["Stage 01"]);
	terrainMesh.rotation.y = Math.PI;
	scene.add(terrainMesh);
	octree.importThreeMesh(terrainMesh);
	tpsCameraControl.rigidObjects.push(terrainMesh);
	
	characterMesh.material.forEach(function (material) {
		material.skinning = true;
	});

	characterMesh.scale.x = 1/30;
	characterMesh.scale.y = 1/30;
	characterMesh.scale.z = 1/30;

	scene.add(characterMesh);

	animationController = new MW.AnimationController(characterMesh);
	animationController.motion.jump.setLoop(THREE.LoopOnce, 0);
	animationController.motion.slide.setLoop(THREE.LoopOnce, 0);
	animationController.motion.jump.clampWhenFinished = true;
	animationController.motion.slide.clampWhenFinished = true;
	
	characterMesh.position.y = 50;

	// player motion
	playerController.addEventListener('startIdling', function () {
		animationController.play('idle');
	});
	playerController.addEventListener('startWalking', function () {
		animationController.play('run');
	});
	playerController.addEventListener('startJumping', function () {
		animationController.play('jump');
	});
	playerController.addEventListener('startSliding', function () {
		animationController.play('slide');
	});
	playerController.addEventListener('startFalling', function () {
		animationController.play('slide');
	});
	vent.addEventListener('beforerender', function () {
		animationController.mesh.position.set(
			playerController.center.x,
			playerController.center.y - playerController.radius + 1,
			playerController.center.z
		);
		animationController.mesh.rotation.y = playerController.direction + Math.PI;
	});

	animate();
}

init();

const animate = function() {

	let delta = clock.getDelta();
	requestAnimationFrame(animate);
	vent.dispatchEvent({
		type: 'beforerender'
	});
	world.step(Math.min(delta, 0.02));
	tpsCameraControl.update();
	animationController.update(delta);
	renderer.render(scene, camera);
}
