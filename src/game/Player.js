class Player {
    constructor(scene, spriteKey, playerId) {
        this.sprite = scene.physics.add.sprite(128, 128, spriteKey);
        this.sprite.setSize(128, 128);
        this.sprite.setOffset(0, 0);
        this.sprite.playerId = playerId;
        this.cursors = {
            up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        };
    }

    update() {
        if (this.cursors.left.isDown) {
            this.sprite.setVelocityX(-300);
        } else if (this.cursors.right.isDown) {
            this.sprite.setVelocityX(300);
        } else {
            this.sprite.setVelocityX(0);
        }

        if (this.cursors.up.isDown) {
            this.sprite.setVelocityY(-300);
        } else if (this.cursors.down.isDown) {
            this.sprite.setVelocityY(300);
        } else {
            this.sprite.setVelocityY(0);
        }
    }

    updateFromServer(playerData, myId) {
        console.log(myId.current)
        console.log(this.sprite.playerId !== myId.current)
        if (this.sprite.playerId !== myId.current){

            this.sprite.setPosition(playerData.x, playerData.y);
        }
    }
}

export default Player;
