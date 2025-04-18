// ------------- 基础类 -------------
  
class Particle2 {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0); // 初始静止
    this.active = false; // 是否开始移动
  }

  update() {
    if (this.active) {
      this.position.add(this.velocity);
      this.constrain();
    }
  }

  repelFrom(particle) {
    if (!particle || !particle.position) return;
  
    let dir = p5.Vector.sub(this.position, particle.position);
    let d = dir.mag();
  
    // 增大范围看可视化有没有触发
    if (d < 70) {
      // 可视化线和判定圆
      stroke(255, 255, 255, 100);
      strokeWeight(10);
      line(this.position.x, this.position.y, particle.position.x, particle.position.y);
      noFill();
      ellipse(particle.position.x, particle.position.y, 10, 10);
      dir.normalize();
      dir.mult(2);
      this.velocity = dir;
      this.active = true;
    }
  }
  constrain() {
    if (this.position.x <= 0 || this.position.x >= width) {
      this.velocity.x *= -1;
      this.position.x = constrain(this.position.x, 0, width);
    }

    if (this.position.y <= 0 || this.position.y >= height) {
      this.velocity.y *= -1;
      this.position.y = constrain(this.position.y, 0, height);
    }
  }

  show() {
    stroke(255,255,255,40);
    strokeWeight(30);
    point(this.position.x, this.position.y);
    stroke(0,0,0,100);
    strokeWeight(10);
    point(this.position.x, this.position.y);

  }
}


class Particle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.prev = this.position.copy();
    this.locked = false;
  }

  update() {
    if (this.locked) return;
    let temp = this.position.copy();
    let velocity = p5.Vector.sub(this.position, this.prev);
    this.position.add(velocity);
    this.position.add(0, 0.2); // gravity
    this.prev = temp;
    this.constrain();
  }

  constrain() {
    this.position.x = constrain(this.position.x, 0, width);
    this.position.y = constrain(this.position.y, 0, height);
  }
}


class Spring {
  constructor(a, b, restLength, strength) {
    this.a = a;
    this.b = b;
    this.restLength = restLength;
    this.strength = strength;
  }

  apply() {
    let delta = p5.Vector.sub(this.b.position, this.a.position);
    let dist = delta.mag();
    let diff = (dist - this.restLength) / dist;
    let force = delta.mult(0.05 * this.strength * diff);

    if (!this.a.locked) this.a.position.add(force);
    if (!this.b.locked) this.b.position.sub(force);
  }
}

class TailParticle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.prev = this.position.copy();
    this.locked = false;
  }

  update() {
    if (this.locked) return;

    let temp = this.position.copy();
    let velocity = p5.Vector.sub(this.position, this.prev);
    velocity.mult(0.5); // 摩擦
    this.position.add(velocity);
    this.position.add(0,0.5); // 重力
    this.prev = temp;
  }
}


  