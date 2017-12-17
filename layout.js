function createBowlingAlly(width, length, height) {
    var laneLength = 600;
    var backLength = length - laneLength;
    var laneWidth = 115;
    var guardHeight = 10;
    var laneAmount = 7;
    var laneSeparation = (width - (laneWidth*laneAmount)) / laneAmount;
    var thickness = 1;
    var spacersAmount = laneAmount + 1;

    var baseMaterial = new THREE.MeshPhongMaterial({color: 0x212428});
    var baseGeometry = new THREE.BoxGeometry(length, 0.25, width);
    var base = new Physijs.BoxMesh(baseGeometry, baseMaterial, 0);

    for (var laneNum = 0; laneNum < laneAmount; laneNum++) {
        var bowlingLane = createBowlingLane(laneWidth, laneLength, guardHeight, thickness);
        bowlingLane.position.set(length/2 - laneLength/2, 10, (-width/2 + laneSeparation/2 + laneWidth/2) + laneNum * (laneWidth + laneSeparation) );
        base.add(bowlingLane);
    }

    var sideTexture = new THREE.TextureLoader().load('textures/fun.jpg');
    sideTexture.wrapT = sideTexture.wrapS = THREE.RepeatWrapping;
    sideTexture.repeat.set(20, 1);
    var sideMaterial = new THREE.MeshPhysicalMaterial({
        map: sideTexture,
        clearCoat: 1.0
    });
    var sideGeometry = new THREE.BoxGeometry(laneLength, thickness, laneSeparation);

    for (var spaceNum = 0; spaceNum < spacersAmount; spaceNum++) {
        var space = new Physijs.BoxMesh(sideGeometry, sideMaterial, 0);
        space.position.set(length/2 - laneLength/2, 10, (-width/2) + spaceNum * (laneWidth + laneSeparation));
        base.add(space);
    }

    var backFloor = createBack(width, backLength);
    backFloor.position.set(-length/2 + backLength/2, 10, 0);
    base.add(backFloor);

    return base;
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

    var middleLight = new THREE.SpotLight(0xffffff, 0.5, collectionBoxHeight * 2, Math.PI);
    middleLight.position.set(0, collectionBoxHeight / 2, 0);
    laneFloor.add(middleLight);

    var pinLight = new THREE.SpotLight(0xffffff, 1, collectionBoxHeight * 2, Math.PI * 3 / 4);
    pinLight.position.set(length / 3, collectionBoxHeight, 0);
    pinLight.rotation.y = Math.PI / 4;
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

    var gutterLeft = createGutter(length, gutterSize, thickness);
    gutterLeft.position.z = -(width / 2 - gutterSize / 2);
    floor.add(gutterLeft);

    var gutterRight = createGutter(length, gutterSize, thickness);
    gutterRight.position.z = (width / 2 - gutterSize / 2);
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
        color: 0x3c3f44,
        clearCoat: 1.0
    });

    var boxBottom = new Physijs.BoxMesh(new THREE.BoxGeometry(depth, 1, width), collectBoxMaterial, 0);
    /*
    boxBottom.name = "bottom";
    boxBottom.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
        if (other_object.name == "Bowling Ball" && !other_object.collided) {
            other_object.collided = true;
            setTimeout(function () {
                if (collisions >= 10) {
                    alert("Strike!");
                } else {
                    alert("Score: " + collisions);
                }
                scene.remove(clearerPlane);
                dropClearer();
            }, 5000);
        }
    });
    */

    var boxBack = new Physijs.BoxMesh(new THREE.BoxGeometry(1, height, width), collectBoxMaterial, 0);
    boxBack.position.set(depth / 2, height / 2, 0);
    boxBottom.add(boxBack);

    var boxLeft = new Physijs.BoxMesh(new THREE.BoxGeometry(depth, height, 1), collectBoxMaterial, 0);
    boxLeft.position.set(0, height / 2, -width / 2);
    boxBottom.add(boxLeft);

    var boxRight = new Physijs.BoxMesh(new THREE.BoxGeometry(depth, height, 1), collectBoxMaterial, 0);
    boxRight.position.set(0, height / 2, width / 2);
    boxBottom.add(boxRight);

    return boxBottom;
}


