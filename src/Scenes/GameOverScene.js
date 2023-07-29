import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("game-over-scene");
  }

  init(data) {
    // initializing the score
    this.score = data.score;
  }

  preload() {
    // loading the images assets for the game over scene
    this.load.image("background", "images/background.png");
    this.load.image("gameover", "images/gameover.png");
    this.load.image("replay", "images/replay.png");
  }

  create() {
    // getting the half of the dimensions of the game screen
    const gameWidth = this.scale.width * 0.5;
    const gameHeight = this.scale.height * 0.5;

    // adding the night background
    this.add.image(gameWidth, gameHeight, "background");

    // adding the game over image
    this.add.image(gameWidth, gameHeight - 120, "gameover");

    // adding the replay button and making it clickable (interactive)
    this.replayButton = this.add
      .image(gameWidth, gameHeight + 120, "replay")
      .setInteractive();

    // once replay button is clicked, automatically switch to the main game scene
    this.replayButton.once(
      "pointerdown",
      () => {
        this.scene.start("ghost-buster-scene");
      },
      this
    );

    // specifying the style of the score to be displayed at the end
    const style = {
      fontSize: "60px",
      fill: "#00ff22",
      fontStyle: "bold",
    };

    // adding "Score" text
    this.add.text(gameWidth - 130, 230, "SCORE:", style);
    // adding score value
    this.add.text(gameWidth + 90, 230, this.score, style);
  }
}
