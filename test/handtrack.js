
let predictions = [];


function mirrorX(x) {
  return width - x;
}

//draw hexagon
function drawHexagon(center, radius) {
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i;
    let x = center.x + radius * cos(angle);
    let y = center.y + radius * sin(angle);
    strokeWeight(4);
    vertex(x, y);
  }
  endShape(CLOSE);
}

// 约束保持相邻粒子的距离为 tailLength
function applyTailConstraints() {
  for (let i = 0; i < tailParticles.length - 1; i++) {
    let p1 = tailParticles[i];
    let p2 = tailParticles[i + 1];
    let dir = p2.position.copy().sub(p1.position);
    let d = dir.mag();
    let diff = tailLength - d;
    dir.normalize().mult(diff / 2);

    if (!p1.locked) p1.position.sub(dir);
    if (!p2.locked) p2.position.add(dir);
  }
}

function detectfingers(){
// 让六边形控制点绕鼠标旋转移动
//mirroredMouseX because video.js change the (0,0)
//let mirroredMouseX = width - mouseX;
//replace mouse by finger to control the biobug
let t = frameCount * 0.02;

if (predictions.length > 0) {
  let hand = predictions[0];

  let thumbTip = hand.annotations.thumb[3]; 
  let indexTip = hand.annotations.indexFinger[3];
  let middleTip = hand.annotations.middleFinger[3];
  let ringTip = hand.annotations.ringFinger[3];
  let pinkyTip = hand.annotations.pinky[3];

  push();
  fill(255, 255, 0);
  noStroke();
  ellipse(mirrorX(thumbTip[0]), thumbTip[1], 10, 10);
  ellipse(mirrorX(indexTip[0]), indexTip[1], 10, 10);
  ellipse(mirrorX(middleTip[0]), middleTip[1], 10, 10);
  ellipse(mirrorX(ringTip[0]), ringTip[1], 10, 10);
  ellipse(mirrorX(pinkyTip[0]), pinkyTip[1], 10, 10);
  pop();

//control biobug
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i + t;
    let x = indexTip[0] + 50 * cos(angle);
    let y = indexTip[1] + 50 * sin(angle);
    particles[DIM * DIM + i].position.set(x, y);
  }
// control tail
  // 头部跟随鼠标
  tailParticles[0].position.set(indexTip[0], indexTip[1] );
  

//control star
  let center = createVector(mirrorX(indexTip[0]), indexTip[1]);
  let radius = 100;
  stroke(0);
  fill(255, 255, 255, 30);
  drawHexagon(center, radius);
}
}

