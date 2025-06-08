class Start extends Phaser.Scene {
    constructor() {
        super("startScene");
    }

    create() {
        this.scene.stop("level1Scene");

        this.add.bitmapText(game.config.width/2,game.config.height/2, 'bubble-pixel-font', 'shrimpri.').setScale(1.5).setOrigin(0.5);
        this.add.bitmapText(game.config.width/2,game.config.height/2 + 70, 'bubble-pixel-font', 'press [space] to begin').setScale(.6).setOrigin(0.5);
        this.controls = this.add.bitmapText(10, game.config.height-10, 'bubble-pixel-font', '[1] credits\n[2] controls').setScale(.6).setOrigin(0,1);
        this.showingControls = false;

        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start("level1Scene");
        });
        this.input.keyboard.on('keydown-ONE', () => {
            this.scene.start("creditsScene");
        });
        this.input.keyboard.on('keydown-TWO', () => {
            this.showingControls = !this.showingControls;
            if (this.showingControls) {
                this.controls.setText('[1] credits\ncontrols: [a] left  [d] right  [space] jump/double jump  [s] down');
            } else {
                this.controls.setText('[1] credits\n[2] controls');
            }
        });
    }
}