function loadBall() {

    var ballMaterial = new THREE.MeshPhongMaterial({color: 0xff3333});
    var ballGeometry = new THREE.SphereGeometry(8, 32, 32);

    var subMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
    var cylinderSubtract = new THREE.CylinderGeometry(1, 1, 10, 32);
    var hole1 = new THREE.Mesh(cylinderSubtract, subMaterial);
    hole1.position.set(2, 6, 2);
    var hole2 = new THREE.Mesh(cylinderSubtract, subMaterial);
    hole2.position.set(2, 6, -2);
    var hole3 = new THREE.Mesh(cylinderSubtract, subMaterial);
    hole3.position.set(-2, 6, 0);

    var result = new ThreeBSP(new THREE.Mesh(ballGeometry, subMaterial));
    result = result.subtract(new ThreeBSP(hole1));
    result = result.subtract(new ThreeBSP(hole2));
    result = result.subtract(new ThreeBSP(hole3)).toMesh();

    //set global ball
    ball = new Physijs.ConvexMesh(result.geometry, ballMaterial, 15);
    ball.rotation.z = Math.PI / 16;
    ball.name = "ball";
    ball.castShadow = true;
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

            pinsModel = geometry;
            pinMaterial = materialsL;

            //create center pins
            resetPins();

            var width = 1000;
            var laneWidth = 115;
            var laneAmount = 7;
            var laneSeparation = (width - (laneWidth * laneAmount)) / laneAmount;

            //create pins in other lanes for looks
            for (var laneNum = 0; laneNum < laneAmount; laneNum++) {
                if (laneNum !== 3) {
                    var pins = createPins(geometry, materialsL);
                    pins.position.set(0, 0, (-width / 2 + laneSeparation / 2 + laneWidth / 2) + laneNum * (laneWidth + laneSeparation));
                    scene.add(pins);
                }
            }
        });
    });
}

function resetPins() {
    var geometry = pinsModel;
    var materialsL = pinMaterial;
    var boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    var upBoxMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
    var box, pin;
    var gravity = 3;
    var height = 15;

    //remove old pins
    for (var i in scene._objects) {
        if (scene._objects[i].name === "pin") {
            scene.remove(scene._objects[i]);
        }
    }

    for (x = 0; x < 4; x++) {
        pin = new Physijs.ConvexMesh(geometry, materialsL, 1);
        pin.position.set(0, -height, 0);
        box = new Physijs.BoxMesh(boxGeometry, upBoxMaterial, gravity);
        box.name = "pin";
        box.position.set(15, height, -26 + 18 * x);
        box.add(pin);
        scene.add(box);
    }

    for (x = 0; x < 3; x++) {
        pin = new Physijs.ConvexMesh(geometry, materialsL, 1);
        pin.position.set(0, -height, 0);
        box = new Physijs.BoxMesh(boxGeometry, upBoxMaterial, gravity);
        box.name = "pin";
        box.position.set(0, height, -18 + 18 * x);
        box.add(pin);
        scene.add(box);
    }

    for (x = 0; x < 2; x++) {
        pin = new Physijs.ConvexMesh(geometry, materialsL, 1);
        pin.position.set(0, -height, 0);
        box = new Physijs.BoxMesh(boxGeometry, upBoxMaterial, gravity);
        box.name = "pin";
        box.position.set(-15, height, -10 + 18 * x);
        box.add(pin);
        scene.add(box);
    }

    pin = new Physijs.ConvexMesh(geometry, materialsL, 1);
    pin.position.set(0, -height, 0);
    box = new Physijs.BoxMesh(boxGeometry, upBoxMaterial, gravity);
    box.name = "pin";
    box.position.set(-32, height, 0);
    box.add(pin);
    scene.add(box);
}

function createPins(geometry, materialsL) {
    var middlePin = new Physijs.ConvexMesh(geometry, materialsL, 2);
    var pin;

    for (x = 0; x < 4; x++) {
        pin = new Physijs.ConvexMesh(geometry, materialsL, 2);
        pin.position.set(15, 0, -26 + 18 * x);
        middlePin.add(pin);
    }

    for (x = 0; x < 3; x++) {
        if (x !== 1) {
            pin = new Physijs.ConvexMesh(geometry, materialsL, 2);
            pin.position.set(0, 0, -18 + 18 * x);
            middlePin.add(pin);
        }
    }

    for (x = 0; x < 2; x++) {
        pin = new Physijs.ConvexMesh(geometry, materialsL, 2);
        pin.position.set(-15, 0, -10 + 18 * x);
        middlePin.add(pin);
    }

    pin = new Physijs.ConvexMesh(geometry, materialsL, 2);
    pin.position.set(-32, 0, 0);
    middlePin.add(pin);

    return middlePin;
}



