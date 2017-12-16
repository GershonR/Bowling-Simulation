
function createBowlingLane(width, length, guardHeight, sideWidth) {
    var gutterAndRailThickness = 1;

    var laneFloor = createLaneBase(width, length, gutterAndRailThickness, sideWidth);

    var leftGuard = createGuardRail(guardHeight, length, gutterAndRailThickness);
    leftGuard.position.set(0, guardHeight, -(width/2 - gutterAndRailThickness/2));
    laneFloor.add(leftGuard);

    var rightGuard = createGuardRail(guardHeight, length, gutterAndRailThickness);
    rightGuard.position.set(0, guardHeight, (width/2 - gutterAndRailThickness/2));
    laneFloor.add(rightGuard);

    return laneFloor;
}

function createLaneBase(width, length, thickness, sideWidth) {
	var gutterSize = 20;

    var floorTexture = new THREE.TextureLoader().load('textures/floor.png'); //256x256
	//floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
	//floorTexture.repeat.set( 5, 5 );

	var floorMaterial = new THREE.MeshPhysicalMaterial({
		map: floorTexture,
		side: THREE.FrontSide,
		transparent: false,
        clearCoat: 1.0
	});

    var floorGeometry = new THREE.BoxGeometry(length, thickness, width - (gutterSize*2) + thickness*2);
    var floor = new Physijs.BoxMesh(floorGeometry, floorMaterial, 0);

    var sideTexture = new THREE.TextureLoader().load('textures/fun.jpg'); //256x256
    sideTexture.wrapT = sideTexture.wrapS = THREE.RepeatWrapping;
    sideTexture.repeat.set(20, 1);

    var sideMaterial = new THREE.MeshPhysicalMaterial({
        map: sideTexture,
        side: THREE.FrontSide,
        transparent: false,
        clearCoat: 1.0
    });
    var sideGeometry = new THREE.BoxGeometry(length, thickness, sideWidth);

    var leftSide = new Physijs.BoxMesh(sideGeometry, sideMaterial, 0);
    leftSide.position.set(0,0, -width/2 - sideWidth/2);
    floor.add(leftSide);

    //var rightSide = new Physijs.BoxMesh(sideGeometry, sideMaterial, 0);
    //rightSide.position.set(0,0, width/2 + sideWidth/2);
    //floor.add(rightSide);


    var gutterLeft = createGutter(length, gutterSize, thickness);
    gutterLeft.position.z = -(width/2 - gutterSize/2);
    floor.add(gutterLeft);

    var gutterRight = createGutter(length, gutterSize, thickness);
    gutterRight.position.z = (width/2 - gutterSize/2);
    floor.add(gutterRight);

    return floor;
}

function createGutter(length, gutterSize, thickness) {
	var gutterRadius = gutterSize/2;

	var gutterMaterial = new THREE.MeshPhongMaterial( {
        color: 0x212428,
        clearCoat: 1.0,
        side: THREE.DoubleSide
    } );

    var cutoutBoxGeometry = new THREE.BoxGeometry(gutterSize, length, gutterSize);
    var cutoutBox = new THREE.Mesh(cutoutBoxGeometry, gutterMaterial);
    cutoutBox.position.set(-gutterSize/2, 0, 0);

    var cutoutCylinderGeometry = new THREE.CylinderGeometry(gutterRadius - thickness, gutterRadius - thickness, length, 20);
    var cutoutCylinder = new THREE.Mesh(cutoutCylinderGeometry, gutterMaterial);
    cutoutCylinder.position.set(0, 1, 0);

    var gutterGeometry = new THREE.CylinderGeometry(gutterRadius, gutterRadius, length, 10);
    var gutterCylinder = new THREE.Mesh( gutterGeometry, gutterMaterial );
    //gutterCylinder.rotation.z = -(Math.PI / 2);
    //gutterCylinder.position.set(0,0,0);


    var gutterMesh = ( (new ThreeBSP(gutterCylinder)).subtract(new ThreeBSP(cutoutBox)).subtract(new ThreeBSP(cutoutCylinder)) ).toMesh();
	gutterMesh.geometry.computeVertexNormals();
    var gutter = new Physijs.ConcaveMesh(gutterMesh.geometry, gutterMaterial, 0);
    gutter.rotation.z = -(Math.PI / 2);

    return gutter;
}

