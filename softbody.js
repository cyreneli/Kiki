let particles = [];
let particles2 = [];
let springs = [];
let DIM = 3;
let REST_LENGTH = 5;
let STRENGTH = 0.125;
let INNER_STRENGTH = 0.13;
let head;
//solve the 640 480 strict
let constraints = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 600 }
  }
};
//let predictions = [];
//set tail
let tailParticles = [];
let tailLength = 15;
let tailNumParticles = 50;




function setup() {
  createCanvas(1280, 600);
  video = createCapture(constraints, () => {
    console.log('video ready');
  });
  video.size(1280, 600);
  video.hide();

  handpose = ml5.handpose(video, modelReady);
  handpose.on("predict", results => {
    predictions = results;
  });
  
  //set particle2
  for (let i = 0; i < 300; i++) {
    //particles2.push(new Particle2(random(width), random(height)));
    let x = random(width);
    let y = random(height);
    let label = random(letters); // 从字母池随机挑一个
    particles2.push(new Particle2(x, y, label));
  }

// set tail
  // 初始化尾部粒子链条
  for (let i = 0; i < tailNumParticles; i++) {
    let x = width / 2 + i * tailLength;
    let y = height / 2;
    tailParticles.push(new TailParticle(x, y));
  }
  tailParticles[0].locked = true; // 头部默认锁定（由鼠标控制）


  //set kikibio
  for (let y = 0; y < DIM; y++) {
    for (let x = 0; x < DIM; x++) {
      let p = new Particle(x * REST_LENGTH, y * REST_LENGTH);
      particles.push(p);
    }
  }

for (let y = 0; y < DIM; y++) {
  for (let x = 0; x < DIM; x++) {
    let idx = x + y * DIM;
    let p = particles[idx];

    if (x > 0) {
      let left = particles[idx - 1];
      let s = new Spring(p, left, REST_LENGTH, STRENGTH);
      s.direction = "horizontal"; // 加上方向标记
      springs.push(s);
    }

    if (y > 0) {
      let top = particles[idx - DIM];
      let s = new Spring(p, top, REST_LENGTH, STRENGTH);
      s.direction = "vertical"; // 加上方向标记
      springs.push(s);
    }
  }
}


  // 内部对角骨架
  let p1 = particles[0];
  let p2 = particles[particles.length - 1];
  let diagLen = sqrt(sq(REST_LENGTH * (DIM - 1)) * 2);
  springs.push(new Spring(p1, p2, diagLen, INNER_STRENGTH));

  let p3 = particles[DIM - 1];
  let p4 = particles[particles.length - DIM];
  springs.push(new Spring(p3, p4, diagLen, INNER_STRENGTH));

// 中心点锁定
// 六边形控制点（用于拉扯 square 的中部）
let hexCenter = createVector(width / 2, height / 2);
let hexRadius = 50;
let hexControllers = [];

for (let i = 0; i < 6; i++) {
  let angle = TWO_PI / 6 * i;
  let x = hexCenter.x + hexRadius * cos(angle);
  let y = hexCenter.y + hexRadius * sin(angle);
  let p = new Particle(x, y);
  p.locked = true;
  particles.push(p);
  hexControllers.push(p);
}

// 将这些控制点拉向 grid 中心 4 个点
let cx = int(DIM / 2);
let cy = int(DIM / 2);

let centerTargets = [
  particles[cx + cy * DIM],
  particles[(cx + 1) + cy * DIM],
  particles[cx + (cy + 1) * DIM],
  particles[(cx + 1) + (cy + 1) * DIM],
];

for (let i = 0; i < hexControllers.length; i++) {
  let controller = hexControllers[i];
  let target = centerTargets[i % centerTargets.length];
  springs.push(new Spring(controller, target, hexRadius, 0.2));
}

}


function modelReady() {
  console.log("Model ready!");
}


function draw() {
  background(0,0,0);
  detectfingers();
  videovisual();


  // Verlet 移动更新
  for (let p of particles) {
    p.update();
  }
  // 施加弹簧
  for (let s of springs) {
    s.apply();
  }
  // 绘制弹簧线
  for (let s of springs) {
    let a = s.a.position;
    let b = s.b.position;
    let numPoints = 5; // 每条弹簧上画多少个点
  
    for (let i = 0; i <= numPoints; i++) {
      let t = i / numPoints;
      let x = lerp(a.x, b.x, t);
      let y = lerp(a.y, b.y, t);
      strokeWeight(random(2, 10));
      stroke(255);
      point(x, y);
    }
}

//set tails
  // 约束各粒子之间的距离
  for (let i = 0; i < 10; i++) {
    applyTailConstraints();
  }
  // 更新粒子位置
  for (let p of tailParticles) {
    p.update();
  }
  // 绘制线条和点
  beginShape();
  for (let p of tailParticles) {
    strokeWeight(3);
    noFill();
    vertex(p.position.x, p.position.y);
  }
  endShape();

  for (let p of tailParticles) {
    ellipse(p.position.x, p.position.y, 5, 5);
  }


  // 新增：更新红色粒子并检查碰撞
  for (let p2 of particles2) {
    for (let p1 of particles) {
      p2.repelFrom(p1);
    }
    p2.update();
    p2.show();
  }
  
}

