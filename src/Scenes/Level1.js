class Level1 extends Phaser.Scene {
    constructor() {
        super("level1Scene");
    }

    preload() {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    init() {
        // variables and settings
        this.ACCELERATION = 32;
        this.DRAG = 88;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 32;
        this.JUMP_VELOCITY = -44;
        this.MAX_VELOCITY = 40;
        this.PARTICLE_VELOCITY = 20;
    }

    create() {
        this.scene.stop("startScene");
        this.canRestart = false;
        this.passedLine = false;
        this.cutscene = false;
        this.score = 0;
        this.lives = 3;
        this.fish_stepped_on = new Map();
        this.steppedCounter = 0;
        this.collected = false;
        this.played_end_sound = false;
        this.healthIcons = [];
        this.stepTimer = 0;
        this.stepInterval = 40;
        this.invincibleTimer = 0;
        this.invincibleInterval = 120;
        this.invincible = false;
        this.map = this.add.tilemap("platformer-level-1", 16, 16, 20, 120);
        this.tileset = this.map.addTilesetImage("Abyss", "tilemap_tiles");
        this.groundLayer = this.map.createLayer("TexturedLevel", this.tileset, 0, 0);
        this.blue = this.map.addTilesetImage("Seaweed Blue", "seablue");
        this.pink = this.map.addTilesetImage("Seaweed Pink", "seapink");
        this.medium = this.map.addTilesetImage("MediumSeaweed", "seamedium");
        this.light = this.map.addTilesetImage("LightSeaweed", "sealight");
        this.corals = this.map.addTilesetImage("Corals", "corals");
        this.shells = this.map.addTilesetImage("Shells - 16x16", "shells");
        this.mapLayers = [
            this.groundLayer,
            this.map.createLayer("Trinkets", [this.corals, this.shells]),
            this.map.createLayer("Seaweed1", [this.blue, this.pink, this.medium, this.light], 0, -16),
            this.map.createLayer("Seaweed2", [this.blue, this.pink, this.medium, this.light], 0, -16),
            this.map.createLayer("Seaweed3", [this.medium, this.light], 0, -16)
        ]
        this.animatedTiles.init(this.map);
        this.groundLayer.setCollisionByProperty({ collides: true });
        this.sneakyMusic = this.sound.add('sneaky-music');
        this.sneakyMusic.volume = .4;
        this.music = this.sound.add('deep-ocean');
        this.music.loop = true;
        this.music.volume = .5;
        this.music.play();

        // add objects
        let sprites = this.map.getObjectLayer('MovingPlatforms').objects;
        this.fishGroup = this.physics.add.group();

        sprites.forEach(obj => {
            let fish;

            switch (obj.name) {
                case 'jellypink':
                    fish = new JellyPink(this, obj.x, obj.y, obj.properties); 
                    break;
                case 'jellyblue':
                    fish = new JellyBlue(this, obj.x, obj.y, obj.properties); 
                    break;
                case 'squidred':
                    fish = new SquidRed(this, obj.x, obj.y, obj.properties); 
                    break;
                case 'squidpink':
                    fish = new SquidPink(this, obj.x, obj.y, obj.properties); 
                    break;
                case 'angler':
                    fish = new Angler(this, obj.x, obj.y, obj.properties); 
                    break;
                case 'sword':
                    fish = new SwordFish(this, obj.x, obj.y, obj.properties); 
                    break;
                case 'fish':
                    fish = new GreyFish(this, obj.x, obj.y, obj.properties); 
                    break;
                default:
                    break;
            }

            if (fish) {
                this.fishGroup.add(fish);
                fish.setImmovable(true);
                fish.setOrigin(0,1);
                fish.body.allowGravity = false;
                fish.body.checkCollision.left = false;
                fish.body.checkCollision.down = false;
                fish.body.checkCollision.right = false;
            }
        });

        this.divers  = this.map.createFromObjects("Enemies", {
            name: "diver",
            key: "diver_tiles",
            frame: 0
        });
        this.divers.forEach(d => {
            d.anims.play('diver-swim');
        });
        this.physics.world.enable(this.divers, Phaser.Physics.Arcade.DYNAMIC_BODY);
        this.diverGroup = this.add.group(this.divers);
        this.diverGroup.children.iterate(d => {
            d.minX = d.x;
            d.maxX = d.x + d.data.list.maxXOffset;
            d.speed = 20;
            d.body.setVelocityX(d.speed);
            d.body.allowGravity = false;
            d.body.setSize(12,21);
            d.body.setOffset(9,3);
        });

        this.lover = this.map.createFromObjects("MovingPlatforms", {
            name: "pookie",
            key: "lover_tiles",
            frame: 0,
        })[0];
        this.physics.world.enable(this.lover, Phaser.Physics.Arcade.DYNAMIC_BODY);
        this.physics.add.collider(this.groundLayer, this.lover);
        this.lover.anims.play('lover-idle');
        this.lover.body.setSize(14,24);
        this.lover.body.setOffset(1,4);

        this.coins = this.map.createFromObjects("Collectibles", {
            name: "coin",
            key: "coin_tiles",
            frame: 0
        });
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.coinGroup = this.add.group(this.coins);
        this.coins.forEach(coin => {
            coin.anims.play('coin-spin');
        });

        this.clam = this.map.createFromObjects("Collectibles", {
            name: "clam",
            key: "clam_tiles",
            frame: 0,
        })[0];
        this.physics.world.enable(this.clam, Phaser.Physics.Arcade.STATIC_BODY);
        this.clam.body.setSize(16,16);
        this.clam.body.setOffset(0,16);

        this.evilshrimp = this.map.createFromObjects("Enemies", {
            name: "shrimpevil",
            key: "evilshrimp_tiles",
            frame: 1,
        })[0];
        this.physics.world.enable(this.evilshrimp, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.add.collider(this.groundLayer, this.evilshrimp);
        this.evilshrimp.body.setSize(14,24);
        this.evilshrimp.body.setOffset(0,-12);
        this.evilshrimp.setOrigin(0.5,1);
        this.evilshrimp.setFlipX(true);

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.spawnPoint = this.map.findObject("MovingPlatforms", obj => obj.name == "player");
        my.sprite.player = this.physics.add.sprite(this.spawnPoint.x, this.spawnPoint.y, 'shrimp_tiles').setCollideWorldBounds(true);
        my.sprite.player.setOrigin(0,1);
        my.sprite.player.body.setSize(14,24);
        my.sprite.player.body.setOffset(1,4);
        my.sprite.player.body.setMaxVelocity(this.MAX_VELOCITY, -this.JUMP_VELOCITY);

        // add player collisions
        this.jumpThroughCollider = this.physics.add.collider(my.sprite.player, this.fishGroup, null, (player, platform) => {
            if (this.disableOneWay) { return false; }

            let playerBottom = player.body.y + player.body.height;
            let platformTop = platform.body.y;

            let isFalling = player.body.velocity.y >= 0;
            let isAbove = playerBottom <= platformTop + 5 && playerBottom >= platformTop;

            return isFalling && isAbove;
        }, this);
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.overlap(my.sprite.player, this.diverGroup, (player, diver) => {
            if (!this.invincible && !this.cutscene) {
                this.invincible = true;
                this.takeDamage();
                this.sound.play('damage', { volume: 0.1, rate: 1 });
                this.invincibleTimer = this.invincibleInterval;
            }
        });

        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.jump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.jumping = false;
        this.canDoubleJump = false;

        this.input.keyboard.on('keydown-Q', () => {
            console.log(my.sprite.player.x);
        });
        this.input.keyboard.on('keydown-R', () => {
            if (this.canRestart) {
                this.music.stop();
                this.scene.start('startScene');
            }
        });

        my.vfx.jump = this.add.particles(0, 0, "bubble_tiles", {
            anim: ['bubble-pop'],
            lifespan: 600,
            alpha: { start: .8, end: 0 },
            speed: this.PARTICLE_VELOCITY*3/2,
            angle: { min: 40, max: 140 },
            gravityY: -100,
            quantity: 10,
            frequency: 5,
            maxAliveParticles: 10,
        });
        my.vfx.jump.stop();
        my.vfx.jump.startFollow(my.sprite.player, my.sprite.player.displayWidth/2, -my.sprite.player.displayHeight/6, false);
        
        my.vfx.double_jump = this.add.particles(0, 0, "bubble_tiles", {
            anim: ['bubble-pop'],
            lifespan: 600,
            alpha: { start: .8, end: 0 },
            speed: this.PARTICLE_VELOCITY*3/2,
            angle: { min: 60, max: 120 },
            gravityY: -100,
            quantity: 10,
            frequency: 5,
            maxAliveParticles: 5,
        });
        my.vfx.double_jump.stop();
        my.vfx.double_jump.startFollow(my.sprite.player, my.sprite.player.displayWidth/2, -my.sprite.player.displayHeight/4, false);
        
        my.vfx.walking = this.add.particles(0, 0, "step-particle", {
            scale: { start: .2, end: .5 },
            lifespan: 200,
            alpha: { start: 1, end: 0 },
            speed: this.PARTICLE_VELOCITY,
            gravityY: 120,
            quantity: 6,
            frequency: 100,
            maxAliveParticles: 24,
        });
        my.vfx.walking.stop();
        my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2, -my.sprite.player.displayHeight/6, false);
        
        let love_location = {
            x: my.sprite.player.x + my.sprite.player.displayWidth,
            y: my.sprite.player.y - my.sprite.player.displayHeight + 5
        };
        my.vfx.love = this.add.particles(love_location.x, love_location.y, "love-icon", {
            scale: { start: .4, end: 1 },
            lifespan: 1000,
            alpha: { start: 1, end: .5 },
            gravityY: -40,
            quantity: 1,
            frequency: 200,
            maxAliveParticles: 24,
            x: {min:-4,max:4}
        });
        my.vfx.love.stop();
        
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (player, coin) => {
            if (!this.cutscene) {
                let emitter = this.add.particles(coin.x, coin.y, "coin-particle", {
                    scale: { start: 1, end: 0.2 },
                    lifespan: 700,              
                    speed: { min: 120, max: 150 },  
                    angle: { min: -70, max: -110 },      
                    gravityY: 350,                          
                    quantity: 8,
                    frequency: -1,
                    maxAliveParticles: 8
                });
                this.uiCamera.ignore(emitter);
                coin.destroy(); // remove coin on overlap
                this.updateScore(this.airtime_combo);
                this.sound.play('collect', { volume: 0.1, rate: 1 });
                emitter.explode();
                this.time.delayedCall(700, () => {
                    emitter.destroy();
                });
            }
        });

        this.physics.add.overlap(my.sprite.player, this.clam, (player, clam) => {
            if (!this.collected && !this.cutscene) {
                this.clam.anims.play('clam-open');
                this.sound.play('clam-collect', { volume: .1, rate: 1 });
                this.time.delayedCall(600, () => {
                    this.collected = true;
                });
            }
        });

        this.cameras.main.startFollow(my.sprite.player, false, 1, 1, 0, 40);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setZoom(5);
        this.setupUICam();
    }

    update() {
        if (!this.passedLine && this.justPassedLine()) {
            this.passedLine = true;
            this.cutscene = true;
            this.playCutscene();
        }

        this.currentFish = null;
        if (this.shooting && this.harpoon.y <= this.lastLife.y) {
            this.shooting = false;
            this.harpoon.body.setVelocityY(0);
            this.harpoon.visible = false;
            this.harpoon.x = game.config.width;
            this.harpoon.y = game.config.height;
            this.lastLife.setTexture('no-heart');
        }
        
        if (this.left.isDown && !this.cutscene) {
            my.vfx.walking.setParticleSpeed(-this.PARTICLE_VELOCITY, 0);
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
        } else if (this.right.isDown && !this.cutscene) {
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
        } else {
            my.vfx.walking.stop();
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle', true);
        }

        if (my.sprite.player.body.blocked.down) {
            this.jumping = false;
            this.falling = false;
            my.vfx.jump.stop();
            this.canDoubleJump = true;
            if (Phaser.Input.Keyboard.JustDown(this.down)) {
                this.disableOneWay = true;
                this.time.delayedCall(600, () => {
                    this.disableOneWay = false;
                });
            }
        } else {
            my.vfx.walking.stop();
            my.sprite.player.anims.play('jump', true);
            if (this.collected) {
                this.falling = true;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.jump) && !this.cutscene) {
            if (my.sprite.player.body.blocked.down) {
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
                this.jumping = true;
                my.vfx.jump.start();
                this.sound.play('jump', { volume: .3, rate: .8 });
                this.time.delayedCall(200, () => {
                    my.vfx.jump.stop();
                });
            } else if (this.canDoubleJump) {
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
                this.canDoubleJump = false;
                my.vfx.double_jump.start();
                this.sound.play('jump', { volume: .3, rate: .8 });
                this.time.delayedCall(200, () => {
                    my.vfx.double_jump.stop();
                });
            }
        }

        this.diverGroup.children.iterate(d => {
            if (d.x <= d.minX) {
                d.body.setVelocityX(d.speed);
                d.setFlipX(false);
            } else if (d.x >= d.maxX) {
                d.body.setVelocityX(-d.speed);
                d.setFlipX(true);
            }
        });
        
        this.fishGroup.children.iterate(f => {
            let deltaX = f.update();

            let playerBottom = my.sprite.player.body.y + my.sprite.player.body.height;
            let fishTop = f.body.y;

            let isFalling = my.sprite.player.body.velocity.y >= 0;
            let isAbove = playerBottom <= fishTop + 5 && playerBottom >= fishTop;

            let isHorizontallyAligned =
                my.sprite.player.body.x + my.sprite.player.body.width > f.body.x &&
                my.sprite.player.body.x < f.body.x + f.body.width;

            if (my.sprite.player.body.blocked.down && isFalling && isAbove && isHorizontallyAligned) {
                this.currentFish = f;
                if (!this.fish_stepped_on.has(this.currentFish)) {
                    this.fish_stepped_on.set(this.currentFish,"true");
                    this.steppedCounter++;
                }
                let nextX = my.sprite.player.x + deltaX;
                let nextTile;
                if (deltaX < 0) {
                    nextTile  = this.map.getTileAtWorldXY(nextX, my.sprite.player.y - my.sprite.player.height, true, this.cameras.main, this.groundLayer);
                } else {
                    nextTile  = this.map.getTileAtWorldXY(nextX+my.sprite.player.width, my.sprite.player.y - my.sprite.player.height, true, this.cameras.main, this.groundLayer);
                }
                if (!nextTile || !nextTile.collides) {
                    my.sprite.player.x = nextX;
                }
            }
        });

        let walking = (this.left.isDown || this.right.isDown) && my.sprite.player.body.blocked.down;
        if (walking && !this.currentFish && !this.cutscene) {
            this.stepTimer--;
            if (this.stepTimer <= 0) {
                this.sound.play('step', { volume: 1, rate: .9 });
                this.stepTimer = this.stepInterval;
            }
            my.vfx.walking.start();
        } else {
            this.stepTimer = 0;
        }

        if (this.invincible) {
            this.invincibleTimer--;
            my.sprite.player.visible = (this.invincibleTimer % 16 < 8);

            if (this.invincibleTimer <= 0) {
                this.invincible = false;
                my.sprite.player.visible = true;
            }
        }

        if (my.sprite.player.x >= this.spawnPoint.x-4 && my.sprite.player.x <= this.spawnPoint.x+20 && my.sprite.player.y <= this.spawnPoint.y+4 && my.sprite.player.y >= this.spawnPoint.y-4) {
            if (!this.collected) {
                my.vfx.love.start();
            } else {
                if (!this.played_end_sound) {
                    this.sound.play('level_end', { volume: 0.5, rate: 1 });
                    this.played_end_sound = true;
                    this.showFinalScore(true);
                }
            }
        } else {
            my.vfx.love.stop();
        }

        if (this.falling) {
            this.comboText.visible = true;
            this.airtime_combo += 0.005;
            this.comboText.setText("Airtime Combo:\nx"+this.airtime_combo.toFixed(2));
        } else {
            this.airtime_combo = 1.00;
            this.comboText.visible = false;
        }
    }

    setupUICam() {
        this.uiCamera = this.cameras.add(0, 0, this.scale.width, this.scale.height);
        this.uiCamera.setScroll(0, 0);

        // ignore main camera elements
        let particles = [my.vfx.jump, my.vfx.double_jump, my.vfx.love, my.vfx.walking];
        let sprites = [my.sprite.player,this.clam,this.lover,this.evilshrimp];

        this.uiCamera.ignore(this.mapLayers);
        this.uiCamera.ignore(sprites);
        this.uiCamera.ignore(particles);
        this.coins.forEach(coin => this.uiCamera.ignore(coin));
        this.fishGroup.getChildren().forEach(fish => this.uiCamera.ignore(fish));
        this.diverGroup.getChildren().forEach(diver => this.uiCamera.ignore(diver));

        // create ui elements
        this.scoreText = this.add.bitmapText(game.config.width-290, 24, 'bubble-pixel-font', 'score: 000').setScale(.9);
        this.lifescale = 4;
        let lifey = this.lifescale*1;
        this.harpoon = this.physics.add.sprite(game.config.width,game.config.height, 'harpoon').setOrigin(0).setScale(this.lifescale);
        this.harpoon.visible = false;
        this.harpoon.body.allowGravity = false;
        let life1 = this.add.image(3*this.lifescale,lifey, 'heart').setOrigin(0).setScale(this.lifescale);
        let life2 = this.add.image(life1.x+(life1.width+3)*this.lifescale,lifey, 'heart').setOrigin(0).setScale(this.lifescale);
        let life3 = this.add.image(life2.x+(life2.width+3)*this.lifescale,lifey, 'heart').setOrigin(0).setScale(this.lifescale);
        this.hearts = [life1,life2,life3];
        this.falling = false;
        this.airtime_combo = 1.00;
        this.comboText = this.add.bitmapText(24, game.config.height/3, 'combo-pixel-font', 'Airtime Combo:\nx2').setOrigin(0,0.5).setScale(.75);
        this.comboText.visible = false;
        let uiElements = [this.scoreText,this.comboText,this.harpoon,this.hearts];
        // make main cam ignore ui
        this.cameras.main.ignore(uiElements);
    }
    takeDamage() {
        this.lives--;
        this.playDeathAnim(this.hearts[this.lives]);
        if (!this.lives) {
            this.score = 0;
            this.showFinalScore(false);
        }
    }
    updateScore(amount) {
        this.score += amount;
        let padding = "";
        if (this.score < 100) {
            padding += 0;
        }
        if (this.score < 10) {
            padding += 0;       //lol
        }
        this.scoreText.setText("score: " + padding + Math.trunc(this.score));
    }
    playDeathAnim(heart) {
        this.harpoon.x = heart.x;
        this.harpoon.y = game.config.height;
        this.harpoon.visible = true;
        this.harpoon.body.setVelocityY(-10000);
        this.lastLife = heart;
        this.shooting = true;
    }
    showFinalScore(success) {
        this.cutscene = true;
        if (!success) {
            this.add.bitmapText(game.config.width/2, game.config.height/2, 'bubble-pixel-font', 'game over').setOrigin(0.5).setScale(2);
            this.updateScore(0);
        } else {
            this.updateScore(this.steppedCounter);
        }
        this.scoreText.visible = false;
        this.scoreText.setScale(1.5).setOrigin(.5);
        this.scoreText.x = game.config.width/2;
        this.scoreText.y = game.config.height*4/5;
        this.add.bitmapText(game.config.width/2, game.config.height*9/13, 'combo-pixel-font', 'fish stepped on: ' + this.steppedCounter).setOrigin(0.5).setScale(0.75);
        this.time.delayedCall(1000, () => {
            this.scoreText.visible = true;
            this.time.delayedCall(900,()=>{
                this.add.bitmapText(10, game.config.height-10, 'bubble-pixel-font', 'press [r] to restart').setScale(.6).setOrigin(0,1);
                this.canRestart = true;
            });
        });
    }

    justPassedLine() {
        return my.sprite.player.x >= 74 && my.sprite.player.x <= 81
            && my.sprite.player.y >= 988 && my.sprite.player.y <= 1012;
    }
    playCutscene() {
        this.sneakyMusic.play();
        this.evilshrimp.anims.play('evil-jump');
        this.tweens.add({
            targets: this.evilshrimp,
            y: 948, // add 4 to account for resized box :3
            duration: 2500,
            onComplete: () => {
                this.evilshrimp.anims.play('evil-walk');
                this.tweens.add({
                    targets: this.evilshrimp,
                    x: '-=22',
                    duration: 1250,
                    onComplete: () => {
                        this.evilshrimp.anims.play('evil-jump');
                        this.tweens.add({
                            targets: this.evilshrimp,
                            x: '-=22',
                            y: { value: '+=15', ease: 'Quad.easeIn' },
                            duration: 1250,
                            onComplete: () => {
                                this.evilshrimp.setFlipX(false);
                                this.evilshrimp.anims.play('evil-idle');
                                this.time.delayedCall(300, () => {
                                    this.clam.y = 940;
                                    this.evilshrimp.anims.play('evil-jump');
                                    this.tweens.add({
                                        targets: [this.evilshrimp,this.clam],
                                        x: '+=22',
                                        y: { value: '-=15', ease: 'Quad.easeOut' },
                                        duration: 1250,
                                        onComplete: () => {
                                            this.evilshrimp.anims.play('evil-walk');
                                            this.tweens.add({
                                                targets: [this.evilshrimp,this.clam],
                                                x: '+=22',
                                                duration: 1250,
                                                onComplete: () => {
                                                    this.evilshrimp.anims.play('evil-idle');
                                                    this.time.delayedCall(300, () => {
                                                        this.evilshrimp.anims.play('evil-jump');
                                                        this.tweens.add({
                                                            targets: [this.evilshrimp,this.clam],
                                                            y: {value:'-=35',ease:'Quad.easeOut'},
                                                            duration: 1500,
                                                            onComplete: () => {
                                                                this.evilshrimp.anims.play('evil-idle');
                                                                this.time.delayedCall(50, () => {
                                                                    this.evilshrimp.anims.play('evil-jump');
                                                                    this.tweens.add({
                                                                        targets: [this.evilshrimp,this.clam],
                                                                        y: {value:'-=35',ease:'Quad.easeOut'},
                                                                        duration: 1500,
                                                                        onComplete: () => {
                                                                            this.evilshrimp.visible = false;
                                                                            this.time.delayedCall(2000, () => {
                                                                                this.clam.body.x = this.clam.data.list.nextX;
                                                                                this.clam.x = this.clam.data.list.nextX+8;
                                                                                this.clam.body.y = this.clam.data.list.nextY-16;
                                                                                this.clam.y = this.clam.data.list.nextY-16;
                                                                                this.cutscene = false;
                                                                            });
                                                                        }
                                                                    });
                                                                    this.tweens.add({
                                                                        targets: this.sneakyMusic,
                                                                        volume: 0,
                                                                        duration: 3500,
                                                                        ease: 'Linear',
                                                                        onComplete: () => {
                                                                            this.sneakyMusic.stop();
                                                                        }
                                                                    });
                                                                });
                                                            }
                                                        });
                                                    });
                                                }
                                            });
                                        }
                                    }); 
                                });
                            }
                        });                
                    }
                });
            }
        });
    }
}