function createGuardRail(guardHeight, guardLength, thickness) {
    var standAmount = 50;

    var guardMaterial = new THREE.MeshPhysicalMaterial({ color: 0x000000, clearCoat: 0.5 });

    var guardBarGeometry = new THREE.BoxGeometry(guardLength, thickness, thickness);
    var bar = new Physijs.BoxMesh(guardBarGeometry, guardMaterial, 0);

    var guardStandGeometry = new THREE.BoxGeometry(thickness, guardHeight, thickness);

    for (var standNum = 0; standNum < standAmount; standNum++) {
        var stand = new Physijs.BoxMesh(guardStandGeometry, guardMaterial, 0);
        stand.position.set(-guardLength/2 + thickness/2 + standNum * guardLength/standAmount, -guardHeight/2, 0);
        bar.add(stand)
    }

    return bar;
}

function createBack(width, length) {
    var floorTexture = new THREE.TextureLoader().load('textures/floor.png');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    //floorTexture.repeat.set(1 , 0.5 );

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

function loadCollectionBox() {

	var collectBoxMaterial = new THREE.MeshPhongMaterial({color: 0x3c3f44});
	
	//boxLeft, boxRight, boxBottom, boxBack
	boxBottom = new Physijs.ConvexMesh(new THREE.BoxGeometry(100,25,200), collectBoxMaterial, 0);
	boxBottom.position.x = 75;
	boxBottom.position.y = -25;
	boxBottom.position.z = 0;
	boxBottom.name = "bottom";
	boxBottom.addEventListener('collision', function( other_object, relative_velocity, relative_rotation, contact_normal ){
		if(other_object.name == "Bowling Ball" && !other_object.collided) {
			other_object.collided = true;
			setTimeout(function() { 
			if(collisions >= 10) {
				alert("Strike!");
			} else {
				alert("Score: " + collisions);
			}
			scene.remove(clearerPlane);
			dropClearer();
			}, 5000);
		}
	});
	scene.add(boxBottom);


	boxBack = new Physijs.ConvexMesh(new THREE.BoxGeometry(10, 200, 200), collectBoxMaterial, 0);
	boxBack.position.x = 130;
	boxBack.position.y = 62.5;
	boxBack.position.z = 0;
	scene.add(boxBack);

	boxLeft = new Physijs.ConvexMesh(new THREE.BoxGeometry(100, 200, 10), collectBoxMaterial, 0);
	boxLeft.position.x = 75;
	boxLeft.position.y = 62.5;
	boxLeft.position.z = 100;
	scene.add(boxLeft);

	boxRight = new Physijs.ConvexMesh(new THREE.BoxGeometry(100, 200, 10), collectBoxMaterial, 0);
	boxRight.position.x = 75;
	boxRight.position.y = 62.5;
	boxRight.position.z = -100;
	scene.add(boxRight);
}

function WALL() {

   var wallMaterial = new THREE.MeshPhongMaterial({color: 0x212428});
   var wallTexture = new THREE.TextureLoader().load( "textures/wall10.jpg");
   var basetop = new THREE.MeshLambertMaterial( { map: wallTexture } );
   
   //wallLeft, wallRight
   wallLeft = new THREE.Mesh(new THREE.BoxGeometry(10, 200, 400), basetop);
   wallLeft.position.x = 30;
   wallLeft.position.y = 72.5;
   wallLeft.position.z = 305;
   scene.add(wallLeft);
   
   wallRight = new THREE.Mesh(new THREE.BoxGeometry(10, 200, 400), basetop);
   wallRight.position.x = 30;
   wallRight.position.y = 72.5;
   wallRight.position.z = -305;
   scene.add(wallRight);


	//wallLeft, wallRight
	var leftWall = new THREE.Mesh(new THREE.BoxGeometry(1000, 200, 10), basetop);
	leftWall.position.x = -1000/2 + 25;
	leftWall.position.y = 72.5;
	leftWall.position.z = 1000/2;
	scene.add(leftWall);

	var rightWall = new THREE.Mesh(new THREE.BoxGeometry(1000, 200, 10), basetop);
	rightWall.position.x = -1000/2 + 25;
	rightWall.position.y = 72.5;
	rightWall.position.z = -1000/2;
	scene.add(rightWall);

}

function loadCeiling() {
		var ceilMaterial = new THREE.MeshPhongMaterial({color: 0x212428});
		var ceilTexture = new THREE.TextureLoader().load( "textures/ceiling.jpg");
		ceilTexture.wrapS = ceilTexture.wrapT = THREE.RepeatWrapping; 
	    ceilTexture.repeat.set( 20, 20 );
		var ceilTop = new THREE.MeshLambertMaterial( { map: ceilTexture } );
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
	setter = new THREE.Mesh(new THREE.BoxGeometry(60, 20, 60), setterMaterial);

	setter.position.x = -15;
	setter.position.y = 60;
	setter.position.z = 0;
	scene.add(setter);
}