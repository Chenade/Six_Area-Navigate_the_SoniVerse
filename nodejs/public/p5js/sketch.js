// visual properties
let cnvWidth, cnvHeight;
let playButton;
let spectrum, fft;
let cnv;
let start = false;

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


/* add before setup*/
let amplitude;
let soundObj = [];
function preload() {
  soundObj[0] = loadSound('./p5js/Samples/Bass.mp3');
  soundObj[1] = loadSound('./p5js/Samples/Brass.mp3');
  soundObj[2] = loadSound('./p5js/Samples/Pad.mp3');
  soundObj[3] = loadSound('./p5js/Samples/Box.mp3');
}

function setup() {
  // Set canvas dimensions based on the container size
  cnvWidth = (select('#canvas-container').width);
  cnvHeight = (select('#canvas-container').height)*0.4;

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
      sStar.W1[i + j].setW1(data.W1[i][j][0], data.W1[i][j][1], i * 0.2);
    }
  }

  for (const i in data.W2)
  {
    if (!data.W2[i]) continue;
    for (const j in data.W2[i])
    {
      if (!data.W2[i][j]) continue;
      sStar.W2[i + j] = new starsound(sumStar[i]);
      sStar.W2[i + j].setW2(data.W2[i][j][0], data.W2[i][j][1], i * 0.25);
    }
  }

  for (const i in data.W3)
  {
    if (!data.W3[i]) continue;
    for (const j in data.W3[i])
    {
      if (!data.W3[i][j]) continue;
      sStar.W3[i + j] = new starsound(sumStar[i]);
      sStar.W3[i + j].setW3(data.W3[i][j][0], data.W3[i][j][1], i * 0.3);
    }
  }

  for (const i in data.W4)
  {
    if (!data.W4[i]) continue;
    for (const j in data.W4[i])
    {
      if (!data.W4[i][j]) continue;
      sStar.W4[i + j] = new starsound(sumStar[i]);
      sStar.W4[i + j].setW4(data.W4[i][j][0], data.W4[i][j][1], i * 0.35);
    }
  }
 
  // create fft
  fft = new p5.FFT();

   // control overall amplitude
   amplitude = new p5.Amplitude();
   amplitude.toggleNormalize(1);
}

function draw() {
  // draw spectrum
  let spectrum = fft.analyze();
  noStroke();
  fill(3, 252, 252);
  for (let i = 0; i< (spectrum.length * 0.4); i++){ 
    let x = map(i, 0, (spectrum.length * 0.4), 0, cnvWidth);
    let h = -cnvHeight + map(spectrum[i], 0, 255, cnvHeight, 0);
    rect(x, cnvHeight, cnvWidth / (spectrum.length * 0.4), h )
  }  
}

function clickPlay() {
  start = (!start);
  background(180);

  console.log(start);
  if (start)
  {
    outputVolume(1, 0.5);
    document.getElementById("play-button").innerHTML = "Pause";
    for (const i in sStar.W1)
    {
      sStar.W1[i].playNote();
    }
    for (const i in sStar.W2)
    {
      sStar.W2[i].playNote();
    }
    for (const i in sStar.W3)
    {
      sStar.W3[i].playNote();
    }
    for (const i in sStar.W4)
    {
      sStar.W4[i].playNote();
    }
    amplitude = new p5.Amplitude();
    amplitude.toggleNormalize(1);  
  }
  else
  {
    outputVolume(0, 0.5); 
    document.getElementById("play-button").innerHTML = "Play";
    for (const i in sStar.W1)
    {
      sStar.W1[i].pauseNote();
    } 
    for (const i in sStar.W2)
    {
      sStar.W2[i].pauseNote();
    }    
    for (const i in sStar.W3)
    {
      sStar.W3[i].pauseNote();
    }
    for (const i in sStar.W4)
    {
      sStar.W4[i].pauseNote();
    } 
  }
  
}