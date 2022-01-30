type Position = {
  x: number,
  y: number
}

type Speed = {
  x: number,
  y: number
}

const barDimension = {
  width: window.innerWidth / 40,
  height: window.innerHeight / 5
}

const ballRadius = 40;

const border = {
  top: 0,
  right: window.innerWidth,
  bottom: window.innerHeight,
  left: 0,
}

const left_bar_position = {
  x: 0,
  y: window.innerHeight / 2 - barDimension.height / 2
}

const right_bar_position = {
  x: window.innerWidth - barDimension.width,
  y: window.innerHeight / 2 - barDimension.height / 2
}

const ball_position = {
  x: window.innerWidth / 2 - ballRadius / 2,
  y: window.innerHeight / 2 - ballRadius / 2
}

const ball_speed = {
  x: -10,
  y: 0
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
      if (position.y >= border.top) {
        position.y -= this.speed;
        this.draw();
      }
    }

    this.paddleDown = () => {
      if (position.y <= border.bottom - barDimension.height) {
        position.y += this.speed;
        this.draw();
      }
    }


  }
}

class AI extends Player {
  ball_position: Position;
  calculate_postion;

  constructor(speed: number, bar: HTMLElement, position: Position, score_element: HTMLElement, ball_position: Position) {
    super(speed, bar, position, score_element);
    this.ball_position = ball_position;

    this.calculate_postion = () => {
      if (this.ball_position.y + ballRadius > this.position.y + barDimension.height && this.position.y <= border.bottom - barDimension.height) {
        this.position.y += this.speed;
      } else if (this.ball_position.y - ballRadius < this.position.y + barDimension.height && this.position.y >= border.top) {
        this.position.y -= this.speed;
      }

      this.draw();
    }
  }

}

class Ball {
  speed: Speed = {
    x: 10,
    y: 10
  };
  position: Position = {
    x: window.innerWidth / 2 - ballRadius / 2,
    y: window.innerHeight / 2 - ballRadius / 2,
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

  constructor(ball: Ball, left_player: Player, right_player: Player) {
    this.ball = ball;
    this.left_player = left_player;
    this.right_player = right_player;

    this.ballPaddleCollision = () => {
      if (ball.position.x <= (left_player.position.x + barDimension.width) + ballRadius / 2) {
        if (ball.position.y >= left_player.position.y && ball.position.y <= left_player.position.y + barDimension.height) {
          ball.speed.x *= -1;
        }
      }

      if (ball.position.x >= (right_player.position.x - barDimension.width) - ballRadius / 2) {
        if (ball.position.y >= right_player.position.y && ball.position.y <= right_player.position.y + barDimension.height) {
          ball.speed.x *= -1;
        }
      }
    }

    this.ballBorderCollision = () => {
      if (ball.position.y < border.top || ball.position.y >= border.bottom - ballRadius) {
        ball.speed.y *= -1;
      }

      if (ball.position.x < border.left){
        right_player.score += 1;
        ball.reset_position(ball_position);
      }

      if (ball.position.x > border.right){
        left_player.score += 1;
        ball.reset_position(ball_position);
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

  start;
  update;

  constructor() {
    let ball = new Ball(this.ball);
    // let left_player = new Player(10, this.left_bar, left_bar_position, this.left_bar_score);
    let left_player = new AI(10, this.left_bar, left_bar_position, this.left_bar_score, ball.position);
    // let right_player = new Player(10, this.right_bar, right_bar_position, this.right_bar_score);
    let right_player = new AI(10, this.right_bar, right_bar_position, this.right_bar_score, ball.position);
    let collision = new Collision(ball, left_player, right_player);

    this.playerMode = sessionStorage.getItem('playerMode')!;

    document.addEventListener('keydown', (e) => {
      switch (e.keyCode) {
        case 87:
          left_player.paddleUp();
          break;
        case 83:
          left_player.paddleDown();
          break;
        case 38:
          right_player.paddleUp();
          break;
        case 40:
          right_player.paddleDown();
          break;
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

      switch(this.playerMode){
        case 'onePlayer':
          collision.ballBorderCollision();
          collision.ballPaddleCollision();
          ball.move();
          ball.draw();
          left_player.calculate_postion();
          right_player.calculate_postion();
          left_player.draw();
          right_player.draw();
          break;
        case 'twoPlayer':
          collision.ballBorderCollision();
          collision.ballPaddleCollision();
          ball.move();
          ball.draw();
          left_player.draw();
          right_player.draw();
          break;
      }
    }
  }


}

new Game().start();

