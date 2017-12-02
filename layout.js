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
        var floorGeometry = new THREE.PlaneGeometry(1050, 1000, 10, 10);
        //var floor = new THREE.Mesh(floorGeometry, floorMaterial);
		var floor = new Physijs.ConvexMesh(
			floorGeometry,
			material,
			0
		);
        floor.position.y = 0;
		floor.position.x = -500;
        floor.rotation.x = -(Math.PI / 2);
        scene.add(floor);
}