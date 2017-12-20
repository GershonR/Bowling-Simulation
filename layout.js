/* layout.js
 *
 * COMP 3490 Final Project
 *
 * Created by:
 *  Nicholas Josephson - 7791547
 *  Gershon Reydman    - 7763541
 *  Eric Kulchycki     - 7767961
 */

var cross1;
var cross2;
var laneText, roundText;

function createBowlingAlly(width, length, height) {
    var laneLength = 600;
    var backLength = length - laneLength;
    var laneWidth = 115;
    var guardHeight = 10;
    var laneAmount = 7;

    var enclosing = createEnclosing(width, length, height);

    addLanes(enclosing, width, length, height, laneLength, laneWidth, guardHeight, laneAmount);

    var backFloor = createBack(width, backLength);
    backFloor.position.set(-length / 2 + backLength / 2, 10, 0);
    enclosing.add(backFloor);

    createLaneNumbers();
    return enclosing;
}

function addLanes(parent, width, length, height, laneLength, laneWidth, guardHeight, laneAmount) {
    var thickness = 1;
    var laneSeparation = (width - (laneWidth * laneAmount)) / laneAmount;
    var spacersAmount = laneAmount + 1;

    for (var laneNum = 0; laneNum < laneAmount; laneNum++) {
        var bowlingLane = createBowlingLane(laneWidth, laneLength, guardHeight, thickness);
        bowlingLane.position.set(length / 2 - laneLength / 2, guardHeight, (-width / 2 + laneSeparation / 2 + laneWidth / 2) + laneNum * (laneWidth + laneSeparation));
        parent.add(bowlingLane);
    }

    var sideTexture = new THREE.TextureLoader().load('textures/fun.jpg');
    sideTexture.wrapT = sideTexture.wrapS = THREE.RepeatWrapping;
    sideTexture.repeat.set(20, 1);
    var sideMaterial = new THREE.MeshPhysicalMaterial({
        map: sideTexture,
        clearCoat: 1.0
    });
    var sideGeometry = new THREE.BoxGeometry(laneLength, thickness, laneSeparation);

    var columnTexture = new THREE.TextureLoader().load('textures/wood.jpg');
    columnTexture.wrapT = sideTexture.wrapS = THREE.RepeatWrapping;
    //columnTexture.repeat.set(20, 1);
    var columnMaterial = new THREE.MeshPhysicalMaterial({
        map: columnTexture,
        clearCoat: 1.0
    });
    var columnGeometry = new THREE.BoxGeometry(thickness, height, laneSeparation);

    for (var spaceNum = 0; spaceNum < spacersAmount; spaceNum++) {
        var space = new Physijs.BoxMesh(sideGeometry, sideMaterial, 0);
        space.position.set(length / 2 - laneLength / 2, guardHeight, (-width / 2) + spaceNum * (laneWidth + laneSeparation));
        parent.add(space);

        var column = new Physijs.BoxMesh(columnGeometry, columnMaterial, 0);
        column.position.set(length / 2, height / 2, (-width / 2) + spaceNum * (laneWidth + laneSeparation));
        parent.add(column);
    }
}

