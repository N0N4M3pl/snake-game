import { Const } from "../const/const";
import { LobbyInitData } from "../data/lobbyInitData";
import { Apple } from "../objects/apple";
import { Direction } from "../objects/snake/direction";
import { Snake } from "../objects/snake/snake";

export class GameScene extends Phaser.Scene {
  // field and game setting
  private _gameHeight: number;
  private _gameWidth: number;
  private _boardWidth: number;
  private _boardHeight: number;
  private _horizontalTiles: number;
  private _verticalTiles: number;
  private _tick: number;

  // objects
  private _player: Snake;
  private _apple: Apple;
  private _border: Phaser.GameObjects.Graphics[];

  // score
  private _score: number;

  // texts
  private _scoreText: Phaser.GameObjects.BitmapText;

  constructor() {
    super({ key: Const.SCENE_GAME });
  }

  init(): void {
    console.debug("GameScene | init");

    this._gameHeight = this.sys.canvas.height;
    this._gameWidth = this.sys.canvas.width;
    this._boardWidth = this._gameWidth - 2 * Const.TILE_SIZE;
    this._boardHeight = this._gameHeight - 2 * Const.TILE_SIZE;
    this._horizontalTiles = this._boardWidth / Const.TILE_SIZE;
    this._verticalTiles = this._boardHeight / Const.TILE_SIZE;
    this._tick = 0;

    this._score = 0;
  }

  create(): void {
    console.debug("GameScene | create");

    // border
    this._border = [];
    let x, y;
    y = (this._verticalTiles + 1) * Const.TILE_SIZE;
    for (let i = 0; i < this._horizontalTiles + 2; i++) {
      x = i * Const.TILE_SIZE;
      this._border.push(this.createBorderItem(x, 0, 0x61e85b, 0.3));
      this._border.push(this.createBorderItem(x, y, 0x61e85b, 0.3));
    }
    x = (this._horizontalTiles + 1) * Const.TILE_SIZE;
    for (let i = 0; i < this._verticalTiles; i++) {
      y = (i + 1) * Const.TILE_SIZE;
      this._border.push(this.createBorderItem(0, y, 0x61e85b, 0.3));
      this._border.push(this.createBorderItem(x, y, 0x61e85b, 0.3));
    }

    // player
    x = 2 * Const.TILE_SIZE;
    y = Math.floor(this._verticalTiles / 2) * Const.TILE_SIZE;
    this._player = new Snake(this, x, y, 1, Direction.RIGHT, 0x61e85b, {
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    });

    // apple
    this._apple = new Apple(this, {
      x: this.rndXPos(),
      y: this.rndYPos(),
      fillStyle: {
        color: 0x61e85b,
        alpha: 0.8,
      },
    });

    // score
    this._scoreText = this.add.bitmapText(this._gameWidth / 2, 1, Const.FONT_NAME, this._score.toString(), Const.TILE_SIZE);
  }

  private createBorderItem(x: number, y: number, color: number, alpha: number): Phaser.GameObjects.Graphics {
    return this.add.graphics({ x, y, fillStyle: { color, alpha } }).fillRect(0, 0, Const.TILE_SIZE, Const.TILE_SIZE);
  }

  update(time: number): void {
    if (this._tick === 0) {
      this._tick = time;
    }
    if (!this._player.isDead) {
      if (time - this._tick > 100) {
        this._player.move();
        this.checkCollision();
        this._tick = time;
      }
      this._player.handleInput();
    } else {
      let lobbyInitData: LobbyInitData = {
        score: this._score,
      };
      this.scene.start(Const.SCENE_LOBBY, lobbyInitData);
    }
  }

  private checkCollision(): void {
    const { x: headX, y: headY } = this._player.bodyHead;

    // border vs. snake collision
    if (headX < Const.TILE_SIZE || headX > this._boardWidth || headY < Const.TILE_SIZE || headY > this._boardHeight) {
      this._player.dead = true;
      return;
    }

    // snake vs. snake collision
    if (this._player.checkSnakeCollision(headX, headY, false)) {
      this._player.dead = true;
      return;
    }

    // player vs. apple collision
    if (headX === this._apple.x && headY === this._apple.y) {
      this._player.growSnake();
      this._score++;
      this._scoreText.setText(this._score.toString());
      this._apple.setPosition(this.rndXPos(), this.rndYPos());
    }
  }

  private rndXPos(): number {
    return Phaser.Math.RND.between(1, this._horizontalTiles) * Const.TILE_SIZE;
  }

  private rndYPos(): number {
    return Phaser.Math.RND.between(1, this._verticalTiles) * Const.TILE_SIZE;
  }
}
