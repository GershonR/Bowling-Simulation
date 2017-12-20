/* bowlingball.js
 *
 * COMP 3490 Final Project
 *
 * Created by:
 *  Nicholas Josephson - 7791547
 *  Gershon Reydman    - 7763541
 *  Eric Kulchycki     - 7767961
 */

var ballRadius = 8;

function createBowlingBall() {
    var ballMaterial = new THREE.MeshPhongMaterial({color: 0xff3333});
    var ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);

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

    var ball = new Physijs.ConvexMesh(result.geometry, ballMaterial, 15);
    ball.rotation.z = Math.PI / 16;
    ball.name = "ball";
    ball.castShadow = true;

    return ball;
}

function createSetBall() {
    //create the transparent bowling ball for placement
    var ballMaterial = new THREE.MeshPhongMaterial({color: 0x000000, transparent: true, opacity: 0.50});
    var ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);

    var ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(-500, ballRadius + 1, 0);

    return ball;
}


