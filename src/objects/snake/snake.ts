import { Const } from "../../const/const";
import { Direction } from "./direction";
import { Keys, KeysConfiguration } from "./keys";

export class Snake {
  private _scene: Phaser.Scene;
  private _direction: Direction;
  private _color: number;
  private _keys: Keys;
  private _dead: boolean;
  private _body: Phaser.GameObjects.Graphics[];

  constructor(scene: Phaser.Scene, x: number, y: number, length: number, direction: Direction, color: number, keysConfiguration: KeysConfiguration) {
    // set variables
    this._scene = scene;
    this._direction = direction;
    this._color = color;
    this._keys = {
      up: this._scene.input.keyboard.addKey(keysConfiguration.up),
      down: this._scene.input.keyboard.addKey(keysConfiguration.down),
      left: this._scene.input.keyboard.addKey(keysConfiguration.left),
      right: this._scene.input.keyboard.addKey(keysConfiguration.right),
    };
    this._dead = false;
    this._body = [];

    // build snake
    this.buildSnake(x, y, length);
  }

  public get isDead(): boolean {
    return this._dead;
  }

  public set dead(value: boolean) {
    this._dead = value;
  }

  public get bodyLength(): number {
    return this._body.length;
  }
  
  public get bodyHead(): Phaser.GameObjects.Graphics {
    return this._body[0];
  }

  private buildSnake(x: number, y: number, length: number): void {
    length = Math.max(1, length);
    let currentAlpha = 0;
    for (let i = 0; i < length; i++) {
      if (i === 0) {
        currentAlpha = 1;
      } else {
        currentAlpha = 0.8;
      }
      this._body.push(this.createBodyItem(x, y, this._color, currentAlpha));
    }
  }

  private createBodyItem(x: number, y: number, color: number, alpha: number): Phaser.GameObjects.Graphics {
    return this._scene.add.graphics({ x, y, fillStyle: { color, alpha } }).fillRect(0, 0, Const.TILE_SIZE, Const.TILE_SIZE);
  }

  public growSnake(): void {
    let bodyLast = this._body[this.bodyLength - 1];
    this._body.push(this.createBodyItem(bodyLast.x, bodyLast.y, this._color, 0.8));
  }

  public handleInput(): void {
    if (this._keys.up.isDown && this._direction != Direction.DOWN) {
      this._direction = Direction.UP;
    } else if (this._keys.down.isDown && this._direction != Direction.UP) {
      this._direction = Direction.DOWN;
    } else if (this._keys.right.isDown && this._direction != Direction.LEFT) {
      this._direction = Direction.RIGHT;
    } else if (this._keys.left.isDown && this._direction != Direction.RIGHT) {
      this._direction = Direction.LEFT;
    }
  }

  public move(): void {
    // move body
    for (let i = this.bodyLength - 1; i > 0; i--) {
      this._body[i].x = this._body[i - 1].x;
      this._body[i].y = this._body[i - 1].y;
    }

    // move head
    if (this._direction == Direction.LEFT) {
      this.bodyHead.x -= Const.TILE_SIZE;
    } else if (this._direction == Direction.RIGHT) {
      this.bodyHead.x += Const.TILE_SIZE;
    } else if (this._direction == Direction.UP) {
      this.bodyHead.y -= Const.TILE_SIZE;
    } else if (this._direction == Direction.DOWN) {
      this.bodyHead.y += Const.TILE_SIZE;
    }
  }

  public checkSnakeCollision(x: number, y: number, checkWithHead: boolean): boolean {
    let limit = 1;
    if (checkWithHead) {
      limit = 0;
    }
    for (let i = this.bodyLength - 1; i >= limit; i--) {
      if (x === this._body[i].x && y === this._body[i].y) {
        return true;
      }
    }
    return false;
  }
}
