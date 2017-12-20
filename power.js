/* power.js
 *
 * COMP 3490 Final Project
 *
 * Created by:
 *  Nicholas Josephson - 7791547
 *  Gershon Reydman    - 7763541
 *  Eric Kulchycki     - 7767961
 */

var power = 75;
var powerMax = 100;
var powerMin = 35;
var powerDelta = 0.8;

function createPowerSprite() {
    var spriteMaterial = new THREE.SpriteMaterial(
        {
            map: new THREE.TextureLoader().load('textures/glow2.png'),
            //useScreenCoordinates: false,
            color: 0x8baaaa, transparent: false, blending: THREE.AdditiveBlending
        });
    sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(100, 100, 1000);

    return sprite;
}

function animatePower() {
    power += powerDelta;
    sprite.scale.set(power, power, 1000);

    if (power >= powerMax || power <= powerMin) {
        powerDelta = -powerDelta;
    }
}





