
addEventListener("load",game);

// this will contain all the game logic and objects.
function game(){
  // Initialize global variables.
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext('2d');
  ctx.font = "50px Arial";
  let width = canvas.width;
  let height = canvas.height;
  const distance = 200;
  let speed = -2.5;
  let passed = false;
  let paused = false;
  let bird;
  let c1;
  let c2;

  // class for the bird object.
  class Bird {
      constructor() {
          this.radius = 20,
          this.x = width/2,
          this.y = height/2,
          this.speedY = 0,
          this.gravity = 0.5
      }
      // draw bird in the canvas as a filled circle.
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = "#DDDD44";
        ctx.fill();
        ctx.closePath()
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
        this.speedY = -8;
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
      ctx.beginPath();
      ctx.rect(this.x,height - this.height,this.width,this.height);
      ctx.rect(this.x, 0, this.width, height - this.height - this.space);
      ctx.fillStyle = this.colour;
      ctx.fill();
    }
    // Update after one step in time.
    update() {
      this.x += speed;
      this.draw();
    }
  }

  // Update the game at each step in time.
  function update(){
    if(!paused){
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
      // add one to the score if a column was just passed.
      if (c1.x + c1.width/2 < width/2 ) {
        if(!passed){
          count += 1;
          passed = true;
        }
      }
      if (gameLost(bird, c1)) {
        console.log("crash!!");
        // start game after half a second.
        setTimeout(function () {addEventListener("keypress",start);},500);
      } else {
        clearCanvas();
        bird.update();
        c1.update();
        c2.update();
        drawCount();
        window.requestAnimationFrame(update);
      }
    }
  }

  // display score.
  function drawCount(){
    ctx.fillStyle = "black";
    ctx.fillText(count.toString(), 20, 60);
  }

  // find distance between two points.
  function pythag(cateto1,cateto2){
    return Math.sqrt(Math.pow(cateto1, 2) + Math.pow(cateto2, 2));
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
    } else {
      paused = false;
      window.requestAnimationFrame(update);
    }
  }

  function clearCanvas(){
    ctx.clearRect(0,0,width,height);
  }

  // positive modulus.
  function modulus(a,b){
    if (a >= 0) return (a % b);
    if (b <= 0) return (-b + (a % b));
    while (a < 0){
      a += b;
    }
    return a;
  }

  function keypress(e){
    // Jump when space bar is pressed.
    if (e.keyCode == 32) {
      if(!paused) bird.jump();
      else pause();
    }
    // Pause when "p" key is pressed.
    else if (e.keyCode == 112){
      pause();
    }
  }

  function start(e){
    if (e.keyCode == 32) {
      // remove event listener to start the game.
      removeEventListener("keypress",start);
      initializeVariables();
      // Add event listener for keyboard interactions.
      addEventListener("keypress",keypress);
      // start the game.
      window.requestAnimationFrame(update);
    }
  }

  function initializeVariables(){
    speed = -2.5;
    passed = false;
    paused = false;
    // initialize two initial column variables.
    c1 = new Column(100,width);
    c2 = new Column(200,c1.x + distance);
    count = 0;
    // initialize bird.
    bird = new Bird()
  }

  // Start the game when space bar is pressed.
  addEventListener("keypress",start);
  // initialize bird.
  bird = new Bird()
  //draw the bird and count.
  bird.draw();
  drawCount();
}
