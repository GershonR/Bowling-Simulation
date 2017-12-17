function loadModels() {
    var redMaterial = new THREE.MeshLambertMaterial();
    redMaterial.color.setHex(0xff3333);

    // Ball
    geometry = new THREE.SphereGeometry(8, 32, 32);


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
        new THREE.MeshPhysicalMaterial({color: 0x000000, clearCoat: 1.0}),
        15
    );
    ball.name = "Bowling Ball";
    ball.collided = false;

    var boxgeometry = new THREE.BoxGeometry(7, 10, 7);
    boxgeometry.translate(0, 2, 0);
}

function loadPins() {
    THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('models/pins/');
    mtlLoader.load('Pin.mtl', function (materials) {
        materials.preload();
        var manager = new THREE.LoadingManager();
        var objLoader = new THREE.OBJLoader(manager);
        var materialsL = new Array();
        objLoader.setMaterials(materials);
        objLoader.setPath('models/pins/');
        objLoader.load('Pin.obj', function (object) {
            //object.position.y = 600;
            //object.scale.set(0.2,0.2,0.2);
            object.updateMatrix();
            geometry = new THREE.Geometry();
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
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
            for (var i = 0; i < geometry.faces.length; i++) {
                geometry.faces[i].materialIndex = materialsL.length - 1;
            }
            //geometry.merge(boxgeometry);

            var shape;

            for (x = 0; x < 4; x++) {
                shape = new Physijs.ConvexMesh(
                    geometry,
                    materialsL,
                    2
                );
                shape.position.y = 10;
                shape.position.z = -26 + 18 * x;
                shape.position.x = 15;
                shape.castShadow = true;
                shape.collided = false;
                shape.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
                    if (other_object.name == "bottom" && !shape.collided) {
                        collisions++;
                        shape.collided = true;
                    }
                });
                scene.add(shape);
            }
            for (x = 0; x < 3; x++) {
                shape = new Physijs.ConvexMesh(
                    geometry,
                    materialsL,
                    2
                );
                shape.position.y = 10;
                shape.position.z = -18 + 18 * x;
                shape.position.x = 0;
                shape.castShadow = true;
                shape.collided = false;
                shape.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
                    if (other_object.name == "bottom" && !shape.collided) {
                        collisions++;
                        shape.collided = true;
                    }
                });
                scene.add(shape);
            }
            for (x = 0; x < 3; x++) {
                shape = new Physijs.ConvexMesh(
                    geometry,
                    materialsL,
                    2
                );
                shape.position.y = 10;
                shape.position.z = -10 + 18 * x;
                shape.position.x = -15;
                shape.castShadow = true;
                shape.collided = false;
                shape.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
                    if (other_object.name == "bottom" && !shape.collided) {
                        collisions++;
                        shape.collided = true;
                    }
                });
                scene.add(shape);
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
            shape.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
                if (other_object.name == "bottom" && !shape.collided) {
                    collisions++;
                    shape.collided = true;
                }
            });
            scene.add(shape);

            var width = 1000;
            var laneWidth = 115;
            var laneAmount = 7;
            var laneSeparation = (width - (laneWidth*laneAmount)) / laneAmount;

            for (var laneNum = 0; laneNum < laneAmount; laneNum++) {
                if (laneNum !== 3) {
                    var pins = createPins(geometry, materialsL);
                    pins.position.set(0, 10, (-width / 2 + laneSeparation / 2 + laneWidth / 2) + laneNum * (laneWidth + laneSeparation));
                    scene.add(pins);
                }
            }
        });
    });
}

function createPins(geometry, materialsL) {
    var shape;
    var shapeFront;

    shapeFront = new Physijs.ConvexMesh(
        geometry,
        materialsL,
        2
    );
    shapeFront.position.y = 0;
    shapeFront.position.z = 0;
    shapeFront.position.x = 0;
    shapeFront.castShadow = true;
    shapeFront.collided = false;
    shapeFront.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
        if (other_object.name == "bottom" && !shapeFront.collided) {
            collisions++;
            shapeFront.collided = true;
        }
    });

    for (x = 0; x < 4; x++) {
        shape = new Physijs.ConvexMesh(
            geometry,
            materialsL,
            2
        );
        shape.position.y = 0;
        shape.position.z = -26 + 18 * x;
        shape.position.x = 15;
        shape.castShadow = true;
        shape.collided = false;
        shape.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
            if (other_object.name == "bottom" && !shape.collided) {
                collisions++;
                shape.collided = true;
            }
        });
        shapeFront.add(shape);
    }
    for (x = 0; x < 3; x++) {
        if (x !== 1) {
            shape = new Physijs.ConvexMesh(
                geometry,
                materialsL,
                2
            );
            shape.position.y = 0;
            shape.position.z = -18 + 18 * x;
            shape.position.x = 0;
            shape.castShadow = true;
            shape.collided = false;
            shape.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
                if (other_object.name == "bottom" && !shape.collided) {
                    collisions++;
                    shape.collided = true;
                }
            });
            shapeFront.add(shape);
        }
    }

    for (x = 0; x < 2; x++) {
        shape = new Physijs.ConvexMesh(
            geometry,
            materialsL,
            2
        );
        shape.position.y = 0;
        shape.position.z = -10 + 18 * x;
        shape.position.x = -15;
        shape.castShadow = true;
        shape.collided = false;
        shape.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
            if (other_object.name == "bottom" && !shape.collided) {
                collisions++;
                shape.collided = true;
            }
        });
        shapeFront.add(shape);
    }

    shape = new Physijs.ConvexMesh(
        geometry,
        materialsL,
        2
    );

    shape.position.y = 0;
    shape.position.z = 0;
    shape.position.x = -32;
    shape.castShadow = true;
    shape.collided = false;
    shape.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
        if (other_object.name == "bottom" && !shape.collided) {
            collisions++;
            shape.collided = true;
        }
    });
    shapeFront.add(shape);

    return shapeFront;
}



