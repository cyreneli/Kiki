function videovisual(){
    // Try experimenting with this
  let gridSize = (15);
  // The video has pixels just like an image!
  video.loadPixels();
  translate(width, 0);
  scale(-1, 1);
  for (let y=0; y<video.height; y+=gridSize) {
    for (let x=0; x<video.width; x+=gridSize) {
      
      // At the current position, get the red value (an approximation for brightness) and use it to create the diameter
      let index = (y * video.width + x) * 4;
      let r = video.pixels[index];
      let dia = map(
        r, 
        0, 255,
        gridSize, 2
      );
      
      // Draw a circle at the current location using the diameter we calculated
      //circlecolor = color(255,0,0);
      fill(255,255,255,80);
      noStroke();
      circle(x + gridSize/2, y + gridSize/2, dia);
    }
  }
}