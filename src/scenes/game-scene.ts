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
  private _playerA: Snake;
  private _playerB: Snake;
  private _apple: Apple;
  private _border: Phaser.GameObjects.Graphics[];

  // score
  private _scoreA: number;
  private _scoreB: number;
  private _scoreAText: Phaser.GameObjects.BitmapText;
  private _scoreBText: Phaser.GameObjects.BitmapText;

  constructor() {
    super({ key: Const.SCENE_GAME });
  }

  init(): void {
    this._gameHeight = this.sys.canvas.height;
    this._gameWidth = this.sys.canvas.width;
    this._boardWidth = this._gameWidth - 2 * Const.TILE_SIZE;
    this._boardHeight = this._gameHeight - 2 * Const.TILE_SIZE;
    this._horizontalTiles = this._boardWidth / Const.TILE_SIZE;
    this._verticalTiles = this._boardHeight / Const.TILE_SIZE;
    this._tick = 0;

    this._scoreA = 0;
    this._scoreB = 0;
  }

  create(): void {
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

    // players
    x = 2 * Const.TILE_SIZE;
    y = Math.floor(this._verticalTiles / 2) * Const.TILE_SIZE;
    this._playerA = new Snake(this, x, y, 1, Direction.RIGHT, 0x61e85b, {
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    });
    x = (this._horizontalTiles - 2) * Const.TILE_SIZE;
    this._playerB = new Snake(this, x, y, 1, Direction.LEFT, 0x61e85b, {
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
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
    this._scoreAText = this.add.bitmapText(this._gameWidth * 0.25, 1, Const.FONT_NAME, this._scoreA.toString(), Const.TILE_SIZE);
    this._scoreBText = this.add.bitmapText(this._gameWidth * 0.75, 1, Const.FONT_NAME, this._scoreB.toString(), Const.TILE_SIZE);
  }

  private createBorderItem(x: number, y: number, color: number, alpha: number): Phaser.GameObjects.Graphics {
    return this.add.graphics({ x, y, fillStyle: { color, alpha } }).fillRect(0, 0, Const.TILE_SIZE, Const.TILE_SIZE);
  }

  update(time: number): void {
    if (this._tick === 0) {
      this._tick = time;
    }
    if (!this._playerA.isDead && !this._playerB.isDead) {
      if (time - this._tick > 100) {
        this._playerA.move();
        this._playerB.move();
        this.checkCollision();
        this._tick = time;
      }
      this._playerA.handleInput();
      this._playerB.handleInput();
    } else {
      let lobbyInitData: LobbyInitData = {
        scoreA: this._scoreA,
        scoreB: this._scoreB,
      };
      this.scene.start(Const.SCENE_LOBBY, lobbyInitData);
    }
  }

  private checkCollision(): void {
    const { x: headAX, y: headAY } = this._playerA.bodyHead;
    const { x: headBX, y: headBY } = this._playerB.bodyHead;

    // border vs. snake collision
    if (headAX < Const.TILE_SIZE || headAX > this._boardWidth || headAY < Const.TILE_SIZE || headAY > this._boardHeight) {
      this._playerA.dead = true;
    }
    if (headBX < Const.TILE_SIZE || headBX > this._boardWidth || headBY < Const.TILE_SIZE || headBY > this._boardHeight) {
      this._playerB.dead = true;
    }

    // snake vs. snake collision
    if (this._playerA.checkSnakeCollision(headAX, headAY, false)) {
      this._playerA.dead = true;
    }
    if (this._playerB.checkSnakeCollision(headBX, headBY, false)) {
      this._playerB.dead = true;
    }

    // player vs. apple collision
    let appleIsEaten: boolean = false;
    if (headAX === this._apple.x && headAY === this._apple.y) {
      this._playerA.growSnake();
      this._scoreA++;
      this._scoreAText.setText(this._scoreA.toString());
      appleIsEaten = true;
    }
    if (headBX === this._apple.x && headBY === this._apple.y) {
      this._playerB.growSnake();
      this._scoreB++;
      this._scoreBText.setText(this._scoreB.toString());
      appleIsEaten = true;
    }
    if (appleIsEaten) {
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
