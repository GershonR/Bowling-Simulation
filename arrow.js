/* arrow.js
 *
 * COMP 3490 Final Project
 *
 * Created by:
 *  Nicholas Josephson - 7791547
 *  Gershon Reydman    - 7763541
 *  Eric Kulchycki     - 7767961
 */

var arrow;
var right = 0;
var left = 0;

function drawArrow() {
    addedArrow = true;
    var arrowTexture = new THREE.TextureLoader().load("textures/arrow.png");

    //var img = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
    //    map: arrowTexture
    //});
    //img.map.needsUpdate = true; //ADDED

    // plane
    var geometry = new THREE.PlaneGeometry(40, 20);
    var material = new THREE.MeshLambertMaterial({
        map: arrowTexture,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide
    });
    arrow = new THREE.Mesh(geometry, material);
    arrow.position.y = 3;
    arrow.position.z = ball.position.z;
    arrow.rotation.x = -(Math.PI / 2);
    arrow.position.x = -475;
    scene.add(arrow);
    right = arrow.rotation.z;
    rotateRight();

}

function rotateRight() {
    left = 0;

    function animateRight() {
        right += 0.005;
        arrow.rotation.set(arrow.rotation.x, arrow.rotation.y, arrow.rotation.z + right);
        renderer.render(scene, camera);
        if (arrow.rotation.z >= 0.7) {
            return rotateLeft();
        }
        if (stopArrow || glowing) {
            //scene.remove(arrow);
            return;
        }
        setTimeout(function () {
            requestAnimationFrame(animateRight);
        }, 10);

    }

    requestAnimationFrame(animateRight);
}

function rotateLeft() {
    right = 0;

    function animateLeft() {
        left += 0.005;
        arrow.rotation.set(arrow.rotation.x, arrow.rotation.y, arrow.rotation.z - left);
        renderer.render(scene, camera);
        if (arrow.rotation.z <= -0.7) {
            return rotateRight();
        }
        if (stopArrow || glowing) {
            //scene.remove(arrow);
            return;
        }
        setTimeout(function () {
            requestAnimationFrame(animateLeft);
        }, 10);

    }

    requestAnimationFrame(animateLeft);
}


