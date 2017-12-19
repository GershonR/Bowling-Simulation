function createBowlingAlly(width, length, height) {
    var laneLength = 600;
    var backLength = length - laneLength;
    var laneWidth = 115;
    var guardHeight = 10;
    var laneAmount = 7;
    var laneSeparation = (width - (laneWidth * laneAmount)) / laneAmount;
    var thickness = 1;
    var spacersAmount = laneAmount + 1;

    var baseMaterial = new THREE.MeshPhongMaterial({color: 0x212428});
    var baseGeometry = new THREE.BoxGeometry(length, 0.25, width);
    var base = new Physijs.BoxMesh(baseGeometry, baseMaterial, 0);

    var enclosing = createEnclosing(width, length, height);
    base.add(enclosing);

    for (var laneNum = 0; laneNum < laneAmount; laneNum++) {
        var bowlingLane = createBowlingLane(laneWidth, laneLength, guardHeight, thickness);
        bowlingLane.position.set(length / 2 - laneLength / 2, 10, (-width / 2 + laneSeparation / 2 + laneWidth / 2) + laneNum * (laneWidth + laneSeparation));
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
        space.position.set(length / 2 - laneLength / 2, 10, (-width / 2) + spaceNum * (laneWidth + laneSeparation));
        base.add(space);

        var column = new Physijs.BoxMesh(columnGeometry, columnMaterial, 0);
        column.position.set(length / 2, height / 2, (-width / 2) + spaceNum * (laneWidth + laneSeparation));
        base.add(column);
    }

    var backFloor = createBack(width, backLength);
    backFloor.position.set(-length / 2 + backLength / 2, 10, 0);
    base.add(backFloor);

    createLaneNumbers();
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

    var middleLight = new THREE.SpotLight(0xffffff, 0.5, collectionBoxHeight * 2, Math.PI, 1);
    middleLight.position.set(0, collectionBoxHeight / 2, 0);
	//middleLight.castShadow = true;
    middleLight.target = laneFloor;
	//middleLight.shadow.camera.width = 1024;
    //middleLight.shadow.camera.height = 1024;
    //middleLight.shadow.camera.near = 10;
    //middleLight.shadow.camera.far = 1000;
    //middleLight.shadow.camera.fov = 30;
    laneFloor.add(middleLight);


    var pinLight = new THREE.SpotLight(0xffffff, 0.5, length, Math.PI/4, 0.5);
    pinLight.position.set(0, collectionBoxHeight, 0);
    pinLight.target = collectionBox;
	//pinLight.castShadow = true;
    //pinLight.shadow.camera.width = 1024;
    //pinLight.shadow.camera.height = 1024;
    //pinLight.shadow.camera.near = 1;
    //pinLight.shadow.camera.far = 1000;
    //pinLight.shadow.camera.fov = 30;
    //var helper = new THREE.CameraHelper( pinLight.shadow.camera );
    //scene.add( helper );
    //var spotLightHelper = new THREE.SpotLightHelper( pinLight );
    //scene.add( spotLightHelper );

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
    boxLeft.position.set(0, height / 2, -width / 2 + 0.5);
    boxBottom.add(boxLeft);

    var boxRight = new Physijs.BoxMesh(new THREE.BoxGeometry(depth, height, 1), collectBoxMaterial, 0);
    boxRight.position.set(0, height / 2, width / 2 - 0.5);
    boxBottom.add(boxRight);
	boxBottom.recieveShadow = true;
    return boxBottom;
}

function createEnclosing(width, length, height) {
    var frontPanelHeight = 110;
    var frontPanelDisplacement = 80;
    var frontPanelHeightFromBase = 75;

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

    return top;
}

function loadClearer() {
    var clearerWidth = 8;
    var clearerHeight = 30;
    var clearerLength = 100;
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
    setter = new THREE.Mesh(new THREE.BoxGeometry(60, 40, 70), setterMaterial);

    setter.position.x = -15;
    setter.position.y = 90;
    setter.position.z = 0;
    scene.add(setter);
}

function createTV() {
    var tvTexture = new THREE.TextureLoader().load("textures/TV.jpg");
    var img = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
        map: tvTexture
    });
    //img.map.needsUpdate = true; //ADDED

    // plane
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(80, 35), img);
    plane.overdraw = true;
    plane.position.y = 110;
    plane.position.x = -60;
    plane.rotation.y = (-Math.PI / 2);
    scene.add(plane);

    video = document.createElement('video');

    video.src = "videos/doublestrike.mp4";
    video.load();
    video.play();

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
    var movieGeometry = new THREE.PlaneGeometry(75, 30, 4, 4);
    var movieScreen = new THREE.Mesh(movieGeometry, movieMaterial);
    movieScreen.position.set(-61, 110, 0);
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
            text.position.set(1000/2 - 476, 30, (-1000 / 2) - 3 + (laneNum-1) * (115 + 28));
            scene.add(text);
        }
    });
}



