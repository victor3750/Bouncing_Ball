const c = document.getElementById("myCanvas");
const canvasHeight = c.height;
const canvasWidth = c.width;
const ctx = c.getContext("2d");
let circle_x = 160;
let circle_y = 60;
let radius = 20;
let xSpeed = 20;
let ySpeed = 20;
let ground_x = 100;
let ground_y = 500;
let ground_height = 5;
let ground_width = 200;
let brickArray = [];
let count = 0;

function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
    this.visible = true;
  }

  drawBrick() {
    ctx.fillStyle = "#21A0A0"; //磚塊顏色
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // ctx.strokeStyle = "white";
    // ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY >= this.y - radius &&
      ballY <= this.y + this.width + radius
    );
  }
}

//製作所有brick
for (let i = 0; i < 10; i++) {
  new Brick(
    getRandomArbitrary(0, canvasWidth - 50),
    getRandomArbitrary(0, canvasHeight - 50)
  );
}

c.addEventListener("mousemove", (e) => {
  console.log(e)
  ground_x = e.offsetX - 100;
});

function drawCircle() {
  //確認球有無打到磚塊
  brickArray.forEach((brick) => {
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      count++;
      brick.visible = false;

      //從左或右方撞擊
      if (circle_x <= brick.x || circle_x >= brick.x + brick.width) {
        xSpeed *= -1;
        //從上或下方撞擊
      }
      //重要！此處若使用else if 就無法處理剛好打到磚塊角落的情形(xSpeed跟ySpeed同時改變)，因此使用兩個if statement
      if (circle_y <= brick.y || circle_y >= brick.y + brick.height) {
        ySpeed *= -1;
      }

      // brickArray.splice(index,1);
      // if(brickArray.length == 0){
      //   clearInterval(game);
      //   alert("破關")
      // }
      // 時間複雜度較高 => 不使用

      if (count == 10) {
        clearInterval(game);
        alert("通關！");
      }
    }
  });

  //確認球有無打到地板
  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + ground_width + radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius
  ) {
    if (ySpeed > 0) {
      circle_y -= 40;
    } else {
      circle_y += 40;
    }
    ySpeed *= -1;
  }

  //確認球有無打到邊界
  if (circle_x >= canvasWidth - radius || circle_x <= radius) {
    xSpeed *= -1;
  }
  //重要！此處若使用else if 就無法處理剛好打到邊界角落的情形(xSpeed跟ySpeed同時改變)，因此使用兩個if statement
  if (circle_y >= canvasHeight - radius || circle_y <= radius) {
    ySpeed *= -1;
  }

  //更動圓座標
  circle_x += xSpeed;
  circle_y += ySpeed;

  //更動圓座標後最好馬上接著畫出球，否則圓座標即使已碰到最後一塊磚，畫面上會顯示球還沒碰到但已經通關

  //先將畫面重置
  ctx.fillStyle = "#A8DCD9";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  //畫出brick
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  //畫地板
  ctx.fillStyle = "#8A6856";
  ctx.fillRect(ground_x, ground_y, ground_width, ground_height);

  //畫出圓
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#8A6856";
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();
}

let game = setInterval(drawCircle, 25);
