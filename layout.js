function loadFloor() {
		var groundMirror = new THREE.Reflector( 1050, 1000, {
		  clipBias: 0.003,
		  textureWidth: window.innerWidth * window.devicePixelRatio,
		  textureHeight: window.innerHeight * window.devicePixelRatio,
		  color: 0x777777,
		  recursion: 1
	    } );
	    groundMirror.position.y = -10;
		groundMirror.position.x = -500;
	    groundMirror.rotateX( - Math.PI / 2 );
	    //scene.add( groundMirror );
	    
        //create the floor
        
        var floorTexture = new THREE.ImageUtils.loadTexture( 'textures/floor.png' ); //256x256
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	    floorTexture.repeat.set( 10, 10 );
        var floorMaterial = new THREE.MeshPhysicalMaterial( { map: floorTexture, side: THREE.DoubleSide, transparent: false, opacity: 0.95 } );
		floorMaterial.clearCoat = 1.0;
		var material = Physijs.createMaterial(
			floorMaterial,
			0.8,
			0.3
		);
        //var floorGeometry = new THREE.BoxGeometry(1050, 1000, 50, 10);
        //var floor = new THREE.Mesh(floorGeometry, floorMaterial);
		var floor = new THREE.Mesh(new THREE.BoxGeometry(1050, 1000, 30, 10),
			new THREE.MeshPhongMaterial({color: 0x000000})
		);
		floor.position.y = 0;
		floor.position.x = -500;
		floor.rotation.x = -(Math.PI / 2);
        //floor.rotation.x = -(Math.PI / 2);
        //scene.add(floor);
		
		var floorfix = new Physijs.ConvexMesh(
        	new THREE.PlaneGeometry(1050, 132, 1, 1),
        	floorMaterial,
        	0
		);
		floorfix.position.y = 15.5;
		floorfix.position.x = -500;
		floorfix.rotation.x = -(Math.PI / 2);
		scene.add(floorfix);

		var cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 17, 17, 1050, 36 ), new THREE.MeshPhongMaterial({color: 0x000000}) );
		cylinder.rotation.z = -(Math.PI / 2);
		cylinder.position.y = 6;
		cylinder.position.x = -500;
		cylinder.position.z = 80;

		var cylinder2 = new THREE.Mesh( new THREE.CylinderGeometry( 17, 17, 1050, 36 ), new THREE.MeshPhongMaterial({color: 0x000000}) );
		cylinder2.rotation.z = -(Math.PI / 2);
		cylinder2.position.y = 6;
		cylinder2.position.x = -500;
		cylinder2.position.z = -80;
		//scene.add( cylinder );
		
		var floorObj = new ThreeBSP(floor);
		var cyl1 = new ThreeBSP(cylinder);
		var cyl2 = new ThreeBSP(cylinder2);
		var afterSub = floorObj.subtract( cyl1 );
		var afterSub2 = afterSub.subtract( cyl2 );
        var result = afterSub2.toMesh();
        result.material = material;
        var shape = new Physijs.ConcaveMesh(
        	result.geometry,
        	material,
        	0
        );        
		shape.position.y = 0;
		shape.position.x = -500;
		shape.rotation.x = -(Math.PI / 2);
		scene.add( shape );
		
		var cylinder2 = new THREE.Mesh( new THREE.CylinderGeometry( 16, 16, 1050, 36 ), new THREE.MeshPhongMaterial({color: 0x000000}) );
		cylinder2.rotation.z = -(Math.PI / 2);
		cylinder2.position.y = 6;
		cylinder2.position.x = -500;
		cylinder2.position.z = 80;
		
		var cylinder3 = new THREE.Mesh( new THREE.CylinderGeometry( 15.5, 15.5, 1050, 36 ), new THREE.MeshPhongMaterial({color: 0x000000}) );
		cylinder3.rotation.z = -(Math.PI / 2);
		cylinder3.position.y = 7;
		cylinder3.position.x = -500;
		cylinder3.position.z = 80;

		var cylinder4 = new THREE.Mesh( new THREE.CylinderGeometry( 16, 16, 1050, 36 ), new THREE.MeshPhongMaterial({color: 0x000000}) );
		cylinder4.rotation.z = -(Math.PI / 2);
		cylinder4.position.y = 6;
		cylinder4.position.x = -500;
		cylinder4.position.z = -80;
		
		var cylinder5 = new THREE.Mesh( new THREE.CylinderGeometry( 15.5, 15.5, 1050, 36 ), new THREE.MeshPhongMaterial({color: 0x000000}) );
		cylinder5.rotation.z = -(Math.PI / 2);
		cylinder5.position.y = 7;
		cylinder5.position.x = -500;
		cylinder5.position.z = -80;

		var innerCyl1 = new ThreeBSP(cylinder2);
		var outerCyl1 = new ThreeBSP(cylinder3);
		var innerCyl2 = new ThreeBSP(cylinder4);
        var outerCyl2 = new ThreeBSP(cylinder5);
		var subtract_hole2 = innerCyl1.subtract( outerCyl1 );
		var subtract_hole3 = innerCyl2.subtract( outerCyl2 );
		var result2 = subtract_hole2.toMesh();
		var result3 = subtract_hole3.toMesh();
		var shape2 = new Physijs.ConcaveMesh(
        	result2.geometry,
        	new THREE.MeshPhongMaterial({color: 0x212428}),
        	0
		);
		var shape3 = new Physijs.ConcaveMesh(
        	result3.geometry,
        	new THREE.MeshPhongMaterial({color: 0x212428}),
        	0
        );
		shape2.position.y = 6;
		shape2.position.x = -500;
		shape2.position.z = 80;
		shape2.rotation.z = -(Math.PI / 2);
		shape3.position.y = 6;
		shape3.position.x = -500;
		shape3.position.z = -80;
		shape3.rotation.z = -(Math.PI / 2);
		scene.add( shape2 );
		scene.add( shape3 );
}

