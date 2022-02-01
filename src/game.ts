type Position = {
  x: number,
  y: number
}

type Speed = {
  x: number,
  y: number
}

const WIN_SCORE = 5;

const BAR_DIMENSION = {
  width: window.innerWidth / 70,
  height: window.innerHeight / 5
}

const BALL_RADIUS = window.innerWidth / 60;

const BORDER = {
  top: 0,
  right: window.innerWidth,
  bottom: window.innerHeight,
  left: 0,
}

const LEFT_BAR_POSITION = {
  x: 0,
  y: window.innerHeight / 2 - BAR_DIMENSION.height / 2
}

const RIGHT_BAR_POSITION = {
  x: window.innerWidth - BAR_DIMENSION.width,
  y: window.innerHeight / 2 - BAR_DIMENSION.height / 2
}

const BALL_POSITION = {
  x: window.innerWidth / 2 - BALL_RADIUS / 2,
  y: window.innerHeight / 2 - BALL_RADIUS / 2
}

const BALL_SPEED = {
  x: 5,
  y: 5
}

let previous_ball_pos = {
  x: BALL_POSITION.x,
  y: BALL_POSITION.y,
}

class Player {
  speed: number;
  bar: HTMLElement;
  score: number = 0;
  score_element: HTMLElement;
  position: Position;
  draw;
  paddleUp;
  paddleDown;

  constructor(speed: number, bar: HTMLElement, position: Position, score_element: HTMLElement) {
    this.speed = speed;
    this.bar = bar;
    this.position = position;
    this.score_element = score_element;

    this.draw = () => {
      bar.style.top = this.position.y + 'px';
      bar.style.left = this.position.x + 'px';
      this.score_element.innerHTML = this.score.toString();
    }

    this.paddleUp = () => {
      if (position.y >= BORDER.top) {
        position.y -= this.speed;
        this.draw();
      }
    }

    this.paddleDown = () => {
      if (position.y <= BORDER.bottom - BAR_DIMENSION.height) {
        position.y += this.speed;
        this.draw();
      }
    }


  }
}

class AI extends Player {
  ball_position: Position;
  predict_position;

  constructor(speed: number, bar: HTMLElement, position: Position, score_element: HTMLElement, ball_position: Position) {
    super(speed, bar, position, score_element);
    this.ball_position = ball_position;

    this.predict_position = () => {
      if (previous_ball_pos.x - ball_position.x < 0) {

        if (this.ball_position.y + BALL_RADIUS > this.position.y + BAR_DIMENSION.height + 20 && this.position.y <= BORDER.bottom - BAR_DIMENSION.height) {
          this.position.y += this.speed;
        } else if (this.ball_position.y - BALL_RADIUS < this.position.y + BAR_DIMENSION.height + 20 && this.position.y >= BORDER.top) {
          this.position.y -= this.speed;
        }

      }

      this.draw();
      previous_ball_pos.x = ball_position.x;
    }
  }

}

class Ball {
  speed: Speed = {
    x: BALL_SPEED.x,
    y: BALL_SPEED.y
  };
  position: Position = {
    x: window.innerWidth / 2 - BALL_RADIUS / 2,
    y: window.innerHeight / 2 - BALL_RADIUS / 2,
  }
  draw;
  reset_position;
  reset_speed;
  ball: HTMLElement;
  move;

  constructor(ball: HTMLElement) {
    this.ball = ball;


    this.draw = () => {
      ball.style.top = this.position.y + 'px';
      ball.style.left = this.position.x + 'px';
    }

    this.reset_position = (position: Position) => {
      this.position.x = position.x;
      this.position.y = position.y;
    }

    this.reset_speed = (speed: Speed) => {
      this.speed.x = speed.x;
      this.speed.y = speed.y;
    }

    this.move = () => {
      this.position.x += this.speed.x;
      this.position.y += this.speed.y;
    }
  }
}


class Collision {
  ballPaddleCollision;
  ballBorderCollision;
  ball: Ball;
  left_player: Player;
  right_player: Player;
  addBallCollisionToPaddle;

  constructor(ball: Ball, left_player: Player, right_player: Player) {
    this.ball = ball;
    this.left_player = left_player;
    this.right_player = right_player;

    this.addBallCollisionToPaddle = (player: Player) => {
      if (ball.position.y >= player.position.y && ball.position.y < (player.position.y + (BAR_DIMENSION.height / 5))) {
        if (ball.speed.y <= 0) {
          ball.speed.y = BALL_SPEED.y;
        }
        ball.speed.x *= -1;
        ball.speed.y  = -(Math.random() *  BALL_SPEED.y + 2);
        console.log("TOP");
      }

      if (ball.position.y >= (player.position.y + (BAR_DIMENSION.height / 5)) && ball.position.y <= (player.position.y + (BAR_DIMENSION.height * 2 / 5))) {
        ball.speed.y = 0;
        ball.speed.x *= -1;
        console.log("MIDDLE");
      }

      if (ball.position.y > (player.position.y + (BAR_DIMENSION.height * 2 / 5)) && ball.position.y <= (player.position.y + BAR_DIMENSION.height)) {
        if (ball.speed.y <= 0) {
          ball.speed.y = BALL_SPEED.y;
        }
        ball.speed.x *= -1;
        ball.speed.y  = Math.random() *  BALL_SPEED.y + 2;
        console.log("BOTTOM");
      }

    }

    this.ballPaddleCollision = () => {
      if (ball.position.x <= (left_player.position.x + BAR_DIMENSION.width) + BALL_RADIUS / 2) {
        this.addBallCollisionToPaddle(left_player);
      }

      if (ball.position.x >= (right_player.position.x - BAR_DIMENSION.width) - BALL_RADIUS / 2) {
        if (ball.position.y >= right_player.position.y && ball.position.y <= right_player.position.y + BAR_DIMENSION.height) {
          this.addBallCollisionToPaddle(right_player);
        }
      }
    }

    this.ballBorderCollision = () => {
      if (ball.position.y < BORDER.top || ball.position.y >= BORDER.bottom - BALL_RADIUS) {
        ball.speed.y *= -1;
      }

      if (ball.position.x < BORDER.left) {
        right_player.score += 1;
        ball.reset_position(BALL_POSITION);
        ball.reset_speed({x: -ball.speed.x, y: BALL_SPEED.y});
      }

      if (ball.position.x > BORDER.right) {
        left_player.score += 1;
        ball.reset_position(BALL_POSITION);
        ball.reset_speed({x: -ball.speed.x, y: BALL_SPEED.y});
      }

    }
  }

}


