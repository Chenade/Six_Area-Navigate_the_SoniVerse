// stat: scene 2 & 3 completed (98%) except info and reset
var sceneNum = 1;
var clickStart, clickNext, clickBack, clickInfo;
var infoCount = 0, infoIsOn = false;

// background
var spot = {
    x: 100,
    y: 50,
    r: 10,
    f: 0.000001,
    col: 100
}  

// editor objects
let theLooper, theSequencer;

// looper assets
var mic1, recorder1, Loop1, Loop2;
let onRec1 = false, onRec2 = false;
var looperRec1Count = 0, looperRec2Count = 0;
var looperFX1Count = 0, looperFX2Count = 0;

// sequencer assets
//var seqPlayCount = 0;
var seq1Count = [0,0,0,0], seq2Count = [0,0,0,0];
var seqFX1Count = 0, seqFX2Count = 0, FXpadsCount = 0;
var sound1, sound2, soundLoop;
let intervalInSeconds;
let notePattern1 = [60, 64, 67, 71];
let pitch = ["C", "C#/Db", "D", "D#/Eb","E", "F", "F#/Gb","G", "G#/Ab", "A", "A#/Bb", "B"];
var freq1 = [], freq2 = [], amp1 =[], amp2 =[], dur1 =[], dur2 =[];

// drum pads
let drums = [];
let Kick, Snare, Rim, Hihat, Tom, Clap, CongaLo, CongaHi;

// effect assets
let FXSoundSlider;
let FXSoundi = 0;
let FXSoundtxt = ["Loop 1", "Loop 2", "Synth 1", "Synth 2", "Kick", "Snare", "Rim", "Hi-Hat", "Tom", "Clap", "Conga Low", "Conga High"];
var FXControls = {
    numSound: 12,
    reverb: [], // effect objects
    delay: [],
    LPF: [],
    HPF: [],
    reverbDW: [], // values
    delayDW: [],
    delTime: [],
    LPFFreq: [],
    HPFFreq: [],
    chain: []
} 
let reverbDWSlider, delayDWSlider, delTimeSlider, LPFFreqSlider, HPFFreqSlider;

// jam board assets
var soundObj = {
  click: [], // clickable obj
  keyTxt: ["D", "C", "W", "E", "R", "T", "Y", "U", "I", "O", "F", "G", "H", "J", "V", "B", "N", "M" ],
  color: ["#ff8cf6", "#ff8cf6","#fff68c", "#eaff8c", "#cdff8c", "#a5ff8c", "#fff68c", "#eaff8c", "#cdff8c", "#a5ff8c", "#ce8cff","#9c8cff","#8c9eff","#8cdbff", "#ce8cff","#9c8cff","#8c9eff","#8cdbff"],
  amp: [], 
  freq: []
}


function preload() {
  
  // drums
  Kick = loadSound('assets/Kick.mp3');
  Snare = loadSound('assets/Snare.mp3');
  Rim = loadSound('assets/Rim.mp3');
  Hihat = loadSound('assets/Hi-Hat.mp3');
  Tom = loadSound('assets/Tom.mp3');
  Clap = loadSound('assets/Clap.mp3');
  CongaLo = loadSound('assets/Conga-Low.mp3');
  CongaHi = loadSound('assets/Conga-High.mp3');
  
}


