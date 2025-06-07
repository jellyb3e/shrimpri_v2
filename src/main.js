"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    width: 1392,
    height: 992,
    scene: [Load, Start, Credits, Level1],
    backgroundColor: '#192047'
}

var my = {sprite: {}, text: {}, vfx: {}};

const game = new Phaser.Game(config);