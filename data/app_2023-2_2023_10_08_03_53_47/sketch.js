// visual properties
let cnvWidth, cnvHeight;
let playButton;
let spectrum, fft;


// dummy data
let tmp = {
  "W1": 
  {
    "1": 
    [
      [0.1,0.1],[0.2,0.2]
    ],
    "2": null,
    "3": 
    [
      [0.3,0.3],[0.4,0.4],[0.5,0.5]
    ]
  },
  "W2": {
    "1": 
    [
      [0.8,0.8],[0.9,0.9]
    ]    
  },
  "W3": null,
  "W4": null
}

let numStar = [40, 60, 0, 0]; // W1~W4
let sumStar = 100;
let sStar = [];


function setup() {
  cnvWidth = windowWidth;
  cnvHeight = windowHeight * 1/3;
  createCanvas(cnvWidth, cnvHeight);
  background(5);
  
  // extract data
  
  
  // initialize sound
  for (let i=0; i<numStar[0]; i++) {
    sStar[i] = new starsound(sumStar);
    sStar[i].setW1(random(-15, 15), random(-15, 15), 0);
    //print("hi");
  }
  for (let i=0; i<numStar[1]; i++) {
    sStar[i] = new starsound(sumStar);
    sStar[i].setW2(random(-15, 15), random(-15, 15), 5);
    //print("hi");
  }
  for (let i=0; i<numStar[2]; i++) {
    sStar[i] = new starsound(sumStar);
    sStar[i].setW3(random(-15, 15), random(-15, 15), 5);
    //print("hi");
  }
  for (let i=0; i<numStar[2]; i++) {
    sStar[i] = new starsound(sumStar);
    sStar[i].setW4(random(-15, 15), random(-15, 15), 5);
    //print("hi");
  }  
  
  
  // create click play button
  playButton = createButton('Play Sound');
  playButton.position(cnvWidth/2, cnvHeight*1/5);
  playButton.mousePressed(clickPlay);
  
  // create fft
  fft = new p5.FFT();
  
}

function draw() {
  // draw spectrum
  let spectrum = fft.analyze();
  noStroke();
  fill(3, 252, 252);
  for (let i = 0; i< spectrum.length; i++){
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / spectrum.length, h )
  }  

}

function clickPlay() {
  background(180);
  for (let i=0; i<numStar[0]; i++) {
    sStar[i].playNote(1);
    print("W1 is playing" + second());
  }
  for (let i=0; i<numStar[1]; i++) {
    sStar[i].playNote(2);
    print("W2 is playing" + second());
  }
  for (let i=0; i<numStar[2]; i++) {
    sStar[i].playNote(3);
    print("W3 is playing" + second());
  }
  for (let i=0; i<numStar[3]; i++) {
    sStar[i].playNote(4);
    print("W4 is playing" + second());
  }  
}