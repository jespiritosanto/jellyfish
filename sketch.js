
/* == MISC == */
function windowResized() {
  resizeCanvas(windowWidth-10, windowHeight-10);
}

/* == GUI == */
var props = {
  innerRad: 40,
  outerRad: 300,
  radStep: 2.5,
  ringOffset: 0.001,
  noiseEffect: 1.0,
  speed: 12,
  startHue: 160,
  hueSpread: 1.7,
  opacity: 0.6,
  backColor: "#000000",
  fade: 0.96,
}
window.onload = function() {
  var gui = new dat.GUI();
  gui.add(props, 'innerRad').min(0).max(200);
  gui.add(props, 'outerRad').min(0).max(400);
  gui.add(props, 'radStep').min(1.0).max(24);
  gui.add(props, 'ringOffset').min(0.001).max(0.1);
  gui.add(props, 'noiseEffect').min(0.2).max(2.0);
  gui.add(props, 'speed').min(0).max(10);
  gui.add(props, 'startHue').min(0).max(360);
  gui.add(props, 'hueSpread').min(0).max(10).listen().onChange(function() {
    wanderHue = false;
  });
  gui.add(props, 'opacity').min(0).max(1);
  gui.addColor(props, 'backColor');
  gui.add(props, 'fade').min(0).max(1);
  
  gui.close();
};

var wanderHue = true;

function setup() {
  createCanvas(windowWidth-10, windowHeight-10);
  smooth();
  frameRate(30);
  colorMode(HSB, 360, 100, 100, 1);
  strokeWeight(4.0);
  noFill();
}
   
function draw() {
  // fade background
  colorMode(RGB, 255, 255, 255, 1);
  var col = color(props.backColor);
  fill(color(red(col), green(col), blue(col), 1.0-props.fade));
  rect(0,0,width,height);
  noFill();
  
  if (wanderHue) {
    // move the hue spread slightly to show aliveness via color
    props.hueSpread += (noise(frameCount/300.0) -0.5) * 0.01;
  }
  
  translate(width/2, height/2);
  
  colorMode(HSB, 360, 100, 100, 1);
  var offset = 0;
  var hue = props.startHue;
  var hueStep = props.hueSpread;
  for (var rad = props.innerRad; rad < props.outerRad; rad += props.radStep) {
    stroke(hue, 100, 100, props.opacity);
    blobCircle(rad, offset);
    offset += props.ringOffset;
    hue += hueStep;
    if (hue > 360.0)
      hue = 0.0;
  }
}

function blobCircle(rad, ranOff) {
  beginShape();
  var step = 2;
  if (props.radStep < 8)
    step = 8;
  
  for (var i = 0; i < 360; i += step) {
    var x = sin(radians(i));
    var y = cos(radians(i));
    
    var frameDiv = map(props.speed, 0, 10, 300, 24);

    x += props.noiseEffect*(noise(ranOff+x+frameCount/frameDiv)-0.5);
    y += props.noiseEffect*(noise(ranOff+y+frameCount/frameDiv)-0.5);

    x *= rad;
    y *= rad;

    vertex(x, y);
  }
  endShape(CLOSE);
}
