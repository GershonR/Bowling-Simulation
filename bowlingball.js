var ballSet;

function drawBowlingBall() {

    //draw the transparent bowling ball for placement
    var bowlingBallMaterial = new THREE.MeshPhongMaterial({color: 0x000000, transparent: true, opacity: 0.50});
    ballSet = new THREE.Mesh(new THREE.SphereGeometry(12, 32, 32), bowlingBallMaterial);

    ballSet.position.x = -800;
    ballSet.position.y = 72;
    ballSet.position.z = 0;


    scene.add(ballSet);



}