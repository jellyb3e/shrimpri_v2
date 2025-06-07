class Fish extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, data, speed) {
        super(scene, x, y, texture, frame, data);
        this.speed = speed;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.minX = x;
        this.maxX = x + data[0].value;  //maxXOffset is data[0]
        this.prevX = x;
        this.body.setVelocityX(this.speed);
    }

    update() {
        let deltaX = this.x - this.prevX;

        if (this.x <= this.minX) {
            this.setFlipX(false);
            this.body.setVelocityX(this.speed);
        } else if (this.x >= this.maxX) {
            this.setFlipX(true);
            this.body.setVelocityX(-this.speed);
        }
        this.prevX = this.x;

        return deltaX;
    }
}

class BurstFish extends Fish {
    constructor(scene, x, y, texture, frame, data, speed, chargeAnim, burstAnim) {
        super(scene, x, y, texture, frame, data, speed);
        this.chargeAnim = chargeAnim;
        this.burstAnim = burstAnim;

        this.charging = true;
        this.burst = false;
        this.dir = 1;
    }
    update() {
        let deltaX = this.x - this.prevX;

        if (this.charging) {
            this.body.setVelocityX(0);
            this.anims.play(this.chargeAnim,true);
            this.scene.time.delayedCall(500, () => {
                this.charging = false;
                this.burst = true;
            });
        } else if (this.burst) {
            this.body.setVelocityX(this.speed*this.dir);
            this.anims.play(this.burstAnim,true);
            if (this.x <= this.minX) {
                this.dir = 1;
                this.setFlipX(false);
                this.charging = true;
                this.burst = false;
            } else if (this.x >= this.maxX) {
                this.dir = -1
                this.setFlipX(true);
                this.charging = true;
                this.burst = false;
            }
        }
        this.prevX = this.x;

        return deltaX;
    }
}

class JellyPink extends BurstFish {
    constructor(scene, x, y, data) {
        super(scene, x, y, 'jelly_tiles', 0, data, 20, 'jellypink-charge', 'jellypink-swim');
        this.body.setSize(16, 5);
        this.body.setOffset(8, 4);
    }
}
class JellyBlue extends BurstFish {
    constructor(scene, x, y, data) {
        super(scene, x, y, 'jelly_tiles', 4, data, 20, 'jellyblue-charge', 'jellyblue-swim');
        this.body.setSize(16, 5);
        this.body.setOffset(8, 4);
    }
}
class SquidRed extends BurstFish {
    constructor(scene, x, y, data) {
        super(scene, x, y, 'squid_tiles', 0, data, 20, 'squidred-charge', 'squidred-swim');
        this.body.setSize(16, 5);
        this.body.setOffset(8, 5);
    }
}
class SquidPink extends BurstFish {
    constructor(scene, x, y, data) {
        super(scene, x, y, 'squid_tiles', 4, data, 20, 'squidpink-charge', 'squidpink-swim');
        this.body.setSize(16, 5);
        this.body.setOffset(8, 5);
    }
}

class Angler extends Fish {
    constructor(scene, x, y, data) {
        super(scene, x, y, 'angler_tiles', 0, data, 16);
        this.anims.play('angler-swim');
        this.body.setSize(20, 5);
        this.body.setOffset(6, 13);
    }
}
class SwordFish extends Fish {
    constructor(scene, x, y, data) {
        super(scene, x, y, 'sword_tiles', 0, data, 16);
        this.anims.play('sword-swim');
        this.body.setSize(30, 5);
        this.body.setOffset(10, 13);
    }
}
class GreyFish extends Fish {
    constructor(scene, x, y, data) {
        super(scene, x, y, 'fish_tiles', 0, data, 16);
        this.anims.play('fish-swim');
        this.body.setSize(16, 5);
        this.body.setOffset(8, 5);
    }
}