function setup() {
  if (localStorage.getItem("notePattern1") != null)
    pitch = JSON.parse(localStorage.getItem("notePattern1"));

  createCanvas(windowWidth, (windowHeight/3));
  //userStartAudio();
  
  // navigation buttons
  createClickStart();
  createClickNext();
  createClickBack();
  createClickInfo();
  
  // Scene 1 - Begin
  
  // Scene 2 - Editor
  theLooper = new looper(2);
  theLooper.createClickMaster();
  theLooper.createChannelControls();

  theSequencer = new sequencer();
  theSequencer.createMaster();
  theSequencer.createSeq();
  theSequencer.createPads();
  // sequencer audio setup
  intervalInSeconds = 0.6; // 100 bpm
  soundLoop = new p5.SoundLoop(onSoundLoop, intervalInSeconds);
  sound1 = new p5.Oscillator('sine');
  sound2 = new p5.Oscillator('square');
  
  // select FX sound slider setup
  FXSoundSlider = createSlider(0, FXControls.numSound-1, 0, 1);
  FXSoundSlider.position(1060+ 300/3 -12, 80+ 6/24 * 560 +15);
  FXSoundSlider.style('width', '120px');
  FXSoundSlider.hide();
  
  // FX parameters slider setup
  reverbDWSlider = createSlider(0, 100, 0, 1);
  reverbDWSlider.position(1060+ 300/5*1 -15, 80+ 9/24 * 560 +10);
  reverbDWSlider.style('width', '120px');
  reverbDWSlider.hide(); 
  delayDWSlider = createSlider(0, 100, 0, 1);
  delayDWSlider.position(1060+ 300/5*1 -15, 80+ 12/24 * 560 +10);
  delayDWSlider.style('width', '120px');
  delayDWSlider.hide(); 
  delTimeSlider = createSlider(0, 1.0, 0.7, 0.1);
  delTimeSlider.position(1060+ 300/5*1 -15, 80+ 14/24 * 560 +10);
  delTimeSlider.style('width', '120px');
  delTimeSlider.hide(); 
  LPFFreqSlider = createSlider(4, 136, 136, 1); // midi number range
  LPFFreqSlider.position(1060+ 300/5*1 -15, 80+ 17/24 * 560 +10);
  LPFFreqSlider.style('width', '120px');
  LPFFreqSlider.hide(); 
  HPFFreqSlider = createSlider(4, 136, 4, 1); // midi number range
  HPFFreqSlider.position(1060+ 300/5*1 -15, 80+ 20/24 * 560 +10);
  HPFFreqSlider.style('width', '120px');
  HPFFreqSlider.hide();
  
  // effect controls
  for (let i = 0; i<FXControls.numSound; i++) {
    FXControls.reverb[i] = new p5.Reverb();
    FXControls.delay[i] = new p5.Delay();
    FXControls.LPF[i] = new p5.LowPass();
    FXControls.HPF[i] = new p5.HighPass();
    
    // effect settings
    FXControls.reverb[i].set(3, 2);
    FXControls.reverb[i].drywet(0); // initialize
    FXControls.reverbDW[i] = 0;

    FXControls.delay[i].delayTime(0.3);
    FXControls.delay[i].feedback(0.45);
    FXControls.delay[i].filter(2500); // low pass
    FXControls.delay[i].drywet(0); // initialize
    FXControls.delayDW[i] = 0;
    
    FXControls.LPF[i].freq(22000); // initialize
    FXControls.LPFFreq[i] = 0;
    FXControls.HPF[i].freq(20); // initialize
    FXControls.HPFFreq[i] = 0;
    
    FXControls.chain[i] = FXControls.HPF[i].chain(FXControls.LPF[i], FXControls.delay[i], FXControls.reverb[i]);
    //FXControls.chain2[i] = FXControls.LPF[i].chain(FXControls.HPF[i], FXControls.delay[i], FXControls.reverb[i]);
  }
  
  Loop1.disconnect();
  Loop1.connect(FXControls.chain[0]);
  
  Loop2.disconnect();
  Loop2.connect(FXControls.chain[1]);

  sound1.disconnect();
  sound1.connect(FXControls.chain[2]);

  sound2.disconnect();
  sound2.connect(FXControls.chain[3]);
  
  Kick.disconnect(); // drums
  Kick.connect(FXControls.chain[4]);

  Snare.disconnect();
  Snare.connect(FXControls.chain[5]);

  Rim.disconnect();
  Rim.connect(FXControls.chain[6]);

  Hihat.disconnect();
  Hihat.connect(FXControls.chain[7]);

  Tom.disconnect();
  Tom.connect(FXControls.chain[8]);

  Clap.disconnect();
  Clap.connect(FXControls.chain[9]);

  CongaLo.disconnect();
  CongaLo.connect(FXControls.chain[10]);

  CongaHi.disconnect();
  CongaHi.connect(FXControls.chain[11]);

  // Scene 3 - Jam Board
  createClickKeyboard();
  // amp levels
  for (let i=0; i<18; i++) {
    soundObj.amp[i] = new p5.Amplitude();
  }
  soundObj.amp[0].setInput(Loop1);
  soundObj.amp[1].setInput(Loop2);
  soundObj.amp[0].toggleNormalize();
  soundObj.amp[1].toggleNormalize();
  for (let i=2; i<10; i++) {
    if (i<6)
      soundObj.amp[i].setInput(sound1);
    else
      soundObj.amp[i].setInput(sound2);
  }
  soundObj.amp[10].setInput(Kick);
  soundObj.amp[11].setInput(Snare);
  soundObj.amp[12].setInput(Rim);
  soundObj.amp[13].setInput(Hihat);
  soundObj.amp[14].setInput(Tom);
  soundObj.amp[15].setInput(Clap);
  soundObj.amp[16].setInput(CongaLo);
  soundObj.amp[17].setInput(CongaHi);

}

function windowResized() {
  resizeCanvas(windowWidth, (windowHeight/3));
}

function draw() {
  drawBackground(sceneNum);
  if (sceneNum == 1) {
    scene1();
  } else if (sceneNum == 2) {
    scene2();
  } else if (sceneNum == 3) {
    scene3();
  }
  
  /* grids - for UI 
  for (let i=1; i<=24; i++) {
    stroke(255);
    strokeWeight(1);
    line(0, 80+ i/24 * theLooper.height,windowWidth, 80+ i/24 * theLooper.height);
  } */

}

function drawBackground(p) {
  background(0, 70);
  noStroke();
  
  // draw 240 spots
  for (let i = 0; i < 240; i++) {
    
    spot.x = windowWidth/2 + Math.pow(cos(i), p) * (700 * cos(millis() * i * spot.f));
    spot.y = (windowHeight/3)/2 + tan(millis() * i * spot.f) * Math.pow(sin(i), p) * (500 * sin(millis() * i * spot.f));
  
    spot.r = map(i, 0, 200, 0, 5);
    spot.col = map(i, 100, 200, 0, 250);

    fill((250 -(p-1)*10) * sin(i), spot.col * cos(i), (250 -(p-1)*50));
    ellipseMode(RADIUS);
    if (sceneNum == 2 || sceneNum == 3)
      ellipse(spot.x + sin(soundObj.amp[0].getLevel())*100, spot.y + sin(soundObj.amp[1].getLevel())*100, spot.r + soundObj.amp[i%16+2].getLevel() * 200);
    else
      ellipse(spot.x, spot.y, spot.r);
  }

}