function createBowlingLane(width, length, guardHeight, gutterAndRailThickness) {
    var collectionBoxHeight = 200;
    var collectionBoxDepth = 100;

    var laneFloor = createLaneBase(width, length, gutterAndRailThickness);

    var leftGuard = createGuardRail(guardHeight, length, gutterAndRailThickness);
    leftGuard.position.set(0, guardHeight, -(width / 2 - gutterAndRailThickness / 2));
    laneFloor.add(leftGuard);

    var rightGuard = createGuardRail(guardHeight, length, gutterAndRailThickness);
    rightGuard.position.set(0, guardHeight, (width / 2 - gutterAndRailThickness / 2));
    laneFloor.add(rightGuard);

    var collectionBox = createCollectionBox(width, collectionBoxDepth, collectionBoxHeight);
    collectionBox.position.set(collectionBoxDepth / 2 + length / 2, -25, 0);
    laneFloor.add(collectionBox);

    var middleLight = new THREE.SpotLight(0xffffff, 0.5, collectionBoxHeight * 2, Math.PI, 1);
    middleLight.position.set(0, collectionBoxHeight / 2, 0);
    middleLight.target = laneFloor;
    //middleLight.castShadow = true;
    middleLight.shadow.camera.width = 1024;
    middleLight.shadow.camera.height = 1024;
    middleLight.shadow.camera.near = 100;
    middleLight.shadow.camera.far = 300;
    middleLight.shadow.camera.fov = 30;
    laneFloor.add(middleLight);


    var pinLight = new THREE.SpotLight(0xffffff, 0.5, length, Math.PI / 4, 0.5);
    pinLight.position.set(0, collectionBoxHeight, 0);
    pinLight.target = collectionBox;
    //pinLight.castShadow = true;
    //pinLight.shadow.camera.width = 1024;
    //pinLight.shadow.camera.height = 1024;
    //pinLight.shadow.camera.near = 1;
    //pinLight.shadow.camera.far = 1000;
    //pinLight.shadow.camera.fov = 30;
    laneFloor.add(pinLight);


    return laneFloor;
}

function createLaneBase(width, length, thickness) {
    var gutterSize = 20;

    var floorTexture = new THREE.TextureLoader().load('textures/floor.png');
    var floorMaterial = new THREE.MeshPhysicalMaterial({
        map: floorTexture,
        clearCoat: 1.0
    });

    var floorGeometry = new THREE.BoxGeometry(length, thickness, width - (gutterSize * 2) + thickness * 2);
    var floor = new Physijs.BoxMesh(floorGeometry, floorMaterial, 0);
    floor.receiveShadow = true;
    var gutterLeft = createGutter(length, gutterSize, thickness);

    gutterLeft.position.z = -(width / 2 - gutterSize / 2);
    gutterLeft.receiveShadow = true;
    floor.add(gutterLeft);

    var gutterRight = createGutter(length, gutterSize, thickness);
    gutterRight.position.z = (width / 2 - gutterSize / 2);
    gutterRight.receiveShadow = true;
    floor.add(gutterRight);

    return floor;
}

function createGutter(length, gutterSize, thickness) {
    var gutterRadius = gutterSize / 2;

    var gutterMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x212428,
        clearCoat: 1.0
    });

    var cutoutBoxGeometry = new THREE.BoxGeometry(gutterSize, length, gutterSize);
    var cutoutBox = new THREE.Mesh(cutoutBoxGeometry, gutterMaterial);
    cutoutBox.position.set(-gutterSize / 2, 0, 0);

    var cutoutCylinderGeometry = new THREE.CylinderGeometry(gutterRadius - thickness, gutterRadius - thickness, length, 20);
    var cutoutCylinder = new THREE.Mesh(cutoutCylinderGeometry, gutterMaterial);
    cutoutCylinder.position.set(0, 1, 0);

    var gutterGeometry = new THREE.CylinderGeometry(gutterRadius, gutterRadius, length, 10);
    var gutterCylinder = new THREE.Mesh(gutterGeometry, gutterMaterial);
    var gutterMesh = ((new ThreeBSP(gutterCylinder)).subtract(new ThreeBSP(cutoutBox)).subtract(new ThreeBSP(cutoutCylinder))).toMesh();
    gutterMesh.geometry.computeVertexNormals();

    var gutter = new Physijs.ConcaveMesh(gutterMesh.geometry, gutterMaterial, 0);
    gutter.rotation.z = -(Math.PI / 2);

    return gutter;
}

