var ballSet;

function drawBowlingBall() {

    //draw the transparent bowling ball for placement
    var bowlingBallMaterial = new THREE.MeshPhongMaterial({color: 0x000000, transparent: true, opacity: 0.90});
    ballSet = new THREE.Mesh(new SphereGeometry(), bowlingBallMaterial);

    ballSet.transparent = true;
    ballSet.position(-800, 275, 0);

    scene.add(ballSet);



}