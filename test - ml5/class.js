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
    let dir = p5.Vector.sub(this.position, particle.position);
    let d = dir.mag();
    if (d < 1) { // 碰撞触发
      dir.normalize();
      dir.mult(0.5); // 推动力度
      this.velocity = dir;
      this.active = true; // 标记为激活
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
    stroke(255);
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
    this.position.add(0, 0.128); // gravity
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
    let force = delta.mult(0.1 * this.strength * diff);

    if (!this.a.locked) this.a.position.add(force);
    if (!this.b.locked) this.b.position.sub(force);
  }
}




  