/* ------------------------- Navigation Buttons ------------------------- */
function createClickStart() {
  clickStart = new Clickable();
  clickStart.cornerRadius = 12;
  clickStart.textScaled = true;
  clickStart.text = "Start Project!";
  clickStart.locate(windowWidth/2-100 , (windowHeight/3)*3/4);
  clickStart.resize(200, 80);
  clickStart.onOutside = function () {
    this.color = "#58B1FF";
    this.strokeWeight = 0;
    this.textSize = 22;
    this.textColor = "#FFFFFF";
  }
  clickStart.onHover = function () {
    this.color = "#58B1FF";
    this.stroke = "#FFFFFF";
    this.strokeWeight = 3;
    this.textSize = 23;
    this.textColor = "#FFFFFF";
  }
  clickStart.onPress = function () {
    sceneNum = 2;
    showSliders();
  }
  
}

function createClickBack() {
  clickBack = new Clickable();
  clickBack.cornerRadius = 12;
  clickBack.textScaled = true;
  clickBack.text = "Back";
  clickBack.locate(40 , (windowHeight/3)*8/9);
  clickBack.resize(120, 60);
  clickBack.onOutside = function () {
    //print("scene: " + sceneNum);
    this.color = "#58B1FF";
    this.strokeWeight = 0;
    this.textSize = 22;
    this.textColor = "#FFFFFF";
  }
  clickBack.onHover = function () {
    this.color = "#58B1FF";
    this.stroke = "#FFFFFF";
    this.strokeWeight = 3;
    //this.textSize = 23;
    this.textColor = "#FFFFFF";
  }
  clickBack.onPress = function () {
    if (sceneNum == 2) {
      sceneNum = 1;
      hideSliders();
    } else if (sceneNum == 3){
      sceneNum = 2;
      showSliders();
    }

  }
  
}

function createClickNext() {
  clickNext = new Clickable();
  clickNext.cornerRadius = 12;
  clickNext.textScaled = true;
  clickNext.locate(windowWidth-160 , (windowHeight/3)*8/9);
  clickNext.resize(120, 60);
  clickNext.onOutside = function () {
    if (sceneNum == 2) {
      clickNext.text = "Next";
    } else {
      clickNext.text = "Restart";
      // reset();
    }
    this.color = "#58B1FF";
    this.strokeWeight = 0;
    this.textSize = 22;
    this.textColor = "#FFFFFF";
  }
  clickNext.onHover = function () {
    this.color = "#58B1FF";
    this.stroke = "#FFFFFF";
    this.strokeWeight = 3;
    //this.textSize = 23;
    this.textColor = "#FFFFFF";
  }
  clickNext.onPress = function () {
    if (sceneNum == 2) {
      sceneNum = 3;
      hideSliders();
    } else {
      sceneNum = 1;
      hideSliders();
    }

  }
  
}

function createClickInfo() {
  clickInfo = new Clickable();
  clickInfo.cornerRadius = 20;
  clickInfo.stroke = "#FFFFFF";
  clickInfo.strokeWeight = 3;
  clickInfo.color = "#B2B2B2";
  clickInfo.textColor = "#FFFFFF";
  clickInfo.textScaled = true;
  clickInfo.text = "i";
  clickInfo.textSize = 15;
  clickInfo.locate(windowWidth-70 , 30);
  clickInfo.resize(40, 40);
  clickInfo.onPress = function () {
    infoCount++;
    //print("count: " + infoCount);
    if (infoCount %2 == 1){ // info on
      infoIsOn = true;
      this.color = "#939393"; 
    } else if (infoCount %2 == 0) { // info off
      infoIsOn = false;
      this.color = "#B2B2B2";
    }
    this.textColor = "#FFFFFF";
  }
}


/* ------------------------- Scene 1 functions ------------------------- */

function scene1() {
  // title text
  textAlign(CENTER);
  textSize(90);
  textStyle(BOLDITALIC);
  let x1 = map(mouseX, 0, windowWidth, windowWidth/2-10, windowWidth/2+10, true);
  let y1 = map(mouseY, 0, (windowHeight/3), (windowHeight/3)*1.25/3-10, (windowHeight/3)*1.25/3+10, true);
  let y2 = map(mouseY, 0, (windowHeight/3), (windowHeight/3)*1.25/3-15, (windowHeight/3)*1.25/3+15, true);
  fill('#E4B7FF'); // purple
  text('The Sound Palette', x1, y2); 
  fill('#88C8FF'); // blue
  text('The Sound Palette', x1, y1);
  fill('#FFFFFF'); // white
  text('The Sound Palette', windowWidth/2, (windowHeight/3)*1.25/3); 
  textStyle(NORMAL);
  
  // start project button
  clickStart.draw();
}

/* ------------------------- Scene 2 functions ------------------------- */

