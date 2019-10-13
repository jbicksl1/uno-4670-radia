import MenuScene from './game/MenuScene.js';
import GameScene from './game/GameScene.js';
import SettingsScene from './game/SettingsScene.js';

var gameDiv = document.getElementById('gameDiv');

var phaserGame = new Phaser.Game({
    width: window.innerWidth,
    height: window.innerHeight,
    type: Phaser.WEBGL,
    parent: gameDiv,
    physics: {
	default: 'arcade'
    },
    input: { gamepad: true }
});

phaserGame.scene.add('MenuScene', MenuScene);
phaserGame.scene.add('GameScene', GameScene);
phaserGame.scene.add('SettingsScene', SettingsScene);
phaserGame.scene.start('MenuScene');
