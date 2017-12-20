/* clearer.js
 *
 * COMP 3490 Final Project
 *
 * Created by:
 *  Nicholas Josephson - 7791547
 *  Gershon Reydman    - 7763541
 *  Eric Kulchycki     - 7767961
 */

var clearer;
var setter;
var clearerPlane;

var droppingState = false;
var clearingState = false;
var movingUpState = false;
var moveBackState = false;
var setterDown = false;
var setterUp = false;
var cleanDone = false;

var downVector = new THREE.Vector3(0, -0.7, 0); // amount to move per frame
var backVector = new THREE.Vector3(0.7, 0, 0); // amount to move per frame
var upVector = new THREE.Vector3(0, 0.9, 0); // amount to move per frame
var forwardVector = new THREE.Vector3(-0.9, 0, 0); // amount to move per frame
var setDownVector = new THREE.Vector3(0, -0.6, 0); // amount to move per frame
var setUpVector = new THREE.Vector3(0, 0.6, 0); // amount to move per frame;

function animateCleaner() {

    if (setterDown) {
        setter.position.add(setDownVector); // add to position
        setter.__dirtyPosition = true;
        if (setter.position.y < 50) {
            resetPins();
            setterDown = false;
            setterUp = true;
        }
    } else if (setterUp) {
        setter.position.add(setUpVector); // add to position
        setter.__dirtyPosition = true;
        if (setter.position.y >= 90) {
            setterUp = false;
            cleanDone = true;
        }
    } else {
        var direction;
        if (droppingState) {
            direction = downVector;
            if (clearer.position.y <= 20) {
                droppingState = false;
                clearingState = true;
            }
        } else if (clearingState) {
            direction = backVector;
            if (clearer.position.x >= 30) {
                clearingState = false;
                movingUpState = true;
            }
        } else if (movingUpState) {
            direction = upVector;
            if (clearer.position.y >= 105) {
                movingUpState = false;
                moveBackState = true;
            }
        } else if (moveBackState) {
            direction = forwardVector;
            if (clearer.position.x <= -50) {
                scene.add(clearerPlane);
                moveBackState = false;
                setterDown = true;
            }
        }
        clearer.setLinearVelocity(new THREE.Vector3(0, 0, 0));
        clearer.setAngularVelocity(new THREE.Vector3(0, 0, 0));
        clearer.rotation.set(0, 0, 0);
        clearer.position.add(direction); // add to position
        clearer.__dirtyPosition = true;
        clearer.__dirtyRotation = true;
    }
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
