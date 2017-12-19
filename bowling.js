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
var button;
var clock = new THREE.Clock();
var mesh = null;
var keyboard = new KeyboardState();
var pinsModel, pinMaterial;
var ball, ballSet;
var stopArrow = false;
var rolling = false;
var cameraNeedsReset = false;
var pinsAndBallNeedReset = false;
var audioRoll;
var audioHit;
var tries = 1;
var video;
var delta = 0;
var points = 0;

function fillScene() {
    scene = new Physijs.Scene;
    scene.setGravity(new THREE.Vector3( 0, -50, 0 ));
    scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );
    scene.add(new THREE.AmbientLight(0x222222));

    var bowlingAlly = createBowlingAlly(1000, 1000, 300);
    bowlingAlly.position.set(-475, -10, 0);
    scene.add(bowlingAlly);


    var ballLight = new THREE.SpotLight(0xffffff, 4, 60, Math.PI/4);
    ballLight.position.set(-500, 300, 0);
    ballLight.castShadow = true;
    //scene.add(ballLight.target);
    //scene.add(ballLight);

    //var spotLightHelper = new THREE.SpotLightHelper( ballLight );
    //scene.add( spotLightHelper );


    var pinLight = new THREE.SpotLight(0xffffff, 0.5, length, Math.PI/4, 0.5);
    pinLight.position.set(0, 300, 0);
    //pinLight.target = collectionBox;
    pinLight.castShadow = true;
    //scene.add(pinLight);

    var light = new THREE.PointLight(0xffffff);
    light.position.set(-475, 300, 0);
    light.castShadow = true;
    //scene.add(light);

    loadBall();
    loadPins();
    drawBowlingBall();
    //WALL();
    //loadCeiling();
    loadClearer();
    loadSetter();
	createTV();
	createScore();
	//laneNumbers();

    /*
    var audio = document.createElement('audio');
    audio.src = "http://www.moviewavs.com/0053148414/MP3S/Movies/Big_Lebowski/bowling.mp3\n";
    audio.load(); // must call after setting/changing source
    audio.play();
    */

    //dropSetter();


    audioRoll = document.createElement('audio');
    audioRoll.src = "textures/roll.mp3";
    audioRoll.load(); // must call after setting/changing source

    audioHit = document.createElement('audio');
    audioHit.src = "textures/hit.mp3";
    audioHit.load(); // must call after setting/changing source

    /*
	smokeTexture = THREE.TextureLoader.load('textures/smokeparticle.png');
    smokeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, map: smokeTexture, transparent: true, opacity: 0.4});
    smokeGeo = new THREE.PlaneGeometry(120,120); // SIZE OF PARTICLES BIGGER -> PLANES MORE OBVIOUS
    smokeParticles = [];


    for (p = 0; p < 25; p++) { //HOW MANY PARTICLES
        var particle = new THREE.Mesh(smokeGeo,smokeMaterial);
        particle.position.set(Math.random()*100-55,Math.random()*100 + 15,Math.random()*950-500); // PARTICLE SPREAD X, Y, Z
		particle.rotation.z = Math.random() * 360;
		particle.rotation.y = -Math.PI / 2;
        scene.add(particle);
        smokeParticles.push(particle);
		
    }
    */
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
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
	renderer.shadowMapDebug = true;
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

/*
function evolveSmoke() {
    var sp = smokeParticles.length;
    while(sp--) {
        smokeParticles[sp].rotation.z += (delta * 0.2);
    }
}
*/

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
    keyboard.update();
	//evolveSmoke();


    if (keyboard.down("R")) {
        rolling = false;
        cameraNeedsReset = true;
        pinsAndBallNeedReset = true;
        resetPins();
    }

    if (keyboard.down("T")) {
        rolling = true;
    }

    if (rolling) {
        camera.position.x = ball.position.x - 150;
        cameraControls.target.set(ball.position.x, ball.position.y, ball.position.z);
    } else if (cameraNeedsReset) {
        camera.position.set(-650, 80, 0);
        camera.lookAt(0,0,0);
        cameraControls.target.set(0,0,0);
        cameraNeedsReset = false;
    }

    camera.position.y = (camera.position.y < 20) ? 20 : camera.position.y;
    camera.position.y = (camera.position.y > 280) ? 280 : camera.position.y;
    camera.position.x = (camera.position.x > -150) ? -150 : camera.position.x;
    camera.position.x = (camera.position.x < -975) ? -975 : camera.position.x;
    camera.position.z = (camera.position.z > 490) ? 490 : camera.position.z;
    camera.position.z = (camera.position.z < -490) ? -490 : camera.position.z;

    if (pinsAndBallNeedReset) {
        pinsAndBallNeedReset = false;
    }

    if (rolling && ball.position.y < -10) {
        countPins();
        if (tries < 3) {
            tries++;
        } else {
            scene.remove(clearerPlane);
            dropClearer();
            tries = 1;
        }
        addedArrow = false;
        glowing = false;
        stopPower = false;
        scene.remove(ball);
        scene.add(ballSet);
        cameraNeedsReset = true;
		rolling = false;

        var arrows = document.getElementById("arrowKeys");
        arrows.style.display = 'block';
    }


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



    render();
}

function render() {
    stats.update();

    scene.simulate();  //previously (undefined, 2);

    delta = clock.getDelta();
    cameraControls.update(delta);
    renderer.render(scene, camera);
	
	if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
	{
		videoImageContext.drawImage( video, 0, 0 );
		if ( videoTexture )
			videoTexture.needsUpdate = true;
	}
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
		
			document.getElementById("arrowKeys").style.display = 'none';

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
                rolling = true;
                scene.remove(arrow);
                audioRoll.play();
            }
            break;

        case 67: // c
            scene.remove(clearerPlane);
            dropClearer();
            break;
    }
});


function countPins() {
    var score = 0;

    for (var i in scene._objects) {
        if (scene._objects[i].name === "pin") {
            if (scene._objects[i].position.y < 15 || scene._objects[i].rotation.x > 0.1 || scene._objects[i].rotation.z > 0.1) {
                score++;
            }
        }
    }


    //alert(score);
}

try {
    init();
    fillScene();
    addToDOM();
    animate();
} catch (error) {
    console.log("You did something bordering on utter madness. Error was:");
    console.log(error);
}