function scene2() {
  // looper
  theLooper.drawMaster();
  theLooper.drawChannels();
  
  // sequencer
  theSequencer.drawMaster();
  theSequencer.drawSeq();
  theSequencer.drawPads();
  
  // effects
  strokeWeight(5);
  stroke('#F285CC');
  fill('#FF88D5'); 
  rect(1060, 80, 300, 560, 15);
  noStroke();
  //fill(156, 40, 184, 100); // highlight
  //ellipse(1060+ 300/2, 80+ 3/24 * 560, 50, 4);
  textSize(20);
  fill(0);
  text("Effects", 1060+ 300/2, 80+ 3/24 * 560);
  fill(156, 40, 184, 200);
  rect(1060+ 300/2 -47, 80+ 3/24 * 560 -10, 7, 6);
  rect(1060+ 300/2 +37, 80+ 3/24 * 560 -10, 7, 6);
  fill(200, 100);
  rect(1060+ 300/2 -47+2, 80+ 3/24 * 560 -10+2, 8, 6);
  rect(1060+ 300/2 +37+2, 80+ 3/24 * 560 -10+2, 8, 6);
  
  // select FX sound
  fill(0);
  textSize(16);
  text("Sound: ", 1060+ 300/2 -35, 80+ 6/24 * 560);
  FXSoundi = FXSoundSlider.value();
  text(FXSoundtxt[FXSoundi], 1060+ 300/2 +35, 80+ 6/24 * 560);
  
  // effect controls
  text("Reverb", 1060+ 300/5, 80+ 9/24 * 560);
  text("Delay", 1060+ 300/5, 80+ 12/24 * 560);
  text("Low Pass Filter", 1060+ 300/5*2 -20, 80+ 17/24 * 560);
  text("High Pass Filter", 1060+ 300/5*2 -20, 80+ 20/24 * 560);
  
  // control FX parameters
  textSize(14);
  for (let i=0; i<FXControls.numSound; i++) {
    
    if (FXSoundi == i) {
      FXControls.reverbDW[i] = reverbDWSlider.value();
      text("Dry/Wet: " + FXControls.reverbDW[i] + " %", 1060+ 300/5*4 -15, 80+ 10/24 * 560);
      //print("reverb 0: %f", FXControls.reverbDW[0]);
      //print("reverb 2: %f",FXControls.reverbDW[2]);
      //FXControls.reverb[i].drywet(FXControls.reverbDW[i]/100); // 1 = wet, 0 = dry 
      
      FXControls.delayDW[i] = delayDWSlider.value();
      text("Dry/Wet: " + FXControls.delayDW[i] + " %", 1060+ 300/5*4 -15, 80+ 13/24 * 560);
      //FXControls.delay[i].drywet(FXControls.delayDW[i]/100); // 1 = wet, 0 = dry  
      FXControls.delTime[i] = delTimeSlider.value();
      text("Time: " + FXControls.delTime[i] + " sec", 1060+ 300/5*4 -15, 80+ 15/24 * 560);
      FXControls.delay[i].delayTime(FXControls.delTime[i]); // 0 - 1 second (in effect whenerver)
     
      FXControls.LPFFreq[i] = midiToFreq(LPFFreqSlider.value());
      FXControls.LPFFreq[i] = constrain(FXControls.LPFFreq[i], 0, 22050);
      text("Freq.: " + round(FXControls.LPFFreq[i]) + " Hz", 1060+ 300/5*4 -15, 80+ 18/24 * 560);
      //FXControls.LPF[i].freq(FXControls.LPFFreq[i]); // 10 - 22000 Hz
      FXControls.HPFFreq[i] = midiToFreq(HPFFreqSlider.value());
      FXControls.HPFFreq[i] = constrain(FXControls.HPFFreq[i], 0, 22050);
      text("Freq.: " + round(FXControls.HPFFreq[i]) + " Hz", 1060+ 300/5*4 -15, 80+ 21/24 * 560);
      //FXControls.HPF[i].freq(FXControls.HPFFreq[i]); // 10 - 22000 Hz
      
      FXOnOff();
    }   
    
  }

 
  // info button
  clickInfo.draw();
  // Back button: to scene 1
  clickBack.draw();
  // Next button: to scene 3
  clickNext.draw();
  
  // display info box (Editor - user guide)
  if (infoIsOn){
    hideSliders();
    displayInfoBox();
  } else {
    showSliders();  
  }

}

function onSoundLoop() {
  soundLoop.bpm = theSequencer.bpmVal;
  soundLoop.interval = 1/ (soundLoop.bpm / 60);
  
  let noteIndex1 = (soundLoop.iterations - 1) % notePattern1.length;
  print("soundloop iteration: %f",soundLoop.iterations);
  let note1 = midiToFreq(notePattern1[noteIndex1]);
  //let noteIndex2 = (soundLoop.iterations - 1) % notePattern2.length;
  //let note2 = midiToFreq(notePattern2[noteIndex]);
  for (let i = 0; i<notePattern1.length; i++) {
    if (i == noteIndex1) {
      theSequencer.seq1[i].strokeWeight = 3;
      theSequencer.seq2[i].strokeWeight = 3;
      theSequencer.seq1[i].stroke = "yellow";
      theSequencer.seq2[i].stroke = "yellow";
    }
    else {
      theSequencer.seq1[i].strokeWeight = 2;
      theSequencer.seq2[i].strokeWeight = 2;
      theSequencer.seq1[i].stroke = "black";
      theSequencer.seq2[i].stroke = "black";     
    }
  }
  sound1.start();
  sound2.start();
  sound1.freq(note1, 0.05);
  sound1.amp(amp1[noteIndex1], 0.1); // amp1[noteIndex1]
  sound1.amp(0, 0.12, dur1[noteIndex1]); // fades out
  sound2.freq(note1, 0.05);
  sound2.amp(amp2[noteIndex1], 0.1); // amp2[noteIndex1]
  sound2.amp(0, 0.12, dur2[noteIndex1]); // fades out
}

