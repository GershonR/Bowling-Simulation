var size = 0;
function drawPower() {
	var spriteMaterial = new THREE.SpriteMaterial( 
	{ 
		map: new THREE.ImageUtils.loadTexture( 'textures/glow2.png' ), 
		useScreenCoordinates: false,
		color: 0x8b0000, transparent: false, blending: THREE.AdditiveBlending
	});
	sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(100, 100, 1000);
	ball.add(sprite); // this centers the glow at the mesh
	powerUp();
}

function powerUp() {
    function animateUp() {
	  power += 0.8;
	  console.log("Power: " + power);
	  sprite.scale.set(power, power, 1000);
      renderer.render(scene, camera);
      if(power >= 120) {
    	 return powerDown();
	  }
      requestAnimationFrame(animateUp);
      
    }
    requestAnimationFrame(animateUp);
}

function powerDown() {
    function animateDown() {
	  power -= 0.8;
	  sprite.scale.set(power, power, 1000);
      renderer.render(scene, camera);
      if(power <= 45) {
    	 return powerUp();
	  }
      requestAnimationFrame(animateDown);
      
    }
    requestAnimationFrame(animateDown);
}