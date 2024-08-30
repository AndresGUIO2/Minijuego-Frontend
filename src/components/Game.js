import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import NetworkManager from '../services/NetworkManager';
import Player from '../game/Player';
import Bullet from '../game/Bullet';

const Game = () => {
    const gameRef = useRef(null);
    const networkManagerRef = useRef(null);
    const playerIdRef = useRef(null);

    useEffect(() => {
        networkManagerRef.current = new NetworkManager();
        
        const handleInit = (playerId) => {
            if (playerId) {
                console.log('Player ID from NetworkManager:', playerId);
                playerIdRef.current = playerId;
            }
        };

        networkManagerRef.current.oninit = handleInit;

        const config = {
            type: Phaser.AUTO,
            width: 960,
            height: 600,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false,
                },
            },
            scene: {
                preload,
                create,
                update,
            },
        };

        const game = new Phaser.Game(config);
        gameRef.current = game;

        function preload() {
            this.load.image('ship', 'assets/ship.png');
            this.load.image('bullet', 'assets/bullet.png');
            this.load.image('background', 'assets/background.png');
        }

        function create() {
          const canvasWidth = this.cameras.main.width;
          const canvasHeight = this.cameras.main.height;

            this.add.image(640, 360, 'background').
            setDisplaySize(960, 600).
            setOrigin(0.667, 0.6);

            this.players = {};
            this.bullets = new Bullet(this, 'bullet');

            networkManagerRef.current.onupdate = (state) => {
                if (playerIdRef.current) {
                    console.log("Game state update:", state.players);
                    for (const playerId in state.players) {
                        if (!this.players[playerId]) {
                            this.players[playerId] = new Player(this, 'ship', playerId);
                        }
                        this.players[playerId].updateFromServer(state.players[playerId], playerIdRef);
                    }

                    this.bullets.updateFromServer(state.bullets);
                } else {
                    console.warn('Player ID not available yet');
                }
            };

            this.input.on('pointerdown', (pointer) => {
                const localPlayer = this.players[playerIdRef.current];
                if (localPlayer) {
                    const bullet = this.bullets.createBullet(
                        localPlayer.sprite.x,
                        localPlayer.sprite.y,
                        pointer.x,
                        pointer.y
                    );
                    networkManagerRef.current.send('shoot', {
                        bullet_position: { x: bullet.x, y: bullet.y },
                    });
                } else {
                    console.warn('Local player not initialized or missing sprite.');
                }
            });
        }

        function update() {
            const localPlayer = this.players[playerIdRef.current];
            if (localPlayer) {
                localPlayer.update();
                const { x, y } = localPlayer.sprite;
                networkManagerRef.current.send('move', { x, y });
            }

            this.bullets.update();
        }

        return () => {
            if (networkManagerRef.current) {
                networkManagerRef.current.close();
            }
            game.destroy(true);
        };
    }, []);

    return <div id="game-container"></div>;
};

export default Game;