function createGuardRail(guardHeight, guardLength, thickness) {
    var standAmount = 50;

    var guardMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x111111,
        clearCoat: 1.0
    });

    var guardBarGeometry = new THREE.BoxGeometry(guardLength, thickness, thickness);
    var bar = new Physijs.BoxMesh(guardBarGeometry, guardMaterial, 0);

    var guardStandGeometry = new THREE.BoxGeometry(thickness, guardHeight, thickness);

    for (var standNum = 0; standNum < standAmount; standNum++) {
        var stand = new Physijs.BoxMesh(guardStandGeometry, guardMaterial, 0);
        stand.position.set(-guardLength / 2 + thickness / 2 + standNum * guardLength / standAmount, -guardHeight / 2, 0);
        bar.add(stand)
    }

    return bar;
}

function createBack(width, length) {
    var floorTexture = new THREE.TextureLoader().load('textures/floor.png');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(1, 5);

    var floorMaterial = new THREE.MeshPhysicalMaterial({
        map: floorTexture,
        side: THREE.FrontSide,
        transparent: false,
        clearCoat: 1.0
    });

    var floorGeometry = new THREE.BoxGeometry(length, 1, width);
    var floor = new Physijs.BoxMesh(floorGeometry, floorMaterial, 0);

    return floor;
}

function createCollectionBox(width, depth, height) {
    var collectBoxMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x000000, //0x3c3f44,
        clearCoat: 1.0
    });

    var boxBottom = new Physijs.BoxMesh(new THREE.BoxGeometry(depth, 1, width), collectBoxMaterial, 0);

    var boxBack = new Physijs.BoxMesh(new THREE.BoxGeometry(1, height, width), collectBoxMaterial, 0);
    boxBack.position.set(depth / 2, height / 2, 0);
    boxBottom.add(boxBack);

    var boxLeft = new Physijs.BoxMesh(new THREE.BoxGeometry(depth, height, 1), collectBoxMaterial, 0);
    boxLeft.position.set(0, height / 2, -width / 2 + 0.5);
    boxBottom.add(boxLeft);

    var boxRight = new Physijs.BoxMesh(new THREE.BoxGeometry(depth, height, 1), collectBoxMaterial, 0);
    boxRight.position.set(0, height / 2, width / 2 - 0.5);
    boxBottom.add(boxRight);
    return boxBottom;
}

function createEnclosing(width, length, height) {
    var frontPanelHeight = 110;
    var frontPanelDisplacement = 80;
    var frontPanelHeightFromBase = 75;

    var baseMaterial = new THREE.MeshPhongMaterial({color: 0x212428});
    var baseGeometry = new THREE.BoxGeometry(length, 0.25, width);
    var base = new Physijs.BoxMesh(baseGeometry, baseMaterial, 0);

    var topTexture = new THREE.TextureLoader().load("textures/ceiling.jpg");
    topTexture.wrapS = topTexture.wrapT = THREE.RepeatWrapping;
    topTexture.repeat.set(20, 20);
    var topMaterial = new THREE.MeshLambertMaterial({
        map: topTexture,
        color: 0x212428
    });
    var topGeometry = new THREE.BoxGeometry(length, 0.25, width);
    var top = new Physijs.BoxMesh(topGeometry, topMaterial, 0);
    top.position.y = height;
    base.add(top);

    var wallTexture = new THREE.TextureLoader().load("textures/wall10.jpg");
    var sideWallMaterial = new THREE.MeshLambertMaterial({map: wallTexture});

    var leftWall = new Physijs.BoxMesh(new THREE.BoxGeometry(length, height, 1), sideWallMaterial);
    leftWall.position.set(0, -height / 2, -width / 2);
    top.add(leftWall);

    var rightWall = new Physijs.BoxMesh(new THREE.BoxGeometry(length, height, 1), sideWallMaterial);
    rightWall.position.set(0, -height / 2, width / 2);
    top.add(rightWall);

    var frontPanelTexture = new THREE.TextureLoader().load("textures/109.jpg");
    var frontPanelMaterial = new THREE.MeshBasicMaterial({map: frontPanelTexture});
    var frontPanel = new THREE.Mesh(new THREE.BoxGeometry(1, frontPanelHeight, width), frontPanelMaterial);
    frontPanel.position.set(length / 2 - frontPanelDisplacement, -height + frontPanelHeightFromBase + frontPanelHeight / 2, 0);
    top.add(frontPanel);

    var frontUpperPanelTexture = new THREE.TextureLoader().load("textures/space.jpg");
    var frontUpperPanelMaterial = new THREE.MeshBasicMaterial({map: frontUpperPanelTexture});
    var frontUpperPanel = new THREE.Mesh(new THREE.BoxGeometry(1, 300, width), frontUpperPanelMaterial);
    frontUpperPanel.position.set(length / 2 - frontPanelDisplacement - 100, -50, 0);
    frontUpperPanel.rotation.z = Math.PI / 3;
    top.add(frontUpperPanel);

    return base;
}

