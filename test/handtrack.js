
let predictions = [];
function detectfingers(){
  if (predictions.length > 0) {
    let hand = predictions[0];

    // 镜像X坐标（左变右，右变左）
    function mirrorX(x) {
      return width - x;
    }

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
  }
}

