class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    create() {
        this.add.bitmapText(game.config.width/2,50, 'bubble-pixel-font', 'credits.').setScale(1).setOrigin(0.5,0);
        this.add.bitmapText(20,game.config.height/2 - 10, 'bubble-pixel-font', 'audio assets:\n\npgi – step_sound (Freesound) https://freesound.org/people/pgi/sounds/211457/\nristooooo1 – Bubbles 004 (Freesound) https://freesound.org/people/ristooooo1/sounds/539819/\nrandom_intruder – AHHHH (Freesound) https://freesound.org/people/random_intruder/sounds/392172/\nDCSFX – Underwater [Loop] AMB (Freesound) https://freesound.org/people/DCSFX/sounds/366159/\n4K Sounds – cha ching-sound effect (download) https://www.youtube.com/watch?v=tqNP8SiB90s\n\n\nmusic:\n\nSneaky Snitch Kevin MacLeod (incompetech.com) Licensed under Creative Commons: \nBy Attribution 3.0 License http://creativecommons.org/licenses/by/3.0/\n\n\nart assets:\n\nSzym – SpearFishing assets pack (itch.io) https://nszym.itch.io/spearfishing-assets-pack\njeti – Kiwi Soda bitmap font (dafont) https://www.dafont.com/kiwisoda.font?\njeti – Double Homicide bitmap font (dafont) https://www.dafont.com/doublehomicide.font?').setScale(.45).setOrigin(0,.5);
        this.add.bitmapText(10, game.config.height-10, 'bubble-pixel-font', '[1] return to start').setScale(.6).setOrigin(0,1);

        this.input.keyboard.on('keydown-ONE', () => {
            this.scene.start("startScene");
        });
    }
}