import MenuScene from '/game/MenuScene.js';
import GameScene from '/game/GameScene.js';

var gameDiv = document.getElementById('gameDiv');

var phaserGame = new Phaser.Game({
    width: window.innerWidth,
    height: window.innerHeight,
    type: Phaser.WEBGL,
    parent: gameDiv,
    input: { gamepad: true },
});

phaserGame.scene.add('MenuScene', MenuScene);
phaserGame.scene.add('GameScene', GameScene);
phaserGame.scene.start('MenuScene');
