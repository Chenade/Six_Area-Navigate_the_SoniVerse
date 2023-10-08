// visual properties
let cnvWidth, cnvHeight;
let playButton;
let spectrum, fft;
let cnv;

let data = {};

if (sessionStorage.getItem("optical"))
{
    data["W1"] = JSON.parse(sessionStorage.getItem("optical"));
    // sessionStorage.removeItem("optical");
}

if (sessionStorage.getItem("near-infrared"))
{
    data["W2"] = JSON.parse(sessionStorage.getItem("near-infrared"));
    // sessionStorage.removeItem("near-infrared");
}

if (sessionStorage.getItem("mid-infrared"))
{
    data["W3"] = JSON.parse(sessionStorage.getItem("mid-infrared"));
    // sessionStorage.removeItem("mid-infrared");
}

if (sessionStorage.getItem("far-infrared"))
{
    data["W4"] = JSON.parse(sessionStorage.getItem("far-infrared"));
    // sessionStorage.removeItem("far-infrared");
}

let sStar = {
  "W1": [],
  "W2": [],
  "W3": [],
  "W4": []
};

let sumStar = {};
for (let i = 0; i < 4; i++)
{
  if(!sumStar[i]) sumStar[i] = 0;
  if (data.W1 && data.W1[i]) sumStar[i] += data.W1[i].length;
  if (data.W2 && data.W2[i]) sumStar[i] += data.W2[i].length;
  if (data.W3 && data.W3[i]) sumStar[i] += data.W3[i].length;
  if (data.W4 && data.W4[i]) sumStar[i] += data.W4[i].length;
}



function setup() {
  // Set canvas dimensions based on the container size
  cnvWidth = select('#canvas-container').width;
  cnvHeight = select('#canvas-container').height;
  
  // Create canvas and parent it to the container
  cnv = createCanvas(cnvWidth, cnvHeight);
  cnv.parent('canvas-container');
  
  // Set the background color
  background(5);

  let index = 0;
  
  // extract data
  for (const i in data.W1)
  {
    if (!data.W1[i]) continue;
    for (const j in data.W1[i])
    {
      if (!data.W1[i][j]) continue;
      sStar.W1[i + j] = new starsound(sumStar[i]);
      sStar.W1[i + j].setW1(data.W1[i][j][0], data.W1[i][j][1], i * 2000);
    }
  }

  for (const i in data.W2)
  {
    if (!data.W2[i]) continue;
    for (const j in data.W2[i])
    {
      if (!data.W2[i][j]) continue;
      sStar.W2[i + j] = new starsound(sumStar[i]);
      sStar.W2[i + j].setW2(data.W2[i][j][0], data.W2[i][j][1], i * 2000);
    }
  }

  for (const i in data.W3)
  {
    if (!data.W3[i]) continue;
    for (const j in data.W3[i])
    {
      if (!data.W3[i][j]) continue;
      sStar.W3[i + j] = new starsound(sumStar[i]);
      sStar.W3[i + j].setW3(data.W3[i][j][0], data.W3[i][j][1], i * 2000);
    }
  }

  for (const i in data.W4)
  {
    if (!data.W4[i]) continue;
    for (const j in data.W4[i])
    {
      if (!data.W4[i][j]) continue;
      sStar.W4[i + j] = new starsound(sumStar[i]);
      sStar.W4[i + j].setW4(data.W4[i][j][0], data.W4[i][j][1], i * 2000);
    }
  }
 
  // // create click play button
  // playButton = createButton('Play Sound');
  // // playButton.position(cnvWidth/2, cnvHeight*1/5);
  // playButton.position(cnvWidth / 2 - playButton.width / 2, cnvHeight * 1/5);
  // playButton.mousePressed(clickPlay);
  let playButtonContainer = select('#play-button-container');
  playButton = createButton('Play Sound');
  playButton.position(windowWidth / 2 - playButton.width / 2, windowHeight * 1/5);
  playButton.mousePressed(clickPlay);
  playButton.parent(playButtonContainer);
  
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
  for (const i in sStar.W1)
  {
    sStar.W1[i].playNote(1);
    print("W1 is playing" + second());
  }
  for (const i in sStar.W2)
  {
    sStar.W2[i].playNote(2);
    print("W2 is playing" + second());
  }
  for (const i in sStar.W3)
  {
    sStar.W3[i].playNote(3);
    print("W3 is playing" + second());
  }
  for (const i in sStar.W4)
  {
    sStar.W4[i].playNote(4);
    print("W4 is playing" + second());
  }
  
}