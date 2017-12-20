/* animation.js
 *
 * COMP 3490 Final Project
 *
 * Created by:
 *  Nicholas Josephson - 7791547
 *  Gershon Reydman    - 7763541
 *  Eric Kulchycki     - 7767961
 */

var smoking = false;
var smokeParticles;

function evolveSmoke() {
    var sp = smokeParticles.length - 1;
    while(sp > 0) {
        smokeParticles[sp].rotation.z += (delta * 0.2);
        sp--;
    }
}