function FXOnOff() {
  
  if (looperFX1Count %2 == 1) { // FX on
    print("reverb 0: %f", FXControls.reverbDW[0]);
    FXControls.reverb[0].drywet(FXControls.reverbDW[0]/100); // 1 = wet, 0 = dry
    FXControls.delay[0].drywet(FXControls.delayDW[0]/100); // 1 = wet, 0 = dry
    FXControls.LPF[0].freq(FXControls.LPFFreq[0]); // 10 - 22000 Hz
    FXControls.HPF[0].freq(FXControls.HPFFreq[0]); // 10 - 22000 Hz
  } else {
    FXControls.reverb[0].drywet(0);
    FXControls.delay[0].drywet(0);
    FXControls.LPF[0].freq(22050);
    FXControls.HPF[0].freq(0);
  }
  if (looperFX2Count %2 == 1) { // FX on
    FXControls.reverb[1].drywet(FXControls.reverbDW[1]/100); // 1 = wet, 0 = dry
    FXControls.delay[1].drywet(FXControls.delayDW[1]/100); // 1 = wet, 0 = dry
    FXControls.LPF[1].freq(FXControls.LPFFreq[1]); // 10 - 22000 Hz
    FXControls.HPF[1].freq(FXControls.HPFFreq[1]); // 10 - 22000 Hz
  } else {
    FXControls.reverb[1].drywet(0);
    FXControls.delay[1].drywet(0);
    FXControls.LPF[1].freq(22050);
    FXControls.HPF[1].freq(0);
  }
  if (seqFX1Count %2 == 1) { // FX on
    //print(theSequencer.FX1isOn);
    FXControls.reverb[2].drywet(FXControls.reverbDW[2]/100); // 1 = wet, 0 = dry
    FXControls.delay[2].drywet(FXControls.delayDW[2]/100); // 1 = wet, 0 = dry
    FXControls.LPF[2].freq(FXControls.LPFFreq[2]); // 10 - 22000 Hz
    FXControls.HPF[2].freq(FXControls.HPFFreq[2]); // 10 - 22000 Hz
  } else {
    FXControls.reverb[2].drywet(0);
    FXControls.delay[2].drywet(0);
    FXControls.LPF[2].freq(22050);
    FXControls.HPF[2].freq(0);
  }
  if (seqFX2Count %2 == 1) { // FX on
    FXControls.reverb[3].drywet(FXControls.reverbDW[3]/100); // 1 = wet, 0 = dry
    FXControls.delay[3].drywet(FXControls.delayDW[3]/100); // 1 = wet, 0 = dry
    FXControls.LPF[3].freq(FXControls.LPFFreq[3]); // 10 - 22000 Hz
    FXControls.HPF[3].freq(FXControls.HPFFreq[3]); // 10 - 22000 Hz
  } else {
    FXControls.reverb[3].drywet(0);
    FXControls.delay[3].drywet(0);
    FXControls.LPF[3].freq(22050);
    FXControls.HPF[3].freq(0);
  }
  if (FXpadsCount %2 == 1) { // FX on
    print("drum fx on");
    for (let i=4; i<12; i++) {
      FXControls.reverb[i].drywet(FXControls.reverbDW[i]/100); // 1 = wet, 0 = dry
      FXControls.delay[i].drywet(FXControls.delayDW[i]/100); // 1 = wet, 0 = dry
      FXControls.LPF[i].freq(FXControls.LPFFreq[i]); // 10 - 22000 Hz
      FXControls.HPF[i].freq(FXControls.HPFFreq[i]); // 10 - 22000 Hz
      print(FXControls.reverbDW[i]);
    }
  } else {
    for (let i=4; i<12; i++) {
      FXControls.reverb[i].drywet(0);
      FXControls.delay[i].drywet(0);
      FXControls.LPF[i].freq(22050);
      FXControls.HPF[i].freq(0);      
    }
  }
  
}

