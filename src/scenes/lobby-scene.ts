import { Const } from "../const/const";
import { LobbyInitData } from "../data/lobbyInitData";

export class LobbyScene extends Phaser.Scene {
  private _startKey: Phaser.Input.Keyboard.Key;
  private _bitmapTexts: Phaser.GameObjects.BitmapText[] = [];

  private _highscore: number = 0;

  constructor() {
    super({ key: Const.SCENE_LOBBY });
  }

  init(data: LobbyInitData): void {
    console.debug("MainMenuScene | init");

    this._startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

    if (data.score > this._highscore) {
      this._highscore = data.score;
    }
  }

  preload(): void {
    console.debug("MainMenuScene | preload");

    this.load.bitmapFont(Const.FONT_NAME, "./assets/font/snakeFont.png", "./assets/font/snakeFont.fnt");
  }

  create(): void {
    console.debug("MainMenuScene | create");

    this._bitmapTexts.push(this.add.bitmapText(this.sys.canvas.width / 2 - 28, this.sys.canvas.height / 2 - 10, Const.FONT_NAME, "S: PLAY", 8));

    this._bitmapTexts.push(this.add.bitmapText(this.sys.canvas.width / 2 - 70, this.sys.canvas.height / 2 - 60, Const.FONT_NAME, "S N A K E", 16));

    this._bitmapTexts.push(
      this.add.bitmapText(this.sys.canvas.width / 2 - 45, this.sys.canvas.height / 2 + 30, Const.FONT_NAME, "HIGHSCORE: " + this._highscore, 8)
    );
  }

  update(): void {
    if (this._startKey.isDown) {
      this.scene.start(Const.SCENE_GAME);
    }
  }
}
