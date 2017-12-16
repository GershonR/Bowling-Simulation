Physijs.scripts.worker = 'js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var collisions = 0;
var container, stats;
var clearer;
var clearerPlane;
var power = 75;
var stopPower = false;
var sprite;
var addedArrow = false;
var glowing = false;
var camera, scene, renderer;
var cameraControls;
var stick, button;
var clock = new THREE.Clock();
var mesh = null;
var keyboard = new KeyboardState();
var ball;
var pin1, pin2, pin3, pin4, pin5, pin6, pin7, pin8, pin9, pin10;
var ball, ballSet, wallLeft, wallRight;
var boxLeft, boxRight, boxBack, boxBottom, setter;
var stopArrow = false;
unloadScrollBars();

function fillScene() {
	scene = new Physijs.Scene;
	scene.setGravity(new THREE.Vector3( 0, -50, 0 ));
	scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );
    scene.add( new THREE.AmbientLight( 0x222222 ) );

    //scene.add( new THREE.AmbientLight( 0x404040 ) );

	var lightL = new THREE.PointLight(0xffffff, 2, 300);
	lightL.position.x = -150;
	lightL.position.y = 50;
	lightL.position.z = -400;
	lightL.rotation.set(90,0, 180);
	//scene.add(lightL);
	var backLight = new THREE.PointLight(0xffffff, 1, 300);
	backLight.position.x = 0;
	backLight.position.z = 0;
	backLight.position.y = 190;
	scene.add(backLight);

	backLight = new THREE.PointLight(0xffffff, 1, 300);
	backLight.position.x = -100;
	backLight.position.z = 0;
	backLight.position.y = 190;
	scene.add(backLight);

	backLight = new THREE.PointLight(0xffffff, 1, 300);
	backLight.position.x = -250;
	backLight.position.z = 0;
	backLight.position.y = 190;
	scene.add(backLight);

	backLight = new THREE.PointLight(0xffffff, 1, 300);
	backLight.position.x = -400;
	backLight.position.z = 0;
	backLight.position.y = 190;
	scene.add(backLight);


	backLight = new THREE.PointLight(0xffffff, 1, 300);
	backLight.position.x = -550;
	backLight.position.z = 0;
	backLight.position.y = 190;
	scene.add(backLight);

	backLight = new THREE.PointLight(0xffffff, 1, 300);
	backLight.position.x = -700;
	backLight.position.z = 0;
	backLight.position.y = 190;
	scene.add(backLight);

	// var sideLight = new THREE.PointLight(0xffffff, 2, 300);
	// sideLight.position.x = -100;
	// sideLight.position.z = 200;
	// sideLight.position.y = 190;
	// scene.add(sideLight);

	// var sideLight2 = new THREE.PointLight(0xffffff, 2, 300);
	// sideLight2.position.x = -100;
	// sideLight2.position.z = -200;
	// sideLight2.position.y = 190;
	// scene.add(sideLight2);

	var collight = new THREE.PointLight( 0xff0000, 1, 300 );
	collight.position.set( -500, 100, -400 );
	scene.add( collight );

	collight = new THREE.PointLight( 0xff0000, 1, 300 );
	collight.position.set( -500, 100, 170 );
	scene.add( collight );

	collight = new THREE.PointLight( 0x0000ff, 1, 300 );
	collight.position.set( -250, 100, -400 );
	scene.add( collight );

	collight = new THREE.PointLight( 0x0000ff, 1, 300 );
	collight.position.set( -250, 100, 170 );
	scene.add( collight );



	// var light = new THREE.DirectionalLight( 0xffffff, 0.2 );
	// light.position.set( 200, 500, 500 );

	light = new THREE.DirectionalLight( 0xffffff, 0.2 );
	light.position.set( -200, -100, -400 );

	//scene.add( light );
   
    // var axes = new THREE.AxisHelper(150);
    // axes.position.y = 1;
	// scene.add(axes);
//var x = -1020;
    //var z = 100;
    //var y = 13;

	var laneLength = 600;
	var laneLength = 600;
	var laneWidth = 100;
	var guardHeight = 10;
	var space = 25;
	var space = 25;

    var bowlingLane = createBowlingLane(laneWidth, laneLength, guardHeight, space);
    bowlingLane.position.set(-laneLength/2 +25,0, 0);
    scene.add(bowlingLane);

    var bowlingLaneL1 = createBowlingLane(laneWidth, laneLength, guardHeight, space);
    bowlingLaneL1.position.set(-laneLength/2 +25,0, -(laneWidth+space));
    scene.add(bowlingLaneL1);

    var bowlingLaneL2 = createBowlingLane(laneWidth, laneLength, guardHeight, space);
    bowlingLaneL2.position.set(-laneLength/2 +25,0, -(laneWidth+space)*2);
    scene.add(bowlingLaneL2);

    var bowlingLaneR1 = createBowlingLane(laneWidth, laneLength, guardHeight, space);
    bowlingLaneR1.position.set(-laneLength/2 +25,0, (laneWidth+space));
    scene.add(bowlingLaneR1);

    var bowlingLaneR2 = createBowlingLane(laneWidth, laneLength, guardHeight, space);
    bowlingLaneR2.position.set(-laneLength/2 +25,0, (laneWidth+space)*2);
    scene.add(bowlingLaneR2);

    //github not working?
	var backFloor = createBack(1000, 400);
    backFloor.position.set(-775,0,0);
	scene.add(backFloor);

    //loadFloor();
	loadModels();
	drawBowlingBall();
	loadCollectionBox();
	WALL();
	//loadGuard();
	//loadCeiling();
	loadClearer();
	loadSetter();


    var audio = document.createElement( 'audio' );
    audio.src = "http://www.moviewavs.com/0053148414/MP3S/Movies/Big_Lebowski/bowling.mp3\n";
    audio.load(); // must call after setting/changing source
	audio.play();
	
	//dropSetter();
}

function init() {
	var canvasWidth = window.innerWidth;
	var canvasHeight = innerHeight;
	var canvasRatio = canvasWidth / canvasHeight;
	textureLoader = new THREE.TextureLoader();
	
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	renderer = new THREE.WebGLRenderer( { antialias: true } );

	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor( 0xAAAAAA, 1.0 );

	camera = new THREE.PerspectiveCamera( 45, canvasRatio, 1, 4000 );
	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
	camera.position.set( -650, 80, 0);
	camera.lookAt(0,0,0);
	cameraControls.target.set(0,0,0);
	cameraControls.noKeys = true;
	// performance monitor
	container.appendChild( renderer.domElement );
	stats = new Stats();
	container.appendChild( stats.dom );
	
}

function addToDOM() {
    var canvas = document.getElementById('canvas');
    canvas.appendChild(renderer.domElement);
}

function animate() {
	window.requestAnimationFrame(animate);
	scene.simulate(undefined, 2);
    stats.update();

    //camera.position.x = ball.position.x - 150;

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
			if(ballSet.position.z > -15) {
			ballSet.translateZ(-2);
			}
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
			if(ballSet.position.z < 15) {
			ballSet.translateZ(2);
			}
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
				return;
			}
			if(glowing) {
				stopPower = true;
			}

			if(!stopPower) {
				drawPower();
				return;
			}
			if(stopPower) {
				ball.setLinearVelocity(new THREE.Vector3(power * 2, 0, 70 * -arrow.rotation.z));
			}
			break;

		case 67: // c
			scene.remove(clearerPlane);
			dropClearer();
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
