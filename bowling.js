Physijs.scripts.worker = 'js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var power = 45;
var stopPower = false;
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
	scene.add( new THREE.AmbientLight( 0x404040 ) );

	var lightL = new THREE.PointLight(0xffffff, 2, 300);
	lightL.position.x = -150;
	lightL.position.y = 50;
	lightL.position.z = -200;
	lightL.rotation.set(0,0, 90);
	scene.add(lightL);

	// var light = new THREE.DirectionalLight( 0xffffff, 0.2 );
	// light.position.set( 200, 500, 500 );

	light = new THREE.DirectionalLight( 0xffffff, 0.2 );
	light.position.set( -200, -100, -400 );

	scene.add( light );
   
    // var axes = new THREE.AxisHelper(150);
    // axes.position.y = 1;
	// scene.add(axes);
	loadGuard();
		
	loadFloor();
	loadModels();
	drawBowlingBall();
	loadCollectionBox();
	WALL();
	loadGuard();
	loadCeiling();

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
	camera.position.set( -1000, 150, 0);
	
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
			ball.setLinearVelocity(new THREE.Vector3(200, 0, 50 * -arrow.rotation.z));
			stopArrow = true;
			break;

		case 39: // right
			//ball.position.z += 3;
		    //ball.__dirtyPosition = true;
		    //ball.setLinearVelocity(new THREE.Vector3(0, 0, 300));
		    ballSet.translateZ(2);
			break;

		case 40: // back
			//drawPower();
			break;

		case 32: // space
			if(!addedArrow) {
			    ball.position.y = ballSet.position.y;
			    ball.position.x = ballSet.position.x;
			    ball.position.z = ballSet.position.z;
			    scene.add(ball);
			    scene.remove(ballSet);
				setTimeout(function() { drawArrow(); }, 500);
			}
			if(addedArrow && !stopPower) {
				drawPower();
			}
			if(addedArrow && stopPower) {
				ball.setLinearVelocity(new THREE.Vector3(10 * power, 0, 50 * -arrow.rotation.z));
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
