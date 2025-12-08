export class Animator {

    constructor(scene, animationSpritesheet) {
        this.scene = scene;
        this.animationSpritesheet = animationSpritesheet;
    }

// Muy importante llamar a esta función en el preload de la escena
    preload(frameWidth, frameHeight) {
        this.scene.load.spritesheet(this.animationSpritesheet, 
            `assets/sprites/${this.animationSpritesheet}.png`, 
            { frameWidth: frameWidth, frameHeight: frameHeight });
    }

    createAnimation(key, startFrame, endFrame, frameRate, repeat = -1) {
        this.scene.anims.create({
            key: key,
            frames: this.scene.anims.generateFrameNumbers(this.animationSpritesheet, { start: startFrame, end: endFrame }),
            frameRate: frameRate,  // Poner mas o menos 16 o así
            repeat: repeat
        });
    }

    assignSpriteToPlayer(x, y) {
        return this.scene.physics.add.sprite(x, y, this.animationSpritesheet);
    }

    createSprite(x, y) {
        return this.scene.add.sprite(x, y, this.animationSpritesheet);
    }
    
}