function loadFloor() {
		var groundMirror = new THREE.Reflector( 1050, 1000, {
		  clipBias: 0.003,
		  textureWidth: window.innerWidth * window.devicePixelRatio,
		  textureHeight: window.innerHeight * window.devicePixelRatio,
		  color: 0x777777,
		  recursion: 1
	    } );
	    groundMirror.position.y = -0.9;
		groundMirror.position.x = -500;
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
        //var floorGeometry = new THREE.BoxGeometry(1050, 1000, 50, 10);
        //var floor = new THREE.Mesh(floorGeometry, floorMaterial);
		var floor = new THREE.Mesh(new THREE.BoxGeometry(1050, 1000, 50, 10),
			new THREE.MeshPhongMaterial({color: 0x000000})
		);
		floor.position.y = 0;
		floor.position.x = -500;
		floor.rotation.x = -(Math.PI / 2);
        //floor.rotation.x = -(Math.PI / 2);
        //scene.add(floor);
		
		
		var cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 17, 17, 1100, 12 ), new THREE.MeshPhongMaterial({color: 0x000000}) );
		cylinder.rotation.z = -(Math.PI / 2);
		cylinder.position.y = 19;
		cylinder.position.x = -500;
		cylinder.position.z = 80;
		//scene.add( cylinder );
		
		var floorObj = new ThreeBSP(floor);
        var cyl1 = new ThreeBSP(cylinder);
        var afterSub = floorObj.subtract( cyl1 );
        var result = afterSub.toMesh();
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
		
		var cylinder2 = new THREE.Mesh( new THREE.CylinderGeometry( 16, 16, 1100, 12 ), new THREE.MeshPhongMaterial({color: 0x000000}) );
		cylinder2.rotation.z = -(Math.PI / 2);
		cylinder2.position.y = 19;
		cylinder2.position.x = -500;
		cylinder2.position.z = 80;
		//scene.add( cylinder2 );
		
		var cylinder3 = new THREE.Mesh( new THREE.CylinderGeometry( 15.5, 15.5, 1100, 12 ), new THREE.MeshPhongMaterial({color: 0x000000}) );
		cylinder3.rotation.z = -(Math.PI / 2);
		cylinder3.position.y = 20;
		cylinder3.position.x = -500;
		cylinder3.position.z = 80;
		//scene.add( cylinder3 );
		var innerCyl1 = new ThreeBSP(cylinder2);
        var outerCyl1 = new ThreeBSP(cylinder3);
		var subtract_hole2 = innerCyl1.subtract( outerCyl1 );
		var result2 = subtract_hole2.toMesh();
		var shape2 = new Physijs.ConcaveMesh(
        	result2.geometry,
        	new THREE.MeshPhongMaterial({color: 0x212428}),
        	0
        );
		shape2.position.y = 19;
		shape2.position.x = -500;
		shape2.position.z = 80;
		shape2.rotation.z = -(Math.PI / 2);
		scene.add( shape2 );
}