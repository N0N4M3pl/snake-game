import { Const } from '../const/const';

export class Apple extends Phaser.GameObjects.Graphics {
  constructor(scene: Phaser.Scene, options: Phaser.Types.GameObjects.Graphics.Options) {
    super(scene, options);
    this.x = options.x;
    this.y = options.y;
    this.fillStyle(options.fillStyle?.color, options.fillStyle?.alpha);
    this.fillRect(
      0,
      0,
      Const.TILE_SIZE,
      Const.TILE_SIZE
    );
    this.scene.add.existing(this);
  }
}
