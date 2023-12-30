import { Const } from "../const/const";
import { LobbyInitData } from "../data/lobbyInitData";

export class LobbyScene extends Phaser.Scene {
  private _startAKey: Phaser.Input.Keyboard.Key;
  private _startBKey: Phaser.Input.Keyboard.Key;
  private _titleBitmapText: Phaser.GameObjects.BitmapText;
  private _startABitmapText: Phaser.GameObjects.BitmapText;
  private _startBBitmapText: Phaser.GameObjects.BitmapText;
  private _winnerBitmapText: Phaser.GameObjects.BitmapText;
  private _highscoreBitmapText: Phaser.GameObjects.BitmapText;

  private _winnerText: string = "";
  private _scoreText: string = "";
  private _highscore: number = 0;
  private _highscoreText: string = "";

  private _isReadyA: boolean;
  private _isReadyB: boolean;

  constructor() {
    super({ key: Const.SCENE_LOBBY });
  }

  init(data: LobbyInitData): void {
    this._startAKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this._startBKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);

    if (data.scoreA > data.scoreB) {
      this._winnerText = "Player A wins";
      if (data.scoreA > this._highscore) {
        this._highscore = data.scoreA;
        this._highscoreText = "HIGHSCORE: " + this._highscore + "\nby Player A";
      }
    } else if (data.scoreA < data.scoreB) {
      this._winnerText = "Player B wins";
      if (data.scoreB > this._highscore) {
        this._highscore = data.scoreB;
        this._highscoreText = "HIGHSCORE: " + this._highscore + "\nby Player B";
      }
    } else if (data.scoreA != 0) {
      this._winnerText = "Draw";
      if (data.scoreA > this._highscore) {
        this._highscore = data.scoreA;
        this._highscoreText = "HIGHSCORE: " + this._highscore + "\nby draw";
      }
    } else {
      this._winnerText = "";
    }

    this._isReadyA = false;
    this._isReadyB = false;
  }

  preload(): void {
    this.load.bitmapFont(Const.FONT_NAME, "./assets/font/snakeFont.png", "./assets/font/snakeFont.fnt");
  }

  create(): void {
    let canvasWidth: number = this.sys.canvas.width;
    let canvasHeight: number = this.sys.canvas.height;
    let textSize: Phaser.Types.GameObjects.BitmapText.LocalBitmapTextSize;

    this._titleBitmapText = this.add.bitmapText(0, 0, Const.FONT_NAME, "S N A K E", 16);
    textSize = this._titleBitmapText.getTextBounds().local;
    this._titleBitmapText.x = canvasWidth * 0.5 - textSize.width * 0.5;
    this._titleBitmapText.y = canvasHeight * 0.5 - 32 - 16;

    this._startABitmapText = this.add.bitmapText(0, 0, Const.FONT_NAME, "Press A", 8).setLineSpacing(16).setCenterAlign();
    textSize = this._startABitmapText.getTextBounds().local;
    this._startABitmapText.x = canvasWidth * 0.25 - textSize.width * 0.5;
    this._startABitmapText.y = canvasHeight * 0.5;

    this._startBBitmapText = this.add.bitmapText(0, 0, Const.FONT_NAME, "Press B", 8).setLineSpacing(16).setCenterAlign();
    textSize = this._startBBitmapText.getTextBounds().local;
    this._startBBitmapText.x = canvasWidth * 0.75 - textSize.width * 0.5;
    this._startBBitmapText.y = canvasHeight * 0.5;

    this._winnerBitmapText = this.add.bitmapText(0, 0, Const.FONT_NAME, this._winnerText, 8);
    textSize = this._winnerBitmapText.getTextBounds().local;
    this._winnerBitmapText.x = canvasWidth * 0.5 - textSize.width * 0.5;
    this._winnerBitmapText.y = canvasHeight * 0.5 + 40;

    this._highscoreBitmapText = this.add.bitmapText(0, 0, Const.FONT_NAME, this._highscoreText, 8).setLineSpacing(16).setCenterAlign();
    textSize = this._highscoreBitmapText.getTextBounds().local;
    this._highscoreBitmapText.x = canvasWidth * 0.5 - textSize.width * 0.5;
    this._highscoreBitmapText.y = canvasHeight * 0.5 + 64;
  }

  update(): void {
    if (this._startAKey.isDown) {
      this._isReadyA = true;
      this._startABitmapText.text = "Player A\nis ready";
    }
    if (this._startBKey.isDown) {
      this._isReadyB = true;
      this._startBBitmapText.text = "Player B\nis ready";
    }
    if (this._isReadyA && this._isReadyB) {
      this.scene.start(Const.SCENE_GAME);
    }
  }
}
