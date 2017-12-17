var collisions = 0;
var stats;
var clearer;
var setter;
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
var pinsModel, pinMaterial;
var pin1, pin2, pin3, pin4, pin5, pin6, pin7, pin8, pin9, pin10;
var ball, ballSet, wallLeft, wallRight;
var stopArrow = false;

function fillScene() {
    scene = new Physijs.Scene;
    scene.setGravity(new THREE.Vector3( 0, -50, 0 ));
    scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );
    scene.add(new THREE.AmbientLight(0x222222));

    var bowlingAlly = createBowlingAlly(1000, 1000, 300);
    bowlingAlly.position.set(-475, -10, 0);
    scene.add(bowlingAlly);

    loadBall();
    loadPins();
    drawBowlingBall();
    WALL();
    //loadCeiling();
    loadClearer();
    loadSetter();

    /*
    var audio = document.createElement('audio');
    audio.src = "http://www.moviewavs.com/0053148414/MP3S/Movies/Big_Lebowski/bowling.mp3\n";
    audio.load(); // must call after setting/changing source
    audio.play();
    */

    dropSetter();
}

function init() {
    Physijs.scripts.worker = 'js/physijs_worker.js';
    Physijs.scripts.ammo = 'ammo.js';

    var canvasWidth = innerWidth;
    var canvasHeight = innerHeight;
    var canvasRatio = canvasWidth / canvasHeight;

    // Set up renderer. Allows WebGL to make scene appear
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    //changes to make background black
    renderer.setClearColor(0x000000, 1.0);
    //renderer.setClearColor( 0xAAAAAA, 1.0 ); //old color

    camera = new THREE.PerspectiveCamera(45, canvasRatio, 1, 4000);
    camera.position.set(-650, 80, 0);
    camera.lookAt(0, 0, 0);

    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 0, 0);
    cameraControls.noKeys = true;
}

function addToDOM() {
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only

    var canvas = document.getElementById('canvas');
    canvas.appendChild(renderer.domElement);

    // performance monitor
    stats = new Stats();
    var container = document.createElement('div');
    container.appendChild(renderer.domElement);
    container.appendChild(stats.dom);
    document.body.appendChild(container);
}

function animate() {
    requestAnimationFrame(animate);


    /*
    camera.position.y = (camera.position.y < 20) ? 20 : camera.position.y;
    camera.position.y = (camera.position.y > 300) ? 300 : camera.position.y;
    camera.position.x = (camera.position.x > 0) ? 0 : camera.position.x;
    camera.position.x = (camera.position.x < -1000) ? -1000 : camera.position.x;
    camera.position.z = (camera.position.z > 500) ? 500 : camera.position.z;
    camera.position.z = (camera.position.z < -500) ? -500 : camera.position.z;
    */

    /*

    // Change the object's position
    mesh.position.set( 0, 0, 0 );
    mesh.__dirtyPosition = true;

    // Change the object's rotation
    mesh.rotation.set(0, 90, 180);
    mesh.__dirtyRotation = true;

    // You may also want to cancel the object's velocity
    mesh.setLinearVelocity(new THREE.Vector3(0, 0, 0));
    mesh.setAngularVelocity(new THREE.Vector3(0, 0, 0));

    */

    //camera.position.x = ball.position.x - 150;


    render();
}

function render() {
    stats.update();

    scene.simulate();  //previously (undefined, 2);

    var delta = clock.getDelta();
    cameraControls.update(delta);

    renderer.render(scene, camera);
}


document.addEventListener('keydown', function (ev) {
    switch (ev.keyCode) {
        case 37: // left
            //ball.position.z -= 3;
            //ball.setLinearVelocity(new THREE.Vector3(0, 0, -300));
            if (ballSet.position.z > -24) {
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
            if (ballSet.position.z < 24) {
                ballSet.translateZ(2);
            }
            break;

        case 40: // back
            //drawPower();
            break;

        case 32: // space
            if (!addedArrow) {
                ball.position.y = ballSet.position.y;
                ball.position.x = ballSet.position.x;
                ball.position.z = ballSet.position.z;
                scene.add(ball);
                scene.remove(ballSet);
                setTimeout(function () {
                    drawArrow();
                }, 500);
                return;
            }
            if (glowing) {
                stopPower = true;
            }

            if (!stopPower) {
                drawPower();
                return;
            }
            if (stopPower) {
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
} catch (error) {
    console.log("You did something bordering on utter madness. Error was:");
    console.log(error);
}