class Game {
  left_bar = document.getElementById('left_bar')!;
  right_bar = document.getElementById('right_bar')!;
  left_bar_score = document.getElementById('left_bar_score')!;
  right_bar_score = document.getElementById('right_bar_score')!;
  ball = document.getElementById('ball')!;
  playerMode: string;
  check_score;

  start;
  update;
  controller: any;
  executePress;

  constructor() {

    this.controller = {
      87: { pressed: false, func: undefined },
      83: { pressed: false, func: undefined },
      38: { pressed: false, func: undefined },
      40: { pressed: false, func: undefined },
    }

    this.executePress = () => {
      Object.keys(this.controller).forEach(key => {
        this.controller[key].pressed && this.controller[key].func();
      })
    }

    this.left_bar.style.width = BAR_DIMENSION.width + 'px';
    this.left_bar.style.height = BAR_DIMENSION.height + 'px';

    this.right_bar.style.width = BAR_DIMENSION.width + 'px';
    this.right_bar.style.height = BAR_DIMENSION.height + 'px';

    this.ball.style.width = BALL_RADIUS + 'px';
    this.ball.style.height = BALL_RADIUS + 'px';

    this.playerMode = sessionStorage.getItem('playerMode')!;

    let ball = new Ball(this.ball);
    let left_player: any, right_player: any;
    switch (this.playerMode) {
      case 'onePlayer':
        left_player = new Player(5, this.left_bar, LEFT_BAR_POSITION, this.left_bar_score);
        right_player = new AI(5, this.right_bar, RIGHT_BAR_POSITION, this.right_bar_score, ball.position);

        this.controller[87] = { pressed: false, func: left_player.paddleUp };
        this.controller[83] = { pressed: false, func: left_player.paddleDown };

        break;
      case 'twoPlayer':
        left_player = new Player(5, this.left_bar, LEFT_BAR_POSITION, this.left_bar_score);
        right_player = new Player(5, this.right_bar, RIGHT_BAR_POSITION, this.right_bar_score);

        this.controller[87] = { pressed: false, func: left_player.paddleUp };
        this.controller[83] = { pressed: false, func: left_player.paddleDown };
        this.controller[38] = { pressed: false, func: right_player.paddleUp };
        this.controller[40] = { pressed: false, func: right_player.paddleDown };

        break;
      case 'noPlayer':
        left_player = new AI(5, this.left_bar, LEFT_BAR_POSITION, this.left_bar_score, ball.position);
        right_player = new AI(5, this.right_bar, RIGHT_BAR_POSITION, this.right_bar_score, ball.position);
        break;
      default:
        left_player = new Player(10, this.left_bar, LEFT_BAR_POSITION, this.left_bar_score);
        right_player = new Player(10, this.right_bar, RIGHT_BAR_POSITION, this.right_bar_score);
        break;
    }

    this.check_score = () => {
      if (left_player.score >= WIN_SCORE) {
        alert("Left Player Wins");
        ball.reset_position(BALL_POSITION);
        left_player.score = 0;
        right_player.score = 0;
      }
      if (right_player.score >= WIN_SCORE) {
        alert("Right Player Wins");
        ball.reset_position(BALL_POSITION);
        left_player.score = 0;
        right_player.score = 0;
      }
    }

    let collision = new Collision(ball, left_player, right_player);


    document.addEventListener("keydown", (e) => {
      if (this.controller[e.keyCode]) {
        this.controller[e.keyCode].pressed = true;
      }
    })

    document.addEventListener("keyup", (e) => {
      if (this.controller[e.keyCode]) {
        this.controller[e.keyCode].pressed = false;
      }
    })


    this.start = () => {
      requestAnimationFrame(this.update);
    }
    this.update = (timestamp: number) => {
      const perfectFrameTime = 1000 / 60;
      let deltaTime = 0;
      let lastTimestamp = 0;
      requestAnimationFrame(this.update);

      deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
      lastTimestamp = timestamp;

      // Collision, drawing, and ball movment needed invariably.
      collision.ballBorderCollision();
      collision.ballPaddleCollision();
      ball.move();
      ball.draw();
      left_player.draw();
      right_player.draw();
      // Movement calculation needed depending on the player type(AI, Player)
      switch (this.playerMode) {
        case 'onePlayer':
          right_player.predict_position();
          break;
        case 'twoPlayer':
          break;
        case 'noPlayer':
          left_player.predict_position();
          right_player.predict_position();
          break;
        default:
          right_player.predict_position();
          break;
      }

      this.executePress();
      // Check score on every frame.
      this.check_score();
    }
  }

}

new Game().start();

