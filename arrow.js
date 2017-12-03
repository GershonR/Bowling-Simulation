var arrow;
var right = 0;
var left = 0;
function drawArrow() {
	addedArrow = true;
    var img = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
        map:THREE.ImageUtils.loadTexture('textures/arrow.png')
    });
    img.map.needsUpdate = true; //ADDED

    // plane	
	geometry = new THREE.PlaneGeometry(80, 40);
	material = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture('textures/arrow.png'), transparent: true, opacity:1, side: THREE.DoubleSide });
	arrow = new THREE.Mesh(geometry, material);
	arrow.position.y = 17;
	arrow.position.z = ball.position.z;
	arrow.rotation.x = -(Math.PI / 2);
	arrow.position.x = -750;
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
      if(arrow.rotation.z >= 0.7) {
    	 return rotateLeft();
	  }
	  if(stopArrow)
	  {
		//scene.remove(arrow);
		return;
	  }
      setTimeout(function() { requestAnimationFrame(animateRight); }, 10);
      
    }
    requestAnimationFrame(animateRight);
}

function rotateLeft() {
	right = 0;
    function animateLeft() {
	  left += 0.005;
	  arrow.rotation.set(arrow.rotation.x, arrow.rotation.y, arrow.rotation.z - left);
      renderer.render(scene, camera);
      if(arrow.rotation.z <= -0.7) {
    	 return rotateRight();
	  }
	  if(stopArrow)
	  {
		//scene.remove(arrow);
		return;
	  }
	  setTimeout(function() { requestAnimationFrame(animateLeft); }, 10);
      
    }
    requestAnimationFrame(animateLeft);
}