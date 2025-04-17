let video;
let handpose;
let predictions = [];

function setupHandpose(callbackWhenReady) {
  video = createCapture(VIDEO);
  video.size(640, 560); // 可根据你 canvas 尺寸调整
  video.hide();

  handpose = ml5.handpose(video, () => {
    console.log("Handpose model loaded.");
    if (callbackWhenReady) callbackWhenReady(); // 回调通知主程序
  });

  handpose.on("predict", results => {
    predictions = results;
  });
}

function drawHandKeypoints() {
  if (predictions.length > 0) {
    for (let i = 0; i < predictions.length; i++) {
      const landmarks = predictions[i].landmarks;
      for (let j = 0; j < landmarks.length; j++) {
        const [x, y, z] = landmarks[j];
        fill(0, 255, 0);
        noStroke();
        ellipse(x, y, 10, 10);
      }
    }
  }
}

// 提供外部访问指尖位置（例如 index finger tip）
function getIndexFingerTip() {
  if (predictions.length > 0) {
    const tip = predictions[0].landmarks[8]; // 第8个点是食指尖
    return createVector(tip[0], tip[1]);
  }
  return null;
}