/* ------------------------- Scene 3 functions ------------------------- */
function createClickKeyboard() {
      for (let i = 0; i<18; i++) {
        soundObj.click[i] = new Clickable();

        soundObj.click[i].cornerRadius = 25;
        soundObj.click[i].strokeWeight = 2;
        soundObj.click[i].stroke = "#FFFFFF";
        soundObj.click[i].color = color(0,0,0,50);
        soundObj.click[i].textColor = "#FFFFFF";
        soundObj.click[i].text = "";
        soundObj.click[i].textSize = 14;
        if (i==0) { // loop1
          soundObj.click[0].locate(windowWidth/7 +70, 14/24 * (windowHeight/3));
          soundObj.click[0].onOutside = function () {
            this.text = "Loop 1";
          }
          soundObj.click[0].onPress = function () {
            this.color = soundObj.color[0];
            if (((!Loop1.isLooping() || !Loop1.isPlaying()) && !onRec1) && looperRec1Count >= 3) {
              Loop1.play();
            } else if (Loop1.isLooping() || Loop1.isPlaying()) {
              Loop1.stop();
            }
          } 
          soundObj.click[0].onRelease = function () {
            this.color = color(0,0,0,50);  
          }
        } else if (i==1) { // loop2
          soundObj.click[1].locate(windowWidth/7 +70, 17/24 * (windowHeight/3));
          soundObj.click[1].onOutside = function () {
            this.text = "Loop 2";
          }
          soundObj.click[1].onPress = function () {
            this.color = soundObj.color[1];
            if (((!Loop2.isLooping() || !Loop2.isPlaying()) && !onRec2) && looperRec2Count >= 3) {
              Loop2.play();
            } else if (Loop2.isLooping() || Loop2.isPlaying()) {
              Loop2.stop();
            }
          } 
          soundObj.click[1].onRelease = function () {
            this.color = color(0,0,0,50);  
          }
        } else if (i>=2 && i<=9) { // synth
          soundObj.click[i].locate(windowWidth/10 * (i-1) +50, 9/24 * (windowHeight/3) +sin(round(i))*50);
          soundObj.click[i].onOutside = function () {
            this.text = pitch[notePattern1[(i-2)%4] % pitch.length];
          }
          soundObj.click[i].onPress = function () {
            this.color = soundObj.color[i];
            if (i<6) {
              sound1.start();
              sound1.freq(midiToFreq(notePattern1[(i-2)%4]), 0.05);
              sound1.amp(0.2, 0.1); 
              sound1.amp(0, 0.16, dur1[(i-2)%4]); // fades out
            } else {
              sound2.start();
              sound2.freq(midiToFreq(notePattern1[(i-2)%4]), 0.05);
              sound2.amp(0.2, 0.1); 
              sound2.amp(0, 0.16, dur2[(i-2)%4]); // fades out
            }
          } 
          soundObj.click[i].onRelease = function () {
            this.color = color(0,0,0,50);    
          } 
        } else if (i>=10 && i<=13){ //drums
          soundObj.click[i].locate(windowWidth/7 *(i%5 +2) +70, 14/24 * (windowHeight/3));
        } else if (i>=14 && i<=17) { // drums
          soundObj.click[i].locate(windowWidth/7 *((i+2)%5+1) +70, 17/24 * (windowHeight/3));
          print((i+2)%5+1);
        }
        soundObj.click[i].resize(50, 50);
        soundObj.click[i].onHover = function () {
          this.text = soundObj.keyTxt[i];
        }  
    }

    soundObj.click[10].onOutside = function () {
      this.text = "Kick";
    }
    soundObj.click[10].onPress = function () {
      this.color = soundObj.color[10];
      userStartAudio();
      Kick.play();
    } 
    soundObj.click[10].onRelease = function () {
      this.color = color(0,0,0,50);
      Kick.stop();    
    } 
    soundObj.click[11].onOutside = function () {
      this.text = "Snare";
    }
    soundObj.click[11].onPress = function () {
      this.color = soundObj.color[11];
      userStartAudio();
      Snare.play();
    } 
    soundObj.click[11].onRelease = function () {
      this.color = color(0,0,0,50);
      Snare.stop();    
    }
    soundObj.click[12].onOutside = function () {
      this.text = "Rim";
    }
    soundObj.click[12].onPress = function () {
      this.color = soundObj.color[12];
      userStartAudio();
      Rim.play();
    } 
    soundObj.click[12].onRelease = function () {
      this.color = color(0,0,0,50);
      Rim.stop();    
    }
    soundObj.click[13].onOutside = function () {
      this.text = "Hi-Hat";
    }
    soundObj.click[13].onPress = function () {
      this.color = soundObj.color[13];
      userStartAudio();
      Hihat.play();
    } 
    soundObj.click[13].onRelease = function () {
      this.color = color(0,0,0,50);
      Hihat.stop();    
    }
    soundObj.click[14].onOutside = function () {
      this.text = "Tom";
    }
    soundObj.click[14].onPress = function () {
      this.color = soundObj.color[14];
      userStartAudio();
      Tom.play();
    } 
    soundObj.click[14].onRelease = function () {
      this.color = color(0,0,0,50);
      Tom.stop();    
    }
    soundObj.click[15].onOutside = function () {
      this.text = "Clap";
    }
    soundObj.click[15].onPress = function () {
      this.color = soundObj.color[15];
      userStartAudio();
      Clap.play();
    } 
    soundObj.click[15].onRelease = function () {
      this.color = color(0,0,0,50);
      Clap.stop();    
    }
    soundObj.click[16].onOutside = function () {
      this.text = " Conga \n Low";
    }
    soundObj.click[16].onPress = function () {
      this.color = soundObj.color[16];
      userStartAudio();
      CongaLo.play();
    } 
    soundObj.click[16].onRelease = function () {
      this.color = color(0,0,0,50);
      CongaLo.stop();    
    }
    soundObj.click[17].onOutside = function () {
      this.text = " Conga \n High";
    }
    soundObj.click[17].onPress = function () {
      this.color = soundObj.color[17];
      userStartAudio();
      CongaHi.play();
    } 
    soundObj.click[17].onRelease = function () {
      this.color = color(0,0,0,50);
      CongaHi.stop();    
    }
  
}

