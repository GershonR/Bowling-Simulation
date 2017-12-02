Physijs.scripts.worker = 'js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';
	
var camera, scene, renderer;
var cameraControls;
var stick, button;
var clock = new THREE.Clock();
var mesh = null;
var keyboard = new KeyboardState();
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
   
    var axes = new THREE.AxisHelper(150);
    axes.position.y = 1;
    scene.add(axes);
	loadFloor();
	loadModels();

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
	camera.position.set( -1300, 800, 0);
	cameraControls.target.set(4,301,92);
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
	update();
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

function loadFloor() {
		var groundMirror = new THREE.Reflector( 3000, 3000, {
		  clipBias: 0.003,
		  textureWidth: window.innerWidth * window.devicePixelRatio,
		  textureHeight: window.innerHeight * window.devicePixelRatio,
		  color: 0x777777,
		  recursion: 1
	    } );
	    groundMirror.position.y = -0.9;
	    groundMirror.rotateX( - Math.PI / 2 );
	    scene.add( groundMirror );
	    
        //create the floor
        
        var floorTexture = new THREE.ImageUtils.loadTexture( 'textures/floor.png' ); //256x256
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	    floorTexture.repeat.set( 10, 10 );
        var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide, transparent: true, opacity: 0.7 } );
		var material = Physijs.createMaterial(
			floorMaterial,
			0.8,
			0.3
		);
        var floorGeometry = new THREE.PlaneGeometry(3000, 3000, 10, 10);
        //var floor = new THREE.Mesh(floorGeometry, floorMaterial);
		var floor = new Physijs.ConvexMesh(
			floorGeometry,
			material,
			0
		);
        floor.position.y = 0;
        floor.rotation.x = -(Math.PI / 2);
        scene.add(floor);
}

function loadModels() {
				THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
				var mtlLoader = new THREE.MTLLoader();
				mtlLoader.setPath( 'models/pins/' );
				mtlLoader.load( 'Pin.mtl', function( materials ) {
					materials.preload();
					var manager = new THREE.LoadingManager();
					var objLoader = new THREE.OBJLoader(manager);
					var materialsL = new Array();
					objLoader.setMaterials( materials );
					objLoader.setPath( 'models/pins/' );
					objLoader.load( 'Pin.obj', function ( object ) {
					//object.position.y = 600;
					//object.scale.set(0.2,0.2,0.2);
					object.updateMatrix();
					geometry = new THREE.Geometry();
					object.traverse( function( child ) {
                        if ( child instanceof THREE.Mesh ) {
                            geometry.merge(new THREE.Geometry().fromBufferGeometry(child.geometry));
							geometry.mergeVertices();
							materialsL.push(child.material);
                            console.log("Mesh name: " + child.name);
							console.log("Texture: " + child.material);
                            console.log("Mesh's geometry has " + geometry.vertices.length + " vertices.");
                            console.log("Mesh's geometry has " + geometry.faces.length + " faces.");
                            console.log("");
                        }
						});
					    //set the material index of each face so a merge knows which material to apply
						for ( var i = 0; i < geometry.faces.length; i ++ ) {
							geometry.faces[i].materialIndex = materialsL.length-1;
						}
					for(x = 0; x < 2; x++) {
						var shape = new Physijs.ConvexMesh(
						geometry,
						materialsL,
						5
						);
					    shape.position.y = 200;
					    shape.position.z = (Math.random() * 50) + x - (Math.random() * 50);
						shape.position.x = (Math.random() * 50) + x - (Math.random() * 50);
						shape.castShadow = true;
					    scene.add( shape );
					}
					});           
					});
}

try {
  init();
  fillScene();
  addToDOM();
  animate();
} catch(error) {
    console.log("You did something bordering on utter madness. Error was:");
    console.log(error);
}