function WALL() {

    var wallMaterial = new THREE.MeshPhongMaterial({color: 0x212428});
    var wallTexture = new THREE.TextureLoader().load("textures/wall10.jpg");
    var frontwallTexture = new THREE.TextureLoader().load("textures/109.jpg");
    var basetop = new THREE.MeshLambertMaterial({map: wallTexture});
    var basefront = new THREE.MeshBasicMaterial({
        map: frontwallTexture
        //refractionRatio: 0.01,
        //reflectivity: 0.01,
        //combine: THREE.MixOperation,
        //clearCoat: 0.5
    });

//    //wallLeft, wallRight
//    wallLeft = new THREE.Mesh(new THREE.BoxGeometry(10, 200, 400), basetop);
//    wallLeft.position.x = 30;
//    wallLeft.position.y = 72.5;
//    wallLeft.position.z = 305;
//    scene.add(wallLeft);

//    wallRight = new THREE.Mesh(new THREE.BoxGeometry(10, 200, 400), basetop);
//    wallRight.position.x = 30;
//    wallRight.position.y = 72.5;
//    wallRight.position.z = -305;
//    scene.add(wallRight);


    //wallLeft, wallRight
    var leftWall = new THREE.Mesh(new THREE.BoxGeometry(1000, 200, 10), basetop);
    leftWall.position.x = -1000 / 2 + 25;
    leftWall.position.y = 72.5;
    leftWall.position.z = 1000 / 2;
    scene.add(leftWall);

    var rightWall = new THREE.Mesh(new THREE.BoxGeometry(1000, 200, 10), basetop);
    rightWall.position.x = -1000 / 2 + 25;
    rightWall.position.y = 72.5;
    rightWall.position.z = -1000 / 2;
    scene.add(rightWall);


    //main walll
    mainwall = new THREE.Mesh(new THREE.BoxGeometry(5, 110, 1000), basefront);
    mainwall.position.x = -60;
    mainwall.position.y = 120;
    scene.add(mainwall);

}

function loadCeiling() {
    var ceilMaterial = new THREE.MeshPhongMaterial({color: 0x212428});
    var ceilTexture = new THREE.TextureLoader().load("textures/ceiling.jpg");
    ceilTexture.wrapS = ceilTexture.wrapT = THREE.RepeatWrapping;
    ceilTexture.repeat.set(20, 20);
    var ceilTop = new THREE.MeshLambertMaterial({map: ceilTexture});
    var cieling = new THREE.Mesh(new THREE.BoxGeometry(1050, 1000, 5, 10), ceilTop);
    cieling.position.y = 165;
    cieling.position.x = -500;
    cieling.rotation.x = -(Math.PI / 2);
    scene.add(cieling);
}

function loadClearer() {
    var clearerWidth = 8;
    var clearerHeight = 30;
    var clearerLength = 80;
    var x = -50;
    var z = 0;
    var y = 105;
    var clearerMaterial = new THREE.MeshPhongMaterial({color: 0x212428});
    var clearerGeometry = new THREE.BoxGeometry(clearerWidth, clearerHeight, clearerLength);
    clearer = new Physijs.ConvexMesh(clearerGeometry, clearerMaterial, 1000);
    clearer.position.x = x;
    clearer.position.y = y;
    clearer.position.z = z;
    clearer.setLinearVelocity(new THREE.Vector3(0, 0, 0));
    clearer.setAngularVelocity(new THREE.Vector3(0, 0, 0));
    scene.add(clearer);
    var clearerPlaneGeometry = new THREE.BoxGeometry(clearerWidth, 0.5, clearerLength);
    clearerPlane = new Physijs.ConvexMesh(clearerPlaneGeometry, clearerMaterial, 0);
    clearerPlane.position.x = x;
    clearerPlane.position.y = 90;
    clearerPlane.position.z = z;
    scene.add(clearerPlane);
}

function loadSetter() {
    var setterMaterial = new THREE.MeshLambertMaterial({color: 0x212428});
    setter = new THREE.Mesh(new THREE.BoxGeometry(60, 20, 70), setterMaterial);

    setter.position.x = -15;
    setter.position.y = 60;
    setter.position.z = 0;
    scene.add(setter);
}



