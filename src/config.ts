import { BootScene } from './scenes/boot-scene';
import { GameScene } from './scenes/game-scene';
import { LobbyScene } from './scenes/lobby-scene';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Snake',
  // url: 'https://github.com/digitsensitive/phaser3-typescript',
  version: '2.0',
  width: 256,
  height: 256,
  zoom: 3,
  type: Phaser.AUTO,
  parent: 'game',
  scene: [BootScene, LobbyScene, GameScene],
  input: {
    keyboard: true,
    mouse: false,
    touch: false,
    gamepad: false
  },
  backgroundColor: '#000000',
  render: { pixelArt: true, antialias: false }
};
