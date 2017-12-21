/* layout.js
 *
 * COMP 3490 Final Project
 *
 * Created by:
 *  Nicholas Josephson - 7791547
 *  Gershon Reydman    - 7763541
 *  Eric Kulchycki     - 7767961
 */

function createScore() {
    var xMid;
    var textShape = new THREE.BufferGeometry();
    var color = 0xFFFFFF;
    var matLite = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide
    });
    var message;
    if (points === 10) {
        if (tries === 1) {
            message = "Strike!";
            loadStrike();
            loadSmoke();
        } else {
            message = "Spare!";
            loadSpare();
            loadSmoke();
        }
    } else {
        message = "Score: " + points;
    }
    var shapes = font.generateShapes(message, 50, 5);
    var geometry = new THREE.ShapeGeometry(shapes);
    geometry.computeBoundingBox();

    xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

    textShape.fromGeometry(geometry);
    laneText = new THREE.Mesh(textShape, matLite);
    laneText.rotation.y = (-Math.PI / 2);
    if (points === 10) {
        laneText.position.set(-425, 50, -90);
    } else {
        laneText.position.set(-80, 30, -120);
    }

    scene.add(laneText);
}

function removeScore() {
    try {
        scene.remove(laneText);
        scene.remove(roundText);
    } catch (error) {

    }
    try {
        scene.remove(cross1);
        scene.remove(cross2);
    } catch (error) {

    }
    removeStrike();
}

function gameOver() {
    scene.remove(laneText);
    var loader = new THREE.FontLoader();
    loader.load('fonts/helvetiker_regular.typeface.json', function (font) {
        var xMid;
        var textShape = new THREE.BufferGeometry();
        var color = 0xFFFFFF;
        var matLite = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.95,
            side: THREE.DoubleSide
        });
        var message = "Game Over";

        var shapes = font.generateShapes(message, 10, 5);
        var geometry = new THREE.ShapeGeometry(shapes);
        geometry.computeBoundingBox();

        xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

        textShape.fromGeometry(geometry);
        text = new THREE.Mesh(textShape, matLite);
        text.rotation.y = (-Math.PI / 2);
        text.position.set(-500, 20, -30);

        scene.add(text);
        setTimeout(function () {
            window.location.href = 'credits/index.html';
        }, 3000);
    });
}

function loadStrike() {
    var crossMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000});
    var crossGeometry = new THREE.BoxGeometry(1, 150, 10);

    cross1 = new Physijs.BoxMesh(crossGeometry, crossMaterial, 0);
    cross1.position.set(-400, 75, 0);
    cross1.rotation.x = Math.PI / 4;
    scene.add(cross1);

    cross2 = new Physijs.BoxMesh(crossGeometry, crossMaterial, 0);
    cross2.position.set(-400, 75, 0);
    cross2.rotation.x = -Math.PI / 4;
    scene.add(cross2);
}

function loadSpare() {
    var crossMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000});
    var crossGeometry = new THREE.BoxGeometry(1, 150, 10);

    cross1 = new Physijs.BoxMesh(crossGeometry, crossMaterial, 0);
    cross1.position.set(-400, 75, 0);
    cross1.rotation.x = Math.PI / 4;
    scene.add(cross1);
}

function removeStrike() {
    if (smokeParticles != null) {
        for (var i in smokeParticles) {
            scene.remove(smokeParticles[i]);
        }
        smokeParticles = [];
    }

    for (var i in scene._objects) {
        if (scene._objects[i].name === "shard") {
            scene.remove(scene._objects[i]);
        }
    }
}

function loadSmoke() {
    smokeTexture = new THREE.TextureLoader().load('textures/smokeparticle.png');
    smokeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        map: smokeTexture,
        transparent: true,
        opacity: 0.4
    });
    smokeGeo = new THREE.PlaneGeometry(120, 120); // SIZE OF PARTICLES BIGGER -> PLANES MORE OBVIOUS
    smokeParticles = [];


    for (p = 0; p < 70; p++) { //HOW MANY PARTICLES
        var particle = new THREE.Mesh(smokeGeo, smokeMaterial);
        particle.position.set(-300 - Math.random() * 50, Math.random() * 30 + 50, Math.random() * 950 - 500); // PARTICLE SPREAD X, Y, Z
        particle.rotation.z = Math.random() * 360;
        particle.rotation.y = -Math.PI / 2;
        particle.name = "smoke";
        scene.add(particle);
        smokeParticles.push(particle);
    }
}

function loadFont() {
    var loader = new THREE.FontLoader();
    loader.load('fonts/helvetiker_regular.typeface.json', function (fontN) {
        font = fontN
    });
}

function createRound() {
    var xMid;
    var textShape = new THREE.BufferGeometry();
    var color = 0xFFFFFF;
    var matLite = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide
    });
    var message = "Round " + round + "/" + amountOfRounds;
    var shapes = font.generateShapes(message, 10, 5);
    var geometry = new THREE.ShapeGeometry(shapes);
    geometry.computeBoundingBox();

    xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

    textShape.fromGeometry(geometry);
    roundText = new THREE.Mesh(textShape, matLite);
    roundText.rotation.y = (-Math.PI / 2);
    roundText.position.set(-500, 100, -90);

    scene.add(roundText);
}