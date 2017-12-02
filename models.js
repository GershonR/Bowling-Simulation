		function loadModels() {
				var redMaterial = new THREE.MeshLambertMaterial();
				redMaterial.color.setHex( 0xff3333 );

				// //draw the transparent bowling ball for placement

				// Ball
	            geometry = new THREE.SphereGeometry( 12, 32, 32 );
	            ball = new Physijs.ConvexMesh(
	            	geometry,
					new THREE.MeshPhongMaterial({ color: 0x000000 }),
	            	10
	            );

	            
				
				//box = new THREE.Mesh(geometry = new THREE.BoxGeometry( 5, 5, 5 ), redMaterial );
				//box.position.y = 50;
				//scene.add( box );
				var boxgeometry = new THREE.BoxGeometry( 7, 10, 7 );
				
				//for ( var face in boxgeometry.faces ) {
				//	boxgeometry.faces[ face ].materialIndex = 0;
				//}
				
				boxgeometry.translate( 0, 2, 0 );
				
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
						var shape = new Physijs.ConvexMesh(
						geometry,
						materialsL,
						3
						);
					    shape.position.y = 10;
					    shape.position.z = 12*x;
						shape.castShadow = true;
					    scene.add( shape );
					}
					for(x = 0; x < 3; x++) {
						var shape = new Physijs.ConvexMesh(
						geometry,
						materialsL,
						3
						);
					    shape.position.y = 10;
					    shape.position.z = 7+11*x;
						shape.position.x = -10;
						shape.castShadow = true;
					    scene.add( shape );
					}
					for(x = 0; x < 2; x++) {
						var shape = new Physijs.ConvexMesh(
						geometry,
						materialsL,
						3
						);
					    shape.position.y = 10;
					    shape.position.z = 13+11*x;
						shape.position.x = -20;
						shape.castShadow = true;
					    scene.add( shape );
					}
					var shape = new Physijs.ConvexMesh(
					geometry,
					materialsL,
					3
					);
					shape.position.y = 10;
					shape.position.z = 19;
					shape.position.x = -30;
					shape.castShadow = true;
					scene.add( shape );
					});           
					});
}