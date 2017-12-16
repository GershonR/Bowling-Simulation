		function loadModels() {
				var redMaterial = new THREE.MeshLambertMaterial();
				redMaterial.color.setHex( 0xff3333 );

				// Ball
				 geometry = new THREE.SphereGeometry( 8, 32, 32 );


				var subMaterial = new THREE.MeshPhongMaterial({color: 0x000000});
				var cylinderSubtract = new THREE.CylinderGeometry(1, 1, 10, 32);
				var hole1 = new THREE.Mesh(cylinderSubtract, subMaterial);
				hole1.position.x = 0;
				hole1.position.y = 10;
				hole1.position.z = 0;
				var hole2 = new THREE.Mesh(cylinderSubtract, subMaterial);
				hole2.position.x = -5;
				hole2.position.y = 10;
				hole2.position.z = -2;
				var hole3 = new THREE.Mesh(cylinderSubtract, subMaterial);
				hole3.position.x = -5;
				hole3.position.y = 10;
				hole3.position.z = 2;

				var result = new THREE.Mesh(geometry, subMaterial);

				var ballSub = new ThreeBSP(result);
				var subHole1 = new ThreeBSP(hole1);
				var subHole2 = new ThreeBSP(hole2);
				var subHole3 = new ThreeBSP(hole3);
				var ballSub = ballSub.subtract(subHole1);
				var ballSub = ballSub.subtract(subHole2);
				var ballSub = ballSub.subtract(subHole3);
				result = ballSub.toMesh();

	            ball = new Physijs.ConvexMesh(
	            	result.geometry,
					new THREE.MeshPhongMaterial({ color: 0x000000 }),
	            	15
				);
				ball.name = "Bowling Ball";
				ball.collided = false;

				var boxgeometry = new THREE.BoxGeometry( 7, 10, 7 );
				boxgeometry.translate( 0, 2, 0 );
				
				var shape;
				THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
				var mtlLoader = new THREE.MTLLoader();
				mtlLoader.setPath( 'models/pins/' );
				mtlLoader.load( 'Pin.mtl', function( materials ) {
					materials.preload();
					var manager = new THREE.LoadingManager();
					var objLoader = new THREE.OBJLoader(manager);
					var materialsL = new Array();
					objLoader.setMaterials( materials );
					objLoader.setPath( 'models/pins/' );
					objLoader.load( 'Pin.obj', function ( object ) {
					//object.position.y = 600;
					//object.scale.set(0.2,0.2,0.2);
					object.updateMatrix();
					geometry = new THREE.Geometry();
					object.traverse( function( child ) {
                        if ( child instanceof THREE.Mesh ) {
                            geometry.merge(new THREE.Geometry().fromBufferGeometry(child.geometry));
							geometry.mergeVertices();
							materialsL.push(child.material);
                            console.log("Mesh name: " + child.name);
							console.log("Texture: " + child.material);
                            console.log("Mesh's geometry has " + geometry.vertices.length + " vertices.");
                            console.log("Mesh's geometry has " + geometry.faces.length + " faces.");
                            console.log("");
                        }
						});
					    //set the material index of each face so a merge knows which material to apply
						for ( var i = 0; i < geometry.faces.length; i ++ ) {
							geometry.faces[i].materialIndex = materialsL.length-1;
						}
					geometry.merge(boxgeometry);
					
 					for(x = 0; x < 4; x++) {
						shape = new Physijs.ConvexMesh(
						geometry,
						materialsL,
						2
						);
					    shape.position.y = 10;
					    shape.position.z = -18 + 12*x;
						shape.position.x = 15;
						shape.castShadow = true;
						shape.collided = false;
						shape.addEventListener('collision', function( other_object, relative_velocity, relative_rotation, contact_normal ){
	                    	if(other_object.name == "bottom" && !shape.collided) {
								collisions++;
								shape.collided = true;
	                    	}
	                    });
					    scene.add( shape );
					}
					for(x = 0; x < 3; x++) {
						shape = new Physijs.ConvexMesh(
						geometry,
						materialsL,
						2
						);
					    shape.position.y = 10;
					    shape.position.z = -10+11*x;
						shape.position.x = 0;
						shape.castShadow = true;
						shape.collided = false;
						shape.addEventListener('collision', function( other_object, relative_velocity, relative_rotation, contact_normal ){
	                    	if(other_object.name == "bottom" && !shape.collided) {
								collisions++;
								shape.collided = true;
	                    	}
	                    });
					    scene.add( shape );
					}
					for(x = 0; x < 3; x++) {
						shape = new Physijs.ConvexMesh(
						geometry,
						materialsL,
						2
						);
					    shape.position.y = 10;
					    shape.position.z = -5+11*x;
						shape.position.x = -15;
						shape.castShadow = true;
						shape.collided = false;
						shape.addEventListener('collision', function( other_object, relative_velocity, relative_rotation, contact_normal ){
	                    	if(other_object.name == "bottom" && !shape.collided) {
								collisions++;
								shape.collided = true;
	                    	}
	                    });
					    scene.add( shape );
					}
					hape = new Physijs.ConvexMesh(
					geometry,
					materialsL,
					2
					);
					shape.position.y = 10;
					shape.position.z = 0;
					shape.position.x = -32;
					shape.castShadow = true;
						shape.collided = false;
						shape.addEventListener('collision', function( other_object, relative_velocity, relative_rotation, contact_normal ){
	                    	if(other_object.name == "bottom" && !shape.collided) {
								collisions++;
								shape.collided = true;
	                    	}
	                    });
					scene.add( shape );
					});           
					});
}