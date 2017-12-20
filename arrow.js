/* arrow.js
 *
 * COMP 3490 Final Project
 *
 * Created by:
 *  Nicholas Josephson - 7791547
 *  Gershon Reydman    - 7763541
 *  Eric Kulchycki     - 7767961
 */

var arrowAngle = 0.7;
var arrowAngleDelta = 0.025;

function createArrow() {
    var arrowTexture = new THREE.TextureLoader().load("textures/arrow.png");
    var geometry = new THREE.PlaneGeometry(40, 20);
    var material = new THREE.MeshLambertMaterial({
        map: arrowTexture,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide
    });

    var arrow = new THREE.Mesh(geometry, material);
    arrow.position.y = 3;
    arrow.position.z = ball.position.z;
    arrow.rotation.x = -(Math.PI / 2);
    arrow.position.x = -475;

    return arrow;
}

function animateArrow() {
    arrow.rotation.z += arrowAngleDelta;

    if (arrow.rotation.z > arrowAngle || arrow.rotation.z < -arrowAngle) {
        arrowAngleDelta = -arrowAngleDelta;
    }
}

