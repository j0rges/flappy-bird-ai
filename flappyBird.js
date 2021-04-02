
addEventListener("load",game);

//this will contain all the game logic and objects.
function game(){
  //Initialize a few variables.
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext('2d');
  ctx.font = "50px Arial";
  let width = canvas.width;
  let height = canvas.height;
  const distance = 200;
  let speed = -2.5;
  let passed = false;
  let paused = false;


  //the object for the bird.
  let bird = {
    radius : 20,
    x : width/2,
    y : height/2,
    speedY : 0,
    gravity : 0.5,
    draw : function () {
      ctx.beginPath();
      ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = "#DDDD44";
      ctx.fill();
      ctx.closePath()
    },
    keepInCanvas : function () {
      var w = width - bird.radius;
      if (bird.x > w) {
        bird.x = w;
      } else
      if (bird.x < bird.radius){
        bird.x = bird.radius;
      }
      var h = height - bird.radius;
      if (bird.y > h) {
        bird.y = h;
      } else
      if (bird.y < bird.radius){
        bird.y = bird.radius;
      }
    },
    jump : function () {
      bird.speedY = -8;
    },
    update : function () {
      bird.speedY += bird.gravity;
      bird.y += bird.speedY;
      bird.keepInCanvas();
      bird.draw();
    }
  };

  class Column {
    constructor(h,pos){
      this.width = 70;
      this.height = h;
      this.space = 130;
      this.colour = "#12AA12";
      this.y = height - this.height;
      this.x = pos + this.width;
    }
    draw() {
      ctx.beginPath();
      ctx.rect(this.x,height - this.height,this.width,this.height);
      ctx.rect(this.x, 0, this.width, height - this.height - this.space);
      ctx.fillStyle = this.colour;
      ctx.fill();
    }
    update() {
      this.x += speed;
      this.draw();
    }
  }

  //initialize two initial column variables.
  let c1 = new Column(100,width);
  let c2 = new Column(200,c1.x + distance);
  let count = 0;

  //the game logic goes here.
  function update(){
    if(!paused){
      if(c1.x < ( - c1.width)){
        c1 = c2;
        c2 = new Column(100 + (Math.random() * 210), c2.x + distance);
        speed -= 0.15;
        passed = false;
      }
      if (c1.x + c1.width/2 < width/2 ) {
        if(!passed){
          count += 1;
          passed = true;
        }
      }
      if (gameLost()) {
        console.log("crash!!");
        //start game after half a second.
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

  function drawCount(){
    ctx.fillStyle = "black";
    ctx.fillText(count.toString(), 20, 60);
  }

  function pythag(cateto1,cateto2){
    return Math.sqrt(Math.pow(cateto1, 2) + Math.pow(cateto2, 2));
  }

  //return true if the bird collides with a column.
  function gameLost(){
    //Check if the bird is within range to crash.
    if ((bird.x > (c1.x - bird.radius)) && (bird.x < (c1.x + c1.width + bird.radius))) {
      //Divide the area in three:
      //before the column
      if (bird.x < (c1.x)) {
        //check if collided with walls above or beneath.
        if (bird.y > c1.y || bird.y < c1.y - c1.space) {
          return true;
        }
        //Check if collided with the corners on the front.
        //corner beneath:
        if (pythag(Math.abs(bird.x-c1.x),Math.abs(bird.y-c1.y)) < bird.radius) {
          return true;
        }
        //corner above:
        if(pythag(Math.abs(bird.x-c1.x),Math.abs(bird.y-(c1.y-c1.space))) < bird.radius){
          return true;
        }
        //If it hasn't collided:
        return false;
      }
      //after the column
      else if (bird.x > c1.x + c1.width) {
        //check if collided with walls above or beneath.
        if (bird.y > c1.y || bird.y < c1.y - c1.space) {
          return true;
        }
        //Check if collided with the corners on the front.
        //corner beneath:
        if (pythag(Math.abs(bird.x-(c1.x+c1.width)),Math.abs(bird.y-c1.y)) < bird.radius) {
          return true;
        }
        //corner above:
        if(pythag(Math.abs(bird.x-(c1.x+c1.width)),Math.abs(bird.y-(c1.y-c1.space))) < bird.radius){
          return true;
        }
        //If it hasn't collided:
        return false;
      }
      //under the column.
      else {
        return ((bird.y > c1.y - bird.radius) || (bird.y < c1.y - c1.space + bird.radius));
      }
    }
    return false;
  }

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

  //positive modulus.
  function modulus(a,b){
    if (a >= 0) return (a % b);
    if (b <= 0) return (-b + (a % b));
    while (a < 0){
      a += b;
    }
    return a;
  }

  function keypress(e){
    //if pressed space bar.
    if (e.keyCode == 32) {
      if(!paused) bird.jump();
      else pause();
    }
    //if pressed "p".
    else if (e.keyCode == 112){
      pause();
    }
  }

  function start(e){
    if (e.keyCode == 32) {
      //remove event listener
      removeEventListener("keypress",start);
      initializeVariables();
      //jump when you press space bar:
      addEventListener("keypress",keypress);
      //start the game.
      window.requestAnimationFrame(update);
    }
  }

  function initializeVariables(){
    speed = -2.5;
    passed = false;
    paused = false;
    bird = {
      radius : 20,
      x : width/2,
      y : height/2,
      speedY : 0,
      gravity : 0.5,
      draw : function () {
        ctx.beginPath();
        ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = "#DDDD44";
        ctx.fill();
        ctx.closePath()
      },
      keepInCanvas : function () {
        var w = width - bird.radius;
        if (bird.x > w) {
          bird.x = w;
        } else
        if (bird.x < bird.radius){
          bird.x = bird.radius;
        }
        var h = height - bird.radius;
        if (bird.y > h) {
          bird.y = h;
        } else
        if (bird.y < bird.radius){
          bird.y = bird.radius;
        }
      },
      jump : function () {
        bird.speedY = -8;
      },
      update : function () {
        bird.speedY += bird.gravity;
        bird.y += bird.speedY;
        bird.keepInCanvas();
        bird.draw();
      }
    };
    c1 = new Column(100,width);
    c2 = new Column(200,c1.x + distance);
    count = 0;
  }

  //start game
  addEventListener("keypress",start);
  //draw the bird and count.
  bird.draw();
  drawCount();
}
