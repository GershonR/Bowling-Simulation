/* bowling.js
 *
 * COMP 3490 Final Project
 *
 * Created by:
 *  Nicholas Josephson - 7791547
 *  Gershon Reydman    - 7763541
 *  Eric Kulchycki     - 7767961
 */

var camera, scene, renderer, cameraControls;
var keyboard = new KeyboardState();
var clock = new THREE.Clock();
var stats = new Stats();

var clearer;
var setter;
var clearerPlane;
var sprite;
var button;
var mesh = null;
var pinsModel, pinMaterial;
var ball, ballSet, arrow, powerSprite;
var laneText;

//audio and video
var audioRoll;
var audioHit;
var video;

//game state
var debugMode = false;
var startUp = true;
var settingBall = false;
var settingPosition = false;
var settingDirection = false;
var settingPower = false;
var rolling = false;
var rollTime = 0;
var resetting = false;
var pinsNeedPlacement = false;
var ballNeedsReset = false;
var pinsNeedReset = false;
var cameraNeedsReset = false;
var pinsAndBallNeedReset = false;

//scoring
var tries = 1;
var delta = 0;
var points = 0;
var round = 1;
var amountOfRounds = 2;

function fillScene() {
    scene = new Physijs.Scene;
    scene.setGravity(new THREE.Vector3(0, -50, 0));
    scene.fog = new THREE.Fog(0x808080, 2000, 4000);
    scene.add(new THREE.AmbientLight(0x222222));

    var bowlingAlly = createBowlingAlly(1000, 1000, 300);
    bowlingAlly.position.set(-475, -10, 0);
    scene.add(bowlingAlly);


    loadClearer();
    loadSetter();
    createTV();
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

function addToDOM() {
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only

    var canvas = document.getElementById('canvas');
    canvas.appendChild(renderer.domElement);

    // performance monitor
    var container = document.createElement('div');
    container.appendChild(renderer.domElement);
    container.appendChild(stats.dom);
    document.body.appendChild(container);

    //load sounds
    audioRoll = document.createElement('audio');
    audioRoll.src = "textures/roll.mp3";
    audioRoll.load(); // must call after setting/changing source

    audioHit = document.createElement('audio');
    audioHit.src = "textures/hit.mp3";
    audioHit.load(); // must call after setting/changing source
}

function animate() {
    requestAnimationFrame(animate);

    updateControls();

    updateGameState();

    updateCamera();
    
    if (smoking) {
        evolveSmoke();
    }

    /*
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        videoImageContext.drawImage(video, 0, 0);
        if (videoTexture)
            videoTexture.needsUpdate = true;
    }*/

    render();
}

function updateControls() {
    keyboard.update();

    //remove camera restrictions for debugging
    if (keyboard.down("O")) {
        debugMode = !debugMode;
        if (debugMode) {
            cameraControls.noKeys = true;
        } else {
            cameraControls.noKeys = false;
            cameraNeedsReset = true;
        }
    }

    //reset to start of round
    if (keyboard.down("R")) {
        rolling = false;
        cameraNeedsReset = true;
        pinsAndBallNeedReset = true;
        resetPins();
    }

    if (keyboard.down("C")) {
        scene.remove(clearerPlane);
        dropClearer();
    }

    if (settingPosition && keyboard.pressed("left")) {
        if (ballSet.position.z > -24) {
            ballSet.translateZ(-1);
        }
    }

    if (settingPosition && keyboard.pressed("right")) {
        if (ballSet.position.z < 24) {
            ballSet.translateZ(1);
        }
    }

    if (settingBall && keyboard.down("space")) {
        //in the middle of...
        if (settingPosition) {
            ball.position.copy(ballSet.position);
            ball.__dirtyPosition = true;
            arrow.position.z = ballSet.position.z;
            scene.remove(ballSet);
            scene.add(ball);
            scene.add(arrow);

            document.getElementById("arrowKeys").style.display = 'none';

            settingPosition = false;
            settingDirection = true;
        } else if (settingDirection) {
            ball.add(powerSprite);

            settingDirection = false;
            settingPower = true;
        } else if (settingPower) {
            ball.setLinearVelocity(new THREE.Vector3(power * 2, 0, 70 * -arrow.rotation.z));
            rolling = true;
            scene.remove(arrow);
            ball.remove(powerSprite);
            audioRoll.play();

            document.getElementById("spaceBar").style.display = 'none';

            settingPower = false;
            settingBall = false;
        }
    }

}

function updateGameState() {
    if (startUp) {
        ball = createBowlingBall();
        ballSet = createSetBall();
        arrow = createArrow();
        powerSprite = createPowerSprite();
        loadPinsModel();

        ballNeedsReset = true;
        startUp = false;
        settingBall = true;
        settingPosition = true;
    } else if (settingBall) {
        if (settingPosition) {
            //nothing to do
        } else if (settingDirection) {
            animateArrow();
        } else if (settingPower) {
            animatePower();
        } else {
            console.log("Game in unknown \"setting\" state.");
        }
    } else if (rolling) {
        rollTime += delta;

        if (ball.position.y < -10 || rollTime > 10) { //ball in collection box or out of time
            if (tries < 3) {
                tries++;
            } else { //end of round
                scene.remove(clearerPlane);
                if (round === amountOfRounds) {
                    setTimeout(function () {
                        gameOver();
                    }, 2000);
                }

                tries = 1;
                round++;
                pinsNeedReset = true;
            }

            setTimeout(function () {
                countPins();
            }, 1000);

            rollTime = 0;
            rolling = false;
            resetting = true;
            ballNeedsReset = true;
        }
    } else if (resetting) {
        document.getElementById("spaceBar").style.display = 'block';
        document.getElementById("arrowKeys").style.display = 'block';

        settingBall = true;
        settingPosition = true;
        resetting = false;
    } else {
        console.log("Game in unknown state.");
    }

    if (pinsNeedReset) {
        dropClearer();
        pinsNeedReset = false;
    }

    if (pinsNeedPlacement) {

    }

    if (ballNeedsReset) {
        scene.remove(ball);
        scene.add(ballSet);
        cameraNeedsReset = true;

        ballNeedsReset = false;
    }

}


function updateCamera() {
    //camera follows ball when rolling
    if (rolling) {
        camera.position.x = ball.position.x - 150;
        cameraControls.target.set(ball.position.x, ball.position.y, ball.position.z);
    }

    //reset camera
    if (cameraNeedsReset) {
        camera.position.set(-650, 80, 0);
        camera.lookAt(0, 0, 0);
        cameraControls.target.set(0, 0, 0);
        cameraNeedsReset = false;
    }

    //keep camera in bowling ally enclosure, unless in debug mode
    if (!debugMode) {
        camera.position.y = (camera.position.y < 20) ? 20 : camera.position.y;
        camera.position.y = (camera.position.y > 280) ? 280 : camera.position.y;
        camera.position.x = (camera.position.x > -150) ? -150 : camera.position.x;
        camera.position.x = (camera.position.x < -975) ? -975 : camera.position.x;
        camera.position.z = (camera.position.z > 490) ? 490 : camera.position.z;
        camera.position.z = (camera.position.z < -490) ? -490 : camera.position.z;
    }
}

function render() {
    stats.update();

    scene.simulate();

    delta = clock.getDelta();
    cameraControls.update(delta);
    renderer.render(scene, camera);
}

function countPins() {
    points = 0;

    for (var i in scene._objects) {
        if (scene._objects[i].name === "pin") {
            if (scene._objects[i].position.y < 15 || scene._objects[i].rotation.x > 0.1 || scene._objects[i].rotation.z > 0.1) {
                points++;
            }
        }
    }
    createScore();
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
