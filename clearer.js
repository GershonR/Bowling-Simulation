/* clearer.js
 *
 * COMP 3490 Final Project
 *
 * Created by:
 *  Nicholas Josephson - 7791547
 *  Gershon Reydman    - 7763541
 *  Eric Kulchycki     - 7767961
 */

function dropClearer() {
    //clearer.setLinearVelocity(new THREE.Vector3(120, 0, 0));
    //setTimeout(function() {
    //		clearer.setLinearVelocity(new THREE.Vector3(0, 0, 0));
    //		clearer.setAngularVelocity(new THREE.Vector3(0, 0, 0));
    //}, 3500);
    // clearer.setLinearVelocity(new THREE.Vector3(0, -1, 0));
//	 setTimeout(function() {
//			clearer.setLinearVelocity(new THREE.Vector3(0, 0, 0));
//			clearer.setAngularVelocity(new THREE.Vector3(0, 0, 0));
//	}, 3500);
    var direction = new THREE.Vector3(0, -0.7, 0); // amount to move per frame
    clearer.setLinearVelocity(new THREE.Vector3(0, 0, 0));
    clearer.setAngularVelocity(new THREE.Vector3(0, 0, 0));

    function animateClearerDown() {
		clearer.rotation.set(0, 0, 0);
        clearer.position.add(direction); // add to position
        clearer.__dirtyPosition = true;
		clearer.__dirtyRotation = true;
        renderer.render(scene, camera);
        if (clearer.position.y <= 20) {
            return moveClearer();
        }
        requestAnimationFrame(animateClearerDown); // keep looping
    }

    requestAnimationFrame(animateClearerDown); // start loop;
}

function moveClearer() {
    var direction = new THREE.Vector3(0.7, 0, 0); // amount to move per frame
    function animateClearerBack() {
		clearer.rotation.set(0, 0, 0);
        clearer.setLinearVelocity(new THREE.Vector3(0, 0, 0));
        clearer.setAngularVelocity(new THREE.Vector3(0, 0, 0));
        clearer.position.add(direction); // add to position
        clearer.__dirtyPosition = true;
		clearer.__dirtyRotation = true;
        renderer.render(scene, camera);
        if (clearer.position.x >= 30) {
            return moveUp();
        }
        requestAnimationFrame(animateClearerBack); // keep looping
    }

    requestAnimationFrame(animateClearerBack); // start loop;
}

function moveUp() {
    var direction = new THREE.Vector3(0, 0.9, 0); // amount to move per frame
    function animateClearer() {
        clearer.position.add(direction); // add to position
        clearer.__dirtyPosition = true;
        renderer.render(scene, camera);
        if (clearer.position.y >= 105) {
            return moveClearerBack();
        }
        requestAnimationFrame(animateClearer); // keep looping
    }

    requestAnimationFrame(animateClearer); // start loop;
}

function moveClearerBack() {
    var direction = new THREE.Vector3(-0.9, 0, 0); // amount to move per frame
    function animateClearer() {
		clearer.rotation.set(0, 0, 0);
        clearer.setLinearVelocity(new THREE.Vector3(0, 0, 0));
        clearer.setAngularVelocity(new THREE.Vector3(0, 0, 0));
        clearer.position.add(direction); // add to position
        clearer.__dirtyPosition = true;
		clearer.__dirtyRotation = true;
        renderer.render(scene, camera);
        if (clearer.position.x <= -50) {
            clearer.setLinearVelocity(new THREE.Vector3(0, 0, 0));
            clearer.setAngularVelocity(new THREE.Vector3(0, 0, 0));
            scene.add(clearerPlane);
            return dropSetter();
        }
        requestAnimationFrame(animateClearer); // keep looping
    }

    requestAnimationFrame(animateClearer); // start loop;
}

function dropSetter() {
    var direction = new THREE.Vector3(0, -0.6, 0); // amount to move per frame
    function animateSetterDown() {
        setter.position.add(direction); // add to position
        setter.__dirtyPosition = true;
        renderer.render(scene, camera);
        if (setter.position.y < 50) {
            resetPins();
            moveSetterUp();
            return;
        }
        requestAnimationFrame(animateSetterDown); // keep looping
    }

    requestAnimationFrame(animateSetterDown); // start loop;
}

function moveSetterUp() {
    var direction = new THREE.Vector3(0, 0.6, 0); // amount to move per frame
    function animateSetterUp() {
        setter.position.add(direction); // add to position
        setter.__dirtyPosition = true;
        renderer.render(scene, camera);
        if (setter.position.y >= 90) {
            return;
        }
        requestAnimationFrame(animateSetterUp); // keep looping
    }

    requestAnimationFrame(animateSetterUp); // start loop;
}



