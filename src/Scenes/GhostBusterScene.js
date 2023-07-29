import Phaser from "phaser";

// importing classes from the "ui" folder
import Bomb from "../ui/Bomb.js";
import Ghost from "../ui/Ghost.js";
import ScoreLabel from "../ui/ScoreLabel.js";

export default class GhostBusterScene extends Phaser.Scene {
  constructor() {
    super("ghost-buster-scene");
  }

  init() {
    this.ground = undefined;
    this.player = undefined;
    this.cursors = undefined;
    this.speed = 100;
    this.bomb = undefined;
    this.lastFired = 0;
    this.ghost = undefined;
    this.ghostSpeed = 90;
  }

  preload() {
    this.load.image("background", "images/background.png");
    this.load.image("bomb", "images/bomb.png");
    this.load.image("ghost", "images/ghost.png");
    this.load.image("ground", "images/ground.png");
    this.load.spritesheet("player", "images/player.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    const gameWidth = this.scale.width * 0.5;
    const gameHeight = this.scale.height * 0.5;
    this.add.image(gameWidth, gameHeight, "background");

    this.ground = this.physics.add.staticGroup();
    this.ground.create(100, 490, "ground").setScale(2).refreshBody();

    this.player = this.physics.add.sprite(
      this.scale.width * 0.5,
      450,
      "player"
    );
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 3,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "front",
      frames: this.anims.generateFrameNumbers("player", {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 6,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.bomb = this.physics.add.group({
      classType: Bomb,
      runChildUpdate: true,
    });

    this.ghost = this.physics.add.group({
      classType: Ghost,
      maxSize: 10,
      runChildUpdate: true,
    });

    this.time.addEvent({
      delay: 1000,
      callback: this.spawnGhost,
      callbackScope: this,
      loop: true,
    });

    this.scoreLabel = this.createScoreLabel(320, 16, 0);

    this.physics.add.collider(this.player, this.ground);

    this.physics.add.overlap(this.bomb, this.ghost, this.hitGhost, null, this);

    this.physics.add.overlap(
      this.player,
      this.ghost,
      this.touchGhost,
      null,
      this
    );
  }

  update(time) {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(this.speed * -1);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(this.speed);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0); //stop
      this.player.anims.play("front");
    }

    if (this.cursors.space.isDown && time > this.lastFired) {
      const bomb = this.bomb.get(0, 0, "bomb");

      if (bomb) {
        bomb.fire(this.player.x, this.player.y);
        this.lastFired = time + 150;
      }
    }
  }

  spawnGhost() {
    const config = {
      speed: this.ghostSpeed,
    };

    const ghost = this.ghost.get(0, 0, "ghost", config);
    const ghostWidth = ghost.displayWidth;
    const positionX = Phaser.Math.Between(
      ghostWidth,
      this.scale.width - ghostWidth
    );
    if (ghost) {
      ghost.spawn(positionX);
    }
  }

  hitGhost(bomb, ghost) {
    bomb.erase();
    ghost.die();

    this.scoreLabel.add(8);
  }

  createScoreLabel(x, y, score) {
    const style = {
      fontSize: "32px",
      fill: "#00ff22",
      fontStyle: "bold",
    };
    const label = new ScoreLabel(this, x, y, score, style).setDepth(1);
    this.add.existing(label);
    return label;
  }

  touchGhost() {
    this.scene.start("game-over-scene", {
      score: this.scoreLabel.getScore(),
    });
  }
}
