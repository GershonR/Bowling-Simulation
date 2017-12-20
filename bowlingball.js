/* bowlingball.js
 *
 * COMP 3490 Final Project
 *
 * Created by:
 *  Nicholas Josephson - 7791547
 *  Gershon Reydman    - 7763541
 *  Eric Kulchycki     - 7767961
 */

var ballSet;

function drawBowlingBall() {

    //draw the transparent bowling ball for placement
    var bowlingBallMaterial = new THREE.MeshPhongMaterial({color: 0x000000, transparent: true, opacity: 0.50});
    ballSet = new THREE.Mesh(new THREE.SphereGeometry(8, 32, 64), bowlingBallMaterial);

    ballSet.position.x = -500;
    ballSet.position.y = 20;
    ballSet.position.z = 0;


    scene.add(ballSet);
}


