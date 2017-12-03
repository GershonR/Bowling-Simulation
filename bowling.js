Physijs.scripts.worker = 'js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var power = 45;
var sprite;
var addedArrow = false;
var camera, scene, renderer;
var cameraControls;
var stick, button;
var clock = new THREE.Clock();
var mesh = null;
var keyboard = new KeyboardState();
var ball;
var pin1, pin2, pin3, pin4, pin5, pin6, pin7, pin8, pin9, pin10;
var ball, ballSet, wallLeft, wallRight;
var boxLeft, boxRight, boxBack, boxBottom;
var stopArrow = false;
unloadScrollBars();

function fillScene() {
	scene = new Physijs.Scene;
	scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
	scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );
	//scene.add( new THREE.AmbientLight( 0x222222 ) );

	var light = new THREE.DirectionalLight( 0xffffff, 0.2 );
	light.position.set( 200, 500, 500 );

	scene.add( light );

	var light2 = new THREE.PointLight(0xffffff, .5, 200);
	light2.position.x = -400;
	light2.position.y = 200;
	light2.position.z = -300;
	//light2.rotateZ(250);
	scene.add(light2);

	var light3 = new THREE.DirectionalLight( 0xffffff, .8 );
	light3.position.set( -200, -100, -400 );

	scene.add( light3 );
   
    //var axes = new THREE.AxisHelper(150);
    //axes.position.y = 1;
    //scene.add(axes);
	loadFloor();
	loadModels();
	drawBowlingBall();
	loadCollectionBox();
	WALL();

}

function init() {
	var canvasWidth = window.innerWidth;
	var canvasHeight = innerHeight;
	var canvasRatio = canvasWidth / canvasHeight;
	textureLoader = new THREE.TextureLoader();
	renderer = new THREE.WebGLRenderer( { antialias: true } );

	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor( 0xAAAAAA, 1.0 );

	camera = new THREE.PerspectiveCamera( 45, canvasRatio, 1, 4000 );
	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
	camera.position.set( -1200, 200, 0);
	cameraControls.target.set(0,0,0);
	cameraControls.noKeys = true;
	
}

function addToDOM() {
    var canvas = document.getElementById('canvas');
    canvas.appendChild(renderer.domElement);
}

function animate() {
	window.requestAnimationFrame(animate);
	scene.simulate(undefined, 2);
	render();
}

function render() {
	var delta = clock.getDelta();
	cameraControls.update(delta);

	renderer.render(scene, camera);
}

function unloadScrollBars() {
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only
}



document.addEventListener('keydown', function( ev ) {
	switch ( ev.keyCode ) {
		case 37: // left
			//ball.position.z -= 3;
			//ball.setLinearVelocity(new THREE.Vector3(0, 0, -300));
			ballSet.translateZ(-2);
		    //ball.__dirtyPosition = true;
			break;

		case 38: // forward
			//ball.position.x += 3;
		    //ball.__dirtyPosition = true;
			ball.setLinearVelocity(new THREE.Vector3(300, 0, 50 * -arrow.rotation.z));
			stopArrow = true;
			break;

		case 39: // right
			//ball.position.z += 3;
		    //ball.__dirtyPosition = true;
		    //ball.setLinearVelocity(new THREE.Vector3(0, 0, 300));
		    ballSet.translateZ(2);
			break;

		case 40: // back
			drawPower();
			break;

		case 32:

			ball.position.y = ballSet.position.y - 40;
			ball.position.x = ballSet.position.x;
			ball.position.z = ballSet.position.z;
			scene.add(ball);
			scene.remove(ballSet);
			if(!addedArrow) {
				addedArrow = true;
				setTimeout(function() { drawArrow(); }, 500);
			}
			break;
	}
});


try {
  init();
  fillScene();
  addToDOM();
  animate();
} catch(error) {
    console.log("You did something bordering on utter madness. Error was:");
    console.log(error);
}