function createTV() {
    var width = 125;
    var height = 70;
    var y = 125;
    var x = -62;

    var tvTexture = new THREE.TextureLoader().load("textures/TV.jpg");
    var img = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
        map: tvTexture
    });
    //img.map.needsUpdate = true; //ADDED

    // plane
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), img);
    plane.overdraw = true;
    plane.position.y = y;
    plane.position.x = x;
    plane.rotation.y = (-Math.PI / 2);
    scene.add(plane);

    videoStrike = document.createElement('video');
    videoStrike.src = "videos/bowlingstrike1.mp4";
    videoStrike.load();

    videoSpare = document.createElement('video');
    videoSpare.src = "videos/bowlingspare2.mp4";
    videoSpare.load();

    var videoImage = document.createElement('canvas');
    videoImage.width = 400;
    videoImage.height = 250;
    videoImageContext = videoImage.getContext('2d');
    videoImageContext.fillStyle = '#ffffff';
    videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);
    videoTexture = new THREE.Texture(videoImage);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    var movieMaterial = new THREE.MeshBasicMaterial({map: videoTexture, overdraw: true, side: THREE.DoubleSide});
    var movieGeometry = new THREE.PlaneGeometry(width - 5, height - 5, 4, 4);
    var movieScreen = new THREE.Mesh(movieGeometry, movieMaterial);
    movieScreen.position.set(x, y, 0);
    movieScreen.rotation.y = (-Math.PI / 2);
    scene.add(movieScreen);
}

function createLaneNumbers() {
    var loader = new THREE.FontLoader();
    loader.load('fonts/helvetiker_regular.typeface.json', function (font) {
        for (var laneNum = 1; laneNum <= 7; laneNum++) {
            var xMid, text;
            var textShape = new THREE.BufferGeometry();
            var color = 0xFFFFFF;
            var matLite = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            });
            var message = "" + laneNum;

            var shapes = font.generateShapes(message, 18, 2);
            var geometry = new THREE.ShapeGeometry(shapes);
            geometry.computeBoundingBox();

            xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

            textShape.fromGeometry(geometry);
            text = new THREE.Mesh(textShape, matLite);
            text.rotation.y = (-Math.PI / 2);
            text.position.set(1000 / 2 - 476, 30, (-1000 / 2) - 3 + (laneNum - 1) * (115 + 28));
            scene.add(text);
        }
    });
}

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
    var crossMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    var crossGeometry = new THREE.BoxGeometry(1,150,10);

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
    var crossMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    var crossGeometry = new THREE.BoxGeometry(1,150,10);

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
    smokeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, map: smokeTexture, transparent: true, opacity: 0.4});
    smokeGeo = new THREE.PlaneGeometry(120,120); // SIZE OF PARTICLES BIGGER -> PLANES MORE OBVIOUS
    smokeParticles = [];


    for (p = 0; p < 70; p++) { //HOW MANY PARTICLES
        var particle = new THREE.Mesh(smokeGeo,smokeMaterial);
        particle.position.set(-300 - Math.random()*50 ,Math.random()*30 + 50,Math.random()*950-500); // PARTICLE SPREAD X, Y, Z
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
    var message = "Round "+ round + "/"+ amountOfRounds;
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
