import Player from './ai_player.js';
import {children_parameters} from './genetic_algorithm.js';
import {pythag} from "./utils.js";

// get images that will be used in the game.
const media_prefix = 'media/';
let pause_img = new Image(), bird_img = new Image(), background_img = new Image(),
    column_img = new Image(), mirror_column_img = new Image();
pause_img.src = media_prefix + 'pause.png';
bird_img.src = media_prefix + 'bird.png';
background_img.src = media_prefix + 'background.png';
column_img.src = media_prefix + 'column.png';
mirror_column_img.src = media_prefix + 'mirror_column.png';

// this will contain all the game logic and objects.
export default function game(e, interactive = 1, num_players = 20){
  // Initialize global variables.
  const code_to_char = String.fromCharCode;
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext('2d');
  ctx.font = "50px Arial";
  let width = canvas.width, height = canvas.height;
  const distance = 200;
  let count = 0, speed = -2.5;
  let passed = false, paused = false;
  let c1, c2;
  let players, next_gen_params, birds, dead;

  // class for the bird object.
  class Bird {
      constructor() {
          this.radius = 20,
          this.x = width/2,
          this.y = height/2,
          this.speedY = 0,
          this.gravity = 0.5
      }
      // draw bird in the canvas rotated based on its direction.
      draw() {
        let radius = this.radius + 10;
        let angle = Math.atan(this.speedY/speed);
        if(angle > 0) angle /= 2;
        ctx.translate(this.x, this.y);
        ctx.rotate(-angle);
        ctx.drawImage(bird_img, -radius, -radius, radius*2, radius*2);
        ctx.rotate(angle);
        ctx.translate(-this.x, -this.y);
      }
      keepInCanvas() {
        // make sure it doesn't leave the canvas on the left or right.
        // this is redundant since the x position of the bird doesn't change.
        var w = width - this.radius;
        if (this.x > w) {
          this.x = w;
        } else
        if (this.x < this.radius){
          this.x = this.radius;
        }
        // make sure it doesn't go above or below the canvas.
        var h = height - this.radius;
        if (this.y > h) {
          this.y = h;
        } else
        if (this.y < this.radius){
          this.y = this.radius;
        }
      }
      // change the speed to simulate a jump.
      jump() {
        this.speedY = -7;
      }
      // Update after one step in time.
      update() {
        this.speedY += this.gravity;
        this.y += this.speedY;
        this.keepInCanvas();
        this.draw();
      }
  }

  class Column {
    constructor(h,pos){
      this.width = 70;
      this.height = h;
      this.space = 130;
      this.colour = "#12AA12";
      this.y = height - this.height;
      this.x = pos + this.width;
    }
    // draw the column in the canvas as a rectangle.
    draw() {
      // draw bottom column
      ctx.drawImage(column_img, this.x - 2, height - this.height - 2);
      // draw top column
      ctx.rotate(Math.PI);
      ctx.drawImage(mirror_column_img, - this.x - this.width - 2, -height + this.height + this.space - 2);
      ctx.rotate(-Math.PI);
    }
    // Update after one step in time.
    update() {
      this.x += speed;
      this.draw();
    }
  }

  function update_columns() {
      // If the column at the front has left the screen.
      if(c1.x < ( - c1.width)){
        c1 = c2;
        c2 = new Column(100 + (Math.random() * 210), c2.x + distance);
        // increase the speed of the columns up to a limit.
        if(speed > -6) {
            speed -= 0.15;
        }
        passed = false;
      }
  }

  // Update the game at each step in time.
  function update(frame_callback){
    if(!paused){
      update_columns();
      // add one to the score if a column was just passed.
      if (c1.x + c1.width/2 < width/2 ) {
        if(!passed){
          count += 1;
          passed = true;
        }
      }
      let game_end = true;
      for(let i = 0; i < dead.length; i++) {
          if(!dead[i]){
              if(gameLost(birds[i], c1)) {
                  if(interactive == 1){
                      console.log("crash!!");
                  } else {
                      dead[i] = true;
                      players[i].score = count;
                  }
              } else {
                  game_end = false;
              }
          }
      }
      if(game_end) {
          removeEventListener("keypress",keypress);
          // start game after half a second.
          setTimeout(start(),500);
          if(!interactive) {
              // get the parameters for the next generation.
              next_gen_params = children_parameters(players);
          }
      } else {
        clearCanvas();
        // draw living birds
        birds.forEach((bird, i) => { if(!dead[i]) bird.update();});
        c1.update();
        c2.update();
        drawCount();
        window.requestAnimationFrame(frame_callback);
      }
    }
  }

  // update with callback for interactive form:
  let update_interactive = () => update(update_interactive)

  // display score.
  function drawCount(){
    ctx.fillStyle = "black";
    ctx.fillText(count.toString(), 20, 60);
  }

  // Check if the bird has collided the column.
  function gameLost(bird, column){
    // Check if the bird is within range to crash.
    if ((bird.x > (column.x - bird.radius)) && (bird.x < (column.x + column.width + bird.radius))) {
      // Divide the area in three:
      // before the column
      if (bird.x < (column.x)) {
        //check if collided with walls above or beneath.
        if (bird.y > column.y || bird.y < column.y - column.space) {
          return true;
        }
        // Check if collided with the corners on the front.
        // corner beneath:
        if (pythag(Math.abs(bird.x-column.x),Math.abs(bird.y-column.y)) < bird.radius) {
          return true;
        }
        // corner above:
        if(pythag(Math.abs(bird.x-column.x),Math.abs(bird.y-(column.y-column.space))) < bird.radius){
          return true;
        }
        return false;
      }
      // after the column
      else if (bird.x > column.x + column.width) {
        // check if collided with walls above or beneath the gap.
        if (bird.y > column.y || bird.y < column.y - column.space) {
          return true;
        }
        // collision with bottom corner of the gap:
        if (pythag(Math.abs(bird.x-(column.x+column.width)),Math.abs(bird.y-column.y)) < bird.radius) {
          return true;
        }
        // collision with top corner of the gap:
        if(pythag(Math.abs(bird.x-(column.x+column.width)),Math.abs(bird.y-(column.y-column.space))) < bird.radius){
          return true;
        }
        return false;
      }
      //under the column.
      else {
        // check whether the bird has collided with the top or the bottom og the column.
        return ((bird.y > column.y - bird.radius) || (bird.y < column.y - column.space + bird.radius));
      }
    }
    return false;
  }

  // pause the game.
  function pause(){
    if (paused == false) {
      paused = true;
      //draw the pause symbol.
      ctx.drawImage(pause_img, (width-pause_img.width)/2, (height-pause_img.height)/2);
    } else {
      paused = false;
      window.requestAnimationFrame(update_interactive);
    }
  }

  function clearCanvas(){
    ctx.clearRect(0,0,width,height);
    ctx.drawImage(background_img,0,0,width, height)
  }

  function keypress(e){
    // Jump when space bar is pressed.
    if (code_to_char(e.keyCode) == " ") {
      if(!paused) birds.map((bird) => bird.jump());
      else pause();
    }
    // Pause when "p" key is pressed.
    else if (code_to_char(e.keyCode).toLowerCase() == "p"){
      pause();
    }
  }

  //return the state of the game for the ai_player.
  function game_state(bird, column) {
      let y_bottom = height - column.height; // bottom limit of column gap.
      let y_top = y_bottom - column.space; // top limit of column gap.
      return [y_top - bird.y, y_bottom - bird.y, column.x - bird.x,
           bird.speedY, speed, 1];
  }

  // Let the ai_player perform jump in this frame if it wants.
  function ai_player_action(player, bird) {
      // get the state for the bird with respect to the next column.
      let state = (c1.x + c1.width > bird.x - bird.radius) ? (game_state(bird,c1)) : (game_state(bird,c2));
      // get the action from the player.
      let action = player.decide_action(state);
      if(action > 0) {
          // signal 1 means jump.
          bird.jump();
      }
  }

  function start_interactive(e){
    if (code_to_char(e.keyCode) == " ") {
      initializeVariables(1);
      // Add event listener for keyboard interactions.
      addEventListener("keypress",keypress);
      // start the game.
      window.requestAnimationFrame(() => update(update_interactive));
      removeEventListener("keypress",start_interactive);
    }
  }

  function update_ai() {
      update(update_ai);
      players.forEach((player, i) => ai_player_action(player,birds[i]));
  }

  function start_ai(e) {
      let num_parameters = 12;
      initializeVariables(num_players);
      // initialize Players
      if(typeof(next_gen_params) == 'undefined') {
          let random_parameters = (n) => Array.from(Array(n)).map(x=>Math.random()-0.5)
          players = dead.map((z) => new Player(random_parameters(num_parameters)));
      } else {
          console.log('hi');
          players = next_gen_params.map((params) => new Player(params));
      }
      console.log(players);

      // start the game.
      window.requestAnimationFrame(update_ai);
      removeEventListener("keypress",start_ai);
  }

  function start() {
      console.log('interactive = ' + interactive);
      if (interactive == 1) {
        // add event listener to start the game.
        addEventListener("keypress",start_interactive);
    } else {
        console.log('ai');
        // add event listener to start the game.
        addEventListener("keypress",start_ai);
    }
  }

  function initializeVariables(num_players){
    count=0, speed = -2.5;
    passed = false, paused = false;
    // initialize two initial column variables.
    c1 = new Column(100,width), c2 = new Column(200,c1.x + distance);
    // initialize bird.
    dead = new Array(num_players).fill(false);
    birds = dead.map((z) => new Bird());
  }

  // initialize bird.
  birds = [new Bird()]
  //draw the bird and count.
  clearCanvas()
  birds.forEach((bird) => bird.draw());
  drawCount();
  start();
}
