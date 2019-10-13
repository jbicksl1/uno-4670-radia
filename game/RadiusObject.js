export default class RadiusObject extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, radius) {
	super(scene, scene.cameras.main.centerX, scene.cameras.main.centerY, 'radius');
	this.setTintFill();
	scene.add.existing(this);
	scene.physics.add.existing(this);
	this.scene = scene;

	this.radius = radius;
	this.setScale(this.radius/800);
    }

    preUpdate() {
	_.forEach(this.scene.players, (player, playerNumber) => {
	    if(player) {
		player.dx = player.x - this.x;
		player.dy = player.y - this.y;
		player.rSq = player.dx*player.dx+player.dy*player.dy;
		if(player.rSq*4 > this.radius*this.radius) {
		    this.scene.respawn(playerNumber);
		}
	    }
	});
    }
}