function loadCollectionBox() {

	var collectBoxMaterial = new THREE.MeshPhongMaterial({color: 0x3c3f44});
	
	//boxLeft, boxRight, boxBottom, boxBack
	boxBottom = new Physijs.ConvexMesh(new THREE.BoxGeometry(100,25,200), collectBoxMaterial, 0);
	boxBottom.position.x = 75;
	boxBottom.position.y = -25;
	boxBottom.position.z = 0;
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
   var wallTexture = new THREE.TextureLoader().load( "textures/bl.jpg");
   var basetop = new THREE.MeshLambertMaterial( { map: wallTexture } );
   
   //wallLeft, wallRight
   wallLeft = new THREE.Mesh(new THREE.BoxGeometry(10, 200, 400), basetop);
   wallLeft.position.x = 30;
   wallLeft.position.y = 62.5;
   wallLeft.position.z = 300;
   scene.add(wallLeft);
   
   wallRight = new THREE.Mesh(new THREE.BoxGeometry(10, 200, 400), basetop);
   wallRight.position.x = 30;
   wallRight.position.y = 62.5;
   wallRight.position.z = -300;
   scene.add(wallRight);

}

function loadGuard() {
	var boxWidth = 2;
	var guardHeight = 20;
	var gaurdLength = 1050; //-500 15.5 0 
	var standAmount = 50;
	var barAmount = 3;
	var x = -1020;
	var z = 100;
	var y = 13;

	var guardMaterial = new THREE.MeshPhongMaterial({color: 0x000000});
	
	var guardStandGeometry = new THREE.BoxGeometry(boxWidth, guardHeight, boxWidth);
	
	for (var standNum = 0; standNum < standAmount; standNum++) {
		var stand = new Physijs.ConvexMesh(guardStandGeometry, guardMaterial, 0);
		stand.position.x = x + (standNum * (gaurdLength/standAmount));
		stand.position.y = y + guardHeight/2;
		stand.position.z = z;
		scene.add(stand);

		//console.log("hey");
	}

	for (var standNum = 0; standNum < standAmount; standNum++) {
		var stand = new Physijs.ConvexMesh(guardStandGeometry, guardMaterial, 0);
		stand.position.x = x + (standNum * (gaurdLength/standAmount));
		stand.position.y = y + guardHeight/2;
		stand.position.z = -z;
		scene.add(stand);

		//console.log("hey");
	}

	var guardBarGeometry = new THREE.BoxGeometry(gaurdLength, boxWidth, boxWidth);		

	for (var barNum = 0; barNum < barAmount; barNum++) {
		var bar = new Physijs.ConvexMesh(guardBarGeometry, guardMaterial, 0);
		bar.position.x = x + gaurdLength/2;
		bar.position.y = y + guardHeight - boxWidth - (barNum * ((guardHeight - 5)/barAmount));
		bar.position.z = z;
		scene.add(bar);

		//console.log("hey");
	}

	for (var barNum = 0; barNum < barAmount; barNum++) {
		var bar = new Physijs.ConvexMesh(guardBarGeometry, guardMaterial, 0);
		bar.position.x = x + gaurdLength/2;
		bar.position.y = y + guardHeight - boxWidth - (barNum * ((guardHeight - 5)/barAmount));
		bar.position.z = -z;
		scene.add(bar);

		//console.log("hey");
	}

	

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