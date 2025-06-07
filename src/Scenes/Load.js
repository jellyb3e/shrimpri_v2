class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load tilemap information
        this.load.image("tilemap_tiles", "Abyss.png");                         // Packed tilemap
        this.load.image("corals", "Corals.png");
        this.load.image("shells", "Shells - 16x16.png");
        this.load.image("seablue", "Seaweed Blue.png");
        this.load.image("seapink", "Seaweed Pink.png");
        this.load.image("seamedium", "Medium.png");
        this.load.image("sealight", "Light.png");
        this.load.image("coin-particle", "coin-particle.png");
        this.load.image("step-particle", "step-particle.png");
        this.load.image("love-icon", "love-icon.png");
        this.load.image("heart","heart.png");
        this.load.image("no-heart","no-heart.png");
        this.load.image("harpoon","harpoon.png");

        this.load.audio('deep-ocean', "underwater_sound.wav");
        this.load.audio('sneaky-music',"Sneaky Snitch.mp3");
        this.load.audio('step', 'step.mp3');
        this.load.audio('jump', 'jump.mp3');
        this.load.audio('collect', 'collect.mp3');
        this.load.audio('level_end', 'level_end.mp3');
        this.load.audio('damage', 'damage.mp3');
        this.load.audio('clam-collect', 'clam-collect.mp3');

        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.json");   // Tilemap in JSON
        this.load.spritesheet("shrimp_tiles", "Shrimp-Player 16x32.png", { frameWidth: 16, frameHeight: 32});
        this.load.spritesheet("coin_tiles", "Coin Big - 16x16.png", { frameWidth: 16, frameHeight: 16});
        this.load.spritesheet("fish_tiles", "Grey.png", { frameWidth: 32, frameHeight: 16});
        this.load.spritesheet("lover_tiles", "Shrimp-Lover 16x32.png", { frameWidth: 16, frameHeight: 32});
        this.load.spritesheet("evilshrimp_tiles", "shrimp-evil.png", { frameWidth: 16, frameHeight: 32});
        this.load.spritesheet("angler_tiles", "SeaAngler.png", { frameWidth: 32, frameHeight: 32});
        this.load.spritesheet("squid_tiles", "Squid - 32x16.png", { frameWidth: 32, frameHeight: 16});
        this.load.spritesheet("sword_tiles", "SwordFish.png", { frameWidth: 48, frameHeight: 32});
        this.load.spritesheet("jelly_tiles", "JellyFish.png", { frameWidth: 32, frameHeight: 16});
        this.load.spritesheet("diver_tiles", "Diver 1.png", { frameWidth: 32, frameHeight: 32});
        this.load.spritesheet("clam_tiles", "clam.png", { frameWidth: 16, frameHeight: 32});
        this.load.spritesheet("bubble_tiles", "Bubble - 8x8.png", { frameWidth: 8, frameHeight: 8});

        this.load.bitmapFont("bubble-pixel-font", "bubble-pixel-font.png", "bubble-pixel-font.xml");
        this.load.bitmapFont("combo-pixel-font", "combo-pixel-font.png", "combo-pixel-font.xml");
    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('shrimp_tiles', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('shrimp_tiles', { start: 0, end: 1 }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('shrimp_tiles', { start: 2, end: 2 }),
        });
        
        this.anims.create({
            key: 'coin-spin',
            frames: this.anims.generateFrameNumbers('coin_tiles', { start: 0, end: 7 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'bubble-pop',
            frames: this.anims.generateFrameNumbers('bubble_tiles', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'clam-open',
            frames: [
                { key: 'clam_tiles', frame: 0 },
                { key: 'clam_tiles', frame: 1 },
                { key: 'clam_tiles', frame: 2 },
                { key: 'clam_tiles', frame: 3 },
                { key: 'clam_tiles', frame: 4 },
                { key: 'clam_tiles', frame: 5 },
                { key: 'clam_tiles', frame: 5 },
                { key: 'clam_tiles', frame: 5 },
                { key: 'clam_tiles', frame: 5 },
                { key: 'clam_tiles', frame: 6 },
            ],
            frameRate: 3,
            repeat: 0
        });

        // sprites
        this.anims.create({
            key: 'lover-idle',
            frames: this.anims.generateFrameNumbers('lover_tiles', { start: 0, end: 1 }),
            frameRate: 1,
            repeat: -1
        });
        this.anims.create({
            key: 'evil-walk',
            frames: this.anims.generateFrameNumbers('evilshrimp_tiles', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'evil-idle',
            frames: [
                { key: 'evilshrimp_tiles', frame: 0 }
            ],
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'evil-jump',
            frames: [
                { key: 'evilshrimp_tiles', frame: 2 }
            ],
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'fish-swim',
            frames: this.anims.generateFrameNumbers('fish_tiles', { start: 0, end: 7 }),
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: 'jellypink-swim',
            frames: [
                { key: 'jelly_tiles', frame: 3 }
            ],
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: 'jellypink-charge',
            frames: [
                { key: 'jelly_tiles', frame: 0 },
                { key: 'jelly_tiles', frame: 1 },
                { key: 'jelly_tiles', frame: 2 },
            ],
            frameRate: 6,
            repeat: 0
        });
        this.anims.create({
            key: 'jellyblue-swim',
            frames: [
                { key: 'jelly_tiles', frame: 7 }
            ],
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: 'jellyblue-charge',
            frames: [
                { key: 'jelly_tiles', frame: 4 },
                { key: 'jelly_tiles', frame: 5 },
                { key: 'jelly_tiles', frame: 6 },
            ],
            frameRate: 6,
            repeat: 0
        });
        this.anims.create({
            key: 'squidpink-swim',
            frames: [
                { key: 'squid_tiles', frame: 6 }
            ],
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: 'squidpink-charge',
            frames: [
                { key: 'squid_tiles', frame: 7 },
                { key: 'squid_tiles', frame: 4 },
                { key: 'squid_tiles', frame: 5 },
            ],
            frameRate: 6,
            repeat: 0
        });
        this.anims.create({
            key: 'squidred-swim',
            frames: [
                { key: 'squid_tiles', frame: 2 }
            ],
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: 'squidred-charge',
            frames: [
                { key: 'squid_tiles', frame: 3 },
                { key: 'squid_tiles', frame: 0 },
                { key: 'squid_tiles', frame: 1 },
            ],
            frameRate: 6,
            repeat: 0
        });
        this.anims.create({
            key: 'sword-swim',
            frames: this.anims.generateFrameNumbers('sword_tiles', { start: 0, end: 7 }),
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: 'angler-swim',
            frames: this.anims.generateFrameNumbers('angler_tiles', { start: 0, end: 7 }),
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: 'diver-swim',
            frames: this.anims.generateFrameNumbers('diver_tiles', { start: 1, end: 4 }),
            frameRate: 4,
            repeat: -1
        });

        // ...and pass to the next Scene
        this.scene.start("startScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}