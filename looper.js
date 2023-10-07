class looper { 
  constructor(channel) {
    this.channel = channel; // number of channels
    this.width = 300;
    this.height = 560;
    this.looperPlay = new Clickable();
    this.looperStop = new Clickable();
    this.looperRec1 = new Clickable();
    this.looperRec2 = new Clickable();
    this.looperFX1 = new Clickable();
    this.looperFX2 = new Clickable();
    this.vol1Knob = new MakeKnobC("#FFFFFF", 25, 195, 80+ 16/24 * this.height + 30, 0.0, 1.0, 0.8, 2, "vol", "#000000", 15);
    this.vol1 = 0;
    this.vol2Knob = new MakeKnobC("#FFFFFF", 25, 265, 80+ 16/24 * this.height + 30, 0.0, 1.0, 0.8, 2, "vol", "#000000", 15);
    this.vol2 = 0;
  }
  
  // call in setup
  createClickMaster() {
    // master play
    this.looperPlay.cornerRadius = 0;
    this.looperPlay.strokeWeight = 0;
    this.looperPlay.color = "#B2B2B2";
    this.looperPlay.textColor = "#FFFFFF";
    this.looperPlay.textScaled = true;
    this.looperPlay.text = "Play";
    this.looperPlay.textSize = 20;
    this.looperPlay.locate(170 , 80+ 5/24 * this.height);
    this.looperPlay.resize(50, 50);
    this.looperPlay.onPress = function () {
      this.color = "#939393";
      
      userStartAudio();
      
      if (((!Loop1.isLooping() || !Loop1.isPlaying()) && !onRec1) && looperRec1Count >= 3) {
        //print("loop1 is loaded!");
        Loop1.loop();
      } 
      if (((!Loop2.isLooping() || !Loop2.isPlaying()) && !onRec2) && looperRec2Count >= 3) {
        //print("loop2 is loaded!");
        Loop2.loop();
      } 

    } 
    
    // master stop
    this.looperStop.cornerRadius = 0;
    this.looperStop.strokeWeight = 0;
    this.looperStop.color = "#B2B2B2";
    this.looperStop.textColor = "#FFFFFF";
    this.looperStop.textScaled = true;
    this.looperStop.text = "Stop";
    this.looperStop.textSize = 20;
    this.looperStop.locate(240 , 80+ 5/24 * this.height);
    this.looperStop.resize(50, 50);
    this.looperStop.onPress = function () {
      if ((Loop1.isLooping() || Loop2.isLooping())) {
        Loop1.stop();
        Loop2.stop();
      }
      print("count 1: %f", looperRec1Count);
      print("count 2: %f", looperRec2Count);
    }

  }
  
  drawMaster() {
    // looper background
    strokeWeight(5);
    stroke('#C882F3');
    fill('#D287FF'); // purple
    rect(80, 80, this.width, this.height, 15);
    noStroke();
    //fill(156, 40, 184, 100); // highlight
    //ellipse(80+ this.width/2, 80+ 3/24 * this.height, 50, 4);
    //fill(156, 40, 184);
    //ellipse(80+ this.width/2 -45, 80+ 3/24 * this.height -5, 4, 3);
    //ellipse(80+ this.width/2 +45, 80+ 3/24 * this.height -5, 4, 3);
    fill(0);
    textSize(20);
    text("Looper", 80+ this.width/2, 80+ 3/24 * this.height);
    fill(156, 40, 184, 200);
    rect(80+ this.width/2 -47, 80+ 3/24 * this.height -10, 7, 6);
    rect(80+ this.width/2 +37, 80+ 3/24 * this.height -10, 7, 6);
    fill(200, 100);
    rect(80+ this.width/2 -47+2, 80+ 3/24 * this.height -10+2, 8, 6);
    rect(80+ this.width/2 +37+2, 80+ 3/24 * this.height -10+2, 8, 6);
    
    // master play
    this.looperPlay.draw();
    this.looperStop.draw();
    if (!Loop1.isLooping() && !Loop2.isLooping()) {
      this.looperPlay.color = "#B2B2B2"; // color change upon stop
    }
    
  }
  
  // call in setup
  createChannelControls() {
    
    // create an audio in
    mic1 = new p5.AudioIn();

    // prompts user to enable their browser mic
    mic1.start();

    // create a sound recorder
    recorder1 = new p5.SoundRecorder();

    // connect the mic to the recorder
    recorder1.setInput(mic1);

    // this sound file will be used to
    // playback & save the recording
    Loop1 = new p5.SoundFile();
    Loop2 = new p5.SoundFile();
    
    // rec 1
    this.looperRec1.cornerRadius = 5;
    this.looperRec1.strokeWeight = 0;
    this.looperRec1.color = "#B2B2B2";
    this.looperRec1.textColor = "#FFFFFF";
    this.looperRec1.text = "REC";
    this.looperRec1.textSize = 10;
    this.looperRec1.locate(180 , 80+ 12/24 * this.height);
    this.looperRec1.resize(30, 30);
    this.looperRec1.onPress = function () {
      
      userStartAudio();
      
      if ((!Loop1.isLooping() && !onRec1) && looperRec1Count > 3) {
        print("loop1 is loaded!");
        Loop1.loop();
      }  
      
      if (looperRec1Count %3 == 0 && (mic1.enabled && !onRec2)){ // on rec
        this.color = "#939393"; 
        this.textColor = "#000000";     
        if (looperRec1Count > 3)
          Loop1.stop();
        recorder1.record(Loop1);
        print("loop 1 recording!");
        onRec1 = true;
        looperRec1Count++;
      } else if (looperRec1Count %3 == 1){ // stop rec
        this.color = "#B2B2B2";
        this.textColor = "#FFFFFF";
        recorder1.stop();
        print("loop1 stop rec!");
        onRec1 = false;
        looperRec1Count++;
      }
      
    } 
    this.looperRec1.onRelease = function () { // loop start

      if (looperRec1Count %3 == 2) {
        this.color = "#B2B2B2";
        this.textColor = "#FFFFFF";  
        if (typeof Loop1 !== 'undefined') {
          Loop1.loop();
          print("loop1 is looping!");
        } else
          print("error: Loop1 is undefined");
        looperRec1Count++;
      }
      
    }
    
    // rec 2
    this.looperRec2.cornerRadius = 5;
    this.looperRec2.strokeWeight = 0;
    this.looperRec2.color = "#B2B2B2";
    this.looperRec2.textColor = "#FFFFFF";
    this.looperRec2.text = "REC";
    this.looperRec2.textSize = 10;
    this.looperRec2.locate(250 , 80+ 12/24 * this.height);
    this.looperRec2.resize(30, 30);
    this.looperRec2.onPress = function () {
      
      userStartAudio();
      
      if ((!Loop2.isLooping() && !onRec2) && looperRec2Count > 3) {
        print("loop2 is loaded!");
        Loop2.loop();
      }  
      
      if (looperRec2Count %3 == 0 && (mic1.enabled && !onRec1)){ // on rec
        this.color = "#939393"; 
        this.textColor = "#000000";     
        if (looperRec2Count > 3)
          Loop2.stop();
        recorder1.record(Loop2);
        print("loop 2 recording!");
        onRec2 = true;
        looperRec2Count++;
      } else if (looperRec2Count %3 == 1){ // stop rec
        this.color = "#B2B2B2";
        this.textColor = "#FFFFFF";
        recorder1.stop();
        print("loop2 stop rec!");
        onRec2 = false;
        looperRec2Count++;
      }
      
    } 
    this.looperRec2.onRelease = function () { // loop start
      print(typeof Loop2);
      if (looperRec2Count %3 == 2) {
        this.color = "#B2B2B2";
        this.textColor = "#FFFFFF"; 
        if (typeof Loop2 !== 'undefined') {
          Loop2.loop();
        } else
          print("error: Loop2 is undefined");
        looperRec2Count++;
      }
      
    }
    
    // FX 1
    this.looperFX1.cornerRadius = 5;
    this.looperFX1.strokeWeight = 0;
    this.looperFX1.color = "#B2B2B2";
    this.looperFX1.textColor = "#FFFFFF";
    this.looperFX1.textScaled = true;
    this.looperFX1.text = "FX";
    this.looperFX1.locate(180 , 80+ 14/24 * this.height);
    this.looperFX1.resize(30, 30);
    this.looperFX1.onPress = function () {
      looperFX1Count++;
      if (looperFX1Count %2 == 1){ // on
        this.color = "#939393"; 
        this.textColor = "#000000";
      } else { // off
        this.color = "#B2B2B2";
        this.textColor = "#FFFFFF";
        
      }
      //print("count 1: %f", looperFX1Count);

    }
    
    // FX 2
    this.looperFX2.cornerRadius = 5;
    this.looperFX2.strokeWeight = 0;
    this.looperFX2.color = "#B2B2B2";
    this.looperFX2.textColor = "#FFFFFF";
    this.looperFX2.textScaled = true;
    this.looperFX2.text = "FX";
    this.looperFX2.locate(250 , 80+ 14/24 * this.height);
    this.looperFX2.resize(30, 30);
    this.looperFX2.onPress = function () {
      looperFX2Count++;
      if (looperFX2Count %2 == 1){ // on
        this.color = "#939393"; 
        this.textColor = "#000000";
      } else { // off
        this.color = "#B2B2B2";
        this.textColor = "#FFFFFF";
        
      }
      //print("count 2: %f", looperFX2Count);
    } 
    
  }
  
  drawChannels() {
    
    // channel numbers
    textSize(20);
    fill(0);
    text("1", 195, 80+ 10/24 * this.height);
    text("2", 265, 80+ 10/24 * this.height);
    
    // indication light   
    if (Loop1.isLooping()) {
      strokeWeight(2);
      stroke(0);
      if (onRec1)
        fill("red");
      else
        fill("yellow");
      ellipse(195, 80+ 11/24 * this.height, 8, 8);
      
    } else if (!Loop1.isLooping()){
      strokeWeight(2);
      stroke(0);
      if (onRec1)
        fill("red");
      else
        fill("#B2B2B2");
      ellipse(195, 80+ 11/24 * this.height, 8, 8);
      
    }
    if (Loop2.isLooping()) {
      strokeWeight(2);
      stroke(0);
      if (onRec2)
        fill("red");
      else
        fill("yellow");
      ellipse(265, 80+ 11/24 * this.height, 8, 8);
      
    } else if (!Loop2.isLooping()){
      strokeWeight(2);
      stroke(0);
      if (onRec2)
        fill("red");
      else
        fill("#B2B2B2");
      ellipse(265, 80+ 11/24 * this.height, 8, 8);
    }
    
    // rec button
    this.looperRec1.draw();
    this.looperRec2.draw();
    
    // FX button
    this.looperFX1.draw();
    this.looperFX2.draw();
    
    // volume knob
    noStroke();
    this.vol1Knob.update();
    this.vol1 = this.vol1Knob.knobValue;
    Loop1.setVolume(this.vol1*1.8, 0.3); // gained
    this.vol2Knob.update();
    this.vol2 = this.vol2Knob.knobValue;
    Loop2.setVolume(this.vol2*1.8, 0.3); // gained

  }
  
} // end of looper class