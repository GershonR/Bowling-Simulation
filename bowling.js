////////////////////////////////////////////////////////////////////////////////

/* COMP 3490 A1 Skeleton for Claw Machine (Barebones Edition) 
 * Note that you may make use of the skeleton provided, or start from scratch.
 * The choice is up to you.
 * Read the assignment directions carefully
 * Your claw mechanism should be created such that it is represented hierarchically
 * You might consider looking at THREE.Group and THREE.Object3D for reference
 * If you want to play around with the canvas position, or other HTML/JS level constructs
 * you are welcome to do so.


 /*global variables, coordinates, clock etc.  */
 
Physijs.scripts.worker = 'js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';
	
var camera, scene, renderer;
var cameraControls;
var stick, button;
var clock = new THREE.Clock();
var mesh = null;
var keyboard = new KeyboardState();
var tempBtVec3_1 = new Ammo.btVector3( 0, 0, 0 );
unloadScrollBars();
function fillScene() {
	scene = new Physijs.Scene;
	scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
	scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );
	scene.add( new THREE.AmbientLight( 0x222222 ) );

	var light = new THREE.DirectionalLight( 0xffffff, 0.2 );
	light.position.set( 200, 500, 500 );

	scene.add( light );

	light = new THREE.DirectionalLight( 0xffffff, 0.2 );
	light.position.set( -200, -100, -400 );

	scene.add( light );

    var gridXZ = new THREE.GridHelper(2000, 100, new THREE.Color(0xCCCCCC), new THREE.Color(0x888888));
    scene.add(gridXZ);
   
    var axes = new THREE.AxisHelper(150);
    axes.position.y = 1;
    scene.add(axes);

}



// Initialization. Define the size of the canvas and store the aspect ratio
// You can change these as well
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
	camera.position.set( -1300, 800, 0);
	cameraControls.target.set(4,301,92);
	cameraControls.noKeys = true;
	
}

	// We want our document object model (a javascript / HTML construct) to include our canvas
	// These allow for easy integration of webGL and HTML
function addToDOM() {
    var canvas = document.getElementById('canvas');
    canvas.appendChild(renderer.domElement);
}

	// This is a browser callback for repainting
	// Since you might change view, or move things
	// We cant to update what appears
function animate() {
	window.requestAnimationFrame(animate);
	scene.simulate(undefined, 2);
	render();
	update();
}

	// getDelta comes from THREE.js - this tells how much time passed since this was last called
	// This might be useful if time is needed to make things appear smooth, in any animation, or calculation
	// The following function stores this, and also renders the scene based on the defined scene and camera
function render() {
	var delta = clock.getDelta();
	cameraControls.update(delta);

	renderer.render(scene, camera);
}

function unloadScrollBars() {
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only
}

	// Since we're such talented programmers, we include some exception handeling in case we break something
	// a try and catch accomplished this as it often does
	// The sequence below includes initialization, filling up the scene, adding this to the DOM, and animating (updating what appears)
try {
  init();
  fillScene();
  addToDOM();
  animate();
} catch(error) {
    console.log("You did something bordering on utter madness. Error was:");
    console.log(error);
}
