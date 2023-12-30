import { Const } from "../const/const";
import { LobbyInitData } from "../data/lobbyInitData";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: Const.SCENE_BOOT });
  }

  update(): void {
    let lobbyInitData: LobbyInitData = {
      score: 0,
    };
    this.scene.start(Const.SCENE_LOBBY, lobbyInitData);
  }
}
