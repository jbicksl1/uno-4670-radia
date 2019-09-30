import MenuScene from '/game/MenuScene.js';

var gameDiv = document.getElementById('game');

var phaserGame = new Phaser.Game({
    width: window.innerWidth,
    height: window.innerHeight,
    type: Phaser.WEBGL,
    parent: gameDiv,
    scene: [ new MenuScene() ]
});