function scene3() {
  // draw keyboard (jam board)
  for (let i = 0; i<18; i++) {
    soundObj.click[i].draw();      
  }
  
  // info button
  clickInfo.draw();
  // Back button: to scene 2
  clickBack.draw();
  // Next button: to scene 1
  clickNext.draw();
  
  // display info box (Jam Board - user guide)
  if (infoIsOn){ // info on
    displayInfoBox();
  } 
  
}
/* ------------------------- conditional functions ------------------------- */
function keyTyped() {
  
  if (sceneNum == 2 || sceneNum == 3) {
    userStartAudio();
    
    if (sceneNum == 3) {
      // sequencer 2 sounds / 8 notes
      if (key === 'w') { 
        soundObj.click[2].color = soundObj.color[2];
        sound1.start();
        sound1.freq(midiToFreq(notePattern1[0]), 0.05);
        sound1.amp(0.4, 0.1); 
        sound1.amp(0, 0.16, dur1[0]); // fades out
      } else if (key === 'e') {
        soundObj.click[3].color = soundObj.color[3];
        sound1.start();
        sound1.freq(midiToFreq(notePattern1[1]), 0.05);
        sound1.amp(0.4, 0.1); 
        sound1.amp(0, 0.16, dur1[1]); // fades out
      } else if (key === 'r') {
        soundObj.click[4].color = soundObj.color[4];
        sound1.start();
        sound1.freq(midiToFreq(notePattern1[2]), 0.05);
        sound1.amp(0.4, 0.1); 
        sound1.amp(0, 0.16, dur1[2]); // fades out
      } else if (key === 't') {
        soundObj.click[5].color = soundObj.color[5];
        sound1.start();
        sound1.freq(midiToFreq(notePattern1[3]), 0.05);
        sound1.amp(0.4, 0.1); 
        sound1.amp(0, 0.16, dur1[3]); // fades out
      } else if (key === 'y') {
        soundObj.click[6].color = soundObj.color[6];
        sound2.start();
        sound2.freq(midiToFreq(notePattern1[0]), 0.05);
        sound2.amp(0.2, 0.1); 
        sound2.amp(0, 0.16, dur2[0]); // fades out
      } else if (key === 'u') {
        soundObj.click[7].color = soundObj.color[7];
        sound2.start();
        sound2.freq(midiToFreq(notePattern1[1]), 0.05);
        sound2.amp(0.2, 0.1); 
        sound2.amp(0, 0.16, dur2[1]); // fades out
      } else if (key === 'i') {
        soundObj.click[8].color = soundObj.color[8];
        sound2.start();
        sound2.freq(midiToFreq(notePattern1[2]), 0.05);
        sound2.amp(0.2, 0.1); 
        sound2.amp(0, 0.16, dur2[2]); // fades out
      } else if (key === 'o') {
        soundObj.click[9].color = soundObj.color[9];
        sound2.start();
        sound2.freq(midiToFreq(notePattern1[3]), 0.05);
        sound2.amp(0.2, 0.1); 
        sound2.amp(0, 0.16, dur2[3]); // fades out
      }

      // looper ch1,2
      if (key === 'd') {
        soundObj.click[0].color = soundObj.color[0];
        if (((!Loop1.isLooping() || !Loop1.isPlaying()) && !onRec1) && looperRec1Count >= 3) {
          Loop1.play();
        } else if (Loop1.isLooping() || Loop1.isPlaying()) {
          Loop1.stop();
        }
      } else if (key === 'c') {
        soundObj.click[1].color = soundObj.color[1];
        if (((!Loop2.isLooping() || !Loop2.isPlaying()) && !onRec2) && looperRec2Count >= 3) {
          Loop2.play();
        } else if (Loop2.isLooping() || Loop2.isPlaying()) {
          Loop2.stop();
        }         
      } 
    }
    
    // drum pads
    if (key === 'f') { 
      Kick.play();
      if (sceneNum == 2)
        theSequencer.pads[0].color = "#939393";
      else if (sceneNum == 3)
        soundObj.click[10].color = soundObj.color[10];
    } else if (key === 'g') {
      Snare.play();
      if (sceneNum == 2)
        theSequencer.pads[1].color = "#939393";
      else if (sceneNum == 3)
        soundObj.click[11].color = soundObj.color[11];
    } else if (key === 'h') {
      Rim.play();
      if (sceneNum == 2)
        theSequencer.pads[2].color = "#939393";
      else if (sceneNum == 3)
        soundObj.click[12].color = soundObj.color[12];
    } else if (key === 'j') {
      Hihat.play();
      if (sceneNum == 2)
        theSequencer.pads[3].color = "#939393";
      else if (sceneNum == 3)
        soundObj.click[13].color = soundObj.color[13];
    } else if (key === 'v') {
      Tom.play();
      if (sceneNum == 2)
        theSequencer.pads[4].color = "#939393";
      else if (sceneNum == 3)
        soundObj.click[14].color = soundObj.color[14];
    } else if (key === 'b') {
      Clap.play();
      if (sceneNum == 2)
        theSequencer.pads[5].color = "#939393";
      else if (sceneNum == 3)
        soundObj.click[15].color = soundObj.color[15];
    } else if (key === 'n') {
      CongaLo.play();
      if (sceneNum == 2)
        theSequencer.pads[6].color = "#939393";
      else if (sceneNum == 3)
        soundObj.click[16].color = soundObj.color[16];
    } else if (key === 'm') {
      CongaHi.play();
      if (sceneNum == 2)
        theSequencer.pads[7].color = "#939393";
      else if (sceneNum == 3)
        soundObj.click[17].color = soundObj.color[17];
    } 
    
  }

  // prevent any default behavior
  return false;
}

function keyReleased() {
  
  if (sceneNum == 2) {
    for (let i = 0; i < 8; i++) {
      theSequencer.pads[i].color = "#B2B2B2";
    }
  }
  
  if (sceneNum == 3) {
    for (let i = 0; i < 18; i++) {
      soundObj.click[i].color = color(0,0,0,50);
    }
  } 

  // prevent any default behavior
  return false;
}

function displayInfoBox() {
    // background
    fill(180);
    stroke(255, 100);
    strokeWeight(3);
    rectMode(CENTER);
    rect(windowWidth/2, (windowHeight/3)/2 -30, windowWidth*7/8, (windowHeight/3)*5/8, 10);
    rectMode(CORNER);
  
  if (sceneNum == 2) {
    // texts
    textWrap(WORD);
    textSize(20);
    textAlign(CENTER);
    stroke(255);
    text('Welcome to Editor', windowWidth/2, (windowHeight/3)/24*5);
    textSize(15);
    fill(0);
    noStroke();
    text('The Editor features 4 main sections: Looper, Sequencer, Drum Pads, and Effects. This is where you can design your sound and play your jam! \n * It is highly recommended that you start using the features in a left to right order, i.e. Looper, Sequencer, Effects', windowWidth/2, (windowHeight/3)/24*6);
    textAlign(LEFT);
    // Looper
    text('Looper', windowWidth/9, (windowHeight/3)/24*8);
    textSize(12);
    text('There are 2 channels in the looper. \n(Check manual for details)', windowWidth/9, (windowHeight/3)/24*9, windowWidth/9*2);
    text('\n\nStep 1: Record your loops and start the playbacks. \n\nStep 2: Adjust volume and apply effects to your liking. \n\nStep 3: Hit “Stop” and then “Play” to playback the two channels at the same time.', windowWidth/9, (windowHeight/3)/24*10, windowWidth/9*2);
    // Sequencer
    textSize(15);
    text('Sequencer', windowWidth/9*3+30, (windowHeight/3)/24*8);
    textSize(12);
    text('There are 2 channels in the 4-step sequencer. \n(Check manual for details)', windowWidth/9*3+30, (windowHeight/3)/24*9, windowWidth/9*2);
    text('\n\nStep 1: Toggle on the sequence pads to your desired steps. \nStep 2: Hit “!!!” to randomize note patterns to your liking. \n\nStep 3: Adjust bpm and apply effects to your liking. \n\nStep 4: Hit “Play” to playback your sequence.', windowWidth/9*3+30, (windowHeight/3)/24*10, windowWidth/9*2);    
    // Drum Pads
    textSize(15);
    text('Drum Pads', windowWidth/9*5+60, (windowHeight/3)/24*8);
    textSize(12);
    text('There are 8 drum sounds on the drum pads. \n(Check manual for details)', windowWidth/9*5+60, (windowHeight/3)/24*9, windowWidth/9*3);
    text('\n\nStep 1: Press the pads to play drums. \n\nStep 2: Adjust volume, and apply effects to your liking.', windowWidth/9*5+60, (windowHeight/3)/24*10, windowWidth/9*3); 
    // Effects
    textSize(15);
    text('Effects', windowWidth/9*5+60, (windowHeight/3)/24*14);
    textSize(12);
    text('There are 5 adjustable parameters inside the effect chain (bottom up) and applicable to 12 sounds from loops, synth sequences, and drums. The functions from top to bottom are: ', windowWidth/9*5+60, (windowHeight/3)/24*15, windowWidth/9*3 -100);
    text('\n\nReverb Dry/Wet, Delay Dry/Wet, Delay time, Low Pass Filter cutoff frequency, High Pass Filter cutoff frequency.', windowWidth/9*5+60, (windowHeight/3)/24*16, windowWidth/9*3 -100);
    
    
  } else if (sceneNum == 3) {
    // texts
    textWrap(WORD);
    textSize(20);
    textAlign(CENTER);
    stroke(255);
    text('Welcome to Jam Board', windowWidth/2, (windowHeight/3)/24*5);
    textSize(15);
    fill(0);
    noStroke();
    textAlign(LEFT);
    text('The Jam Board features 16 buttons clickable for playing sounds from the Looper, Sequencer, Drum Pads. The sounds can also be played by computer keys. This is where you can jam your sounds and visualize your jam in act! \n\n\nFeatures of the board: The top section represents the notes of synths, and the bottom section from left to right are loops and drums. Hover on each button to see the computer key mapped for playback.', windowWidth/9, (windowHeight/3)/24*7, windowWidth/9*7);

  }
    
}

function showSliders() {
  theSequencer.bpmSlider.show();
  FXSoundSlider.show();
  reverbDWSlider.show();
  delayDWSlider.show();
  delTimeSlider.show();
  LPFFreqSlider.show();
  HPFFreqSlider.show();
}

function hideSliders() {
  theSequencer.bpmSlider.hide();
  FXSoundSlider.hide();
  reverbDWSlider.hide();
  delayDWSlider.hide();
  delTimeSlider.hide();
  LPFFreqSlider.hide();
  HPFFreqSlider.hide();
}

function mousePressed() {
  // get mouse press location & millisecond 
  print("xi:" + mouseX, "yi: " + mouseY, "ms: " + millis());
  
  // knob activation
  theLooper.vol1Knob.active();
  theLooper.vol2Knob.active();
  theSequencer.padVolKnob.active();
}

function mouseReleased() {
  // knob deactivation
  theLooper.vol1Knob.inactive();
  theLooper.vol2Knob.inactive();
  theSequencer.padVolKnob.inactive();
  
}