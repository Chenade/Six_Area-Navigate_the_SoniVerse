class sequencer { // start location: 400, 80
  constructor() {
    this.width = 640;
    this.height = 560;
    this.seqPlay = new Clickable();
    this.seqStop = new Clickable();
    this.bpmSlider = createSlider(40, 160, 100, 1);
    this.bpmVal = 100;
    this.seq1 = [];
    this.seq2 = [];
    this.seqRandom = new Clickable();
    this.seqFX1 = new Clickable();
    this.seqFX2 = new Clickable();
    this.FXpads = new Clickable();
    this.pads = [];
    this.padsi = ["Kick", "Snare", "Rim", "Hi-Hat", "Tom", "Clap", " Conga \n Low", " Conga \n High"];
    this.padVolKnob = new MakeKnobC("#FFFFFF", 25, 400 + 1/6 * this.width, 80+ 17/24 * this.height, 0.0, 1.0, 0.8, 2, "vol", "#000000", 15);
    this.padVol = 0;
  }
  
  // call in setup
  createMaster() {
    // master play
    this.seqPlay.cornerRadius = 0;
    this.seqPlay.strokeWeight = 0;
    this.seqPlay.color = "#B2B2B2";
    this.seqPlay.textColor = "#FFFFFF";
    this.seqPlay.textScaled = true;
    this.seqPlay.text = "Play";
    this.seqPlay.textSize = 20;
    this.seqPlay.locate(400+ this.width *1/5 -40, 80+ 2/24 * this.height);
    this.seqPlay.resize(50, 50);
    this.seqPlay.onPress = function () {
      this.color = "#939393";

      if (!soundLoop.isPlaying) {
        // start the loop
        soundLoop.start();
        //sound1.start();
        //sound2.start();
      }

    } 
    
    // master stop
    this.seqStop.cornerRadius = 0;
    this.seqStop.strokeWeight = 0;
    this.seqStop.color = "#B2B2B2";
    this.seqStop.textColor = "#FFFFFF";
    this.seqStop.textScaled = true;
    this.seqStop.text = "Stop";
    this.seqStop.textSize = 20;
    this.seqStop.locate(400+ this.width *1/5 +40, 80+ 2/24 * this.height);
    this.seqStop.resize(50, 50);
    this.seqStop.onPress = function () {
      
      if (soundLoop.isPlaying) {
        soundLoop.stop();
      }

    }
    
    // bpm slider
    this.bpmSlider.position(400+ this.width *4/5 -60, 80+ 3/24 * this.height);
    this.bpmSlider.style('width', '120px');
    this.bpmSlider.hide();


  }
  
  drawMaster() {
    // sequencer background
    // looper background
    strokeWeight(5);
    stroke('#81BDF1');
    fill('#88C8FF'); // blue 
    rect(400, 80, this.width, this.height, 15);
    noStroke();
    fill(156, 40, 184, 100); // highlight
    ellipse(400+ this.width/2, 80+ 3/24 * this.height, 60, 4);
    fill(0);
    textSize(20);
    text("Sequencer", 400+ this.width/2, 80+ 3/24 * this.height);
    
    // master play / stop
    this.seqPlay.draw();
    this.seqStop.draw();
    if (!soundLoop.isPlaying) {
      this.seqPlay.color = "#B2B2B2"; // color change upon stop
      for (let i = 0; i<4; i++) {
        this.seq1[i].strokeWeight = 2;
        this.seq2[i].strokeWeight = 2;
        this.seq1[i].stroke = "black";
        this.seq2[i].stroke = "black";      
      } 
    }
    
    // bpm
    if (sceneNum == 2)
      this.bpmSlider.show();
    else
      this.bpmSlider.hide();
    textSize(15);
    text("bpm", 400+ this.width *4/5 -15 , 80+ 3/24 * this.height -10);
    this.bpmVal = this.bpmSlider.value();
    text(this.bpmVal, 400+ this.width *4/5 +15, 80+ 3/24 * this.height -10);
    
    // Drum Pads text
    fill(156, 40, 184, 100); // highlight
    ellipse(400+ this.width/2, 80+ 15/24 * this.height, 60, 4);
    fill(0);
    textSize(20);
    text("Drum Pads", 400+ this.width/2, 80+ 15/24 * this.height);
    
  }
  
  createSeq() {
    // seq 1
    for (let i = 0; i<4; i++) {
      this.seq1[i] = new Clickable();
      this.seq1[i].cornerRadius = 10;
      this.seq1[i].strokeWeight = 2;
      this.seq1[i].color = "#B2B2B2";
      this.seq1[i].text = "";
      this.seq1[i].locate(400+ this.width/8 *(i+3) +10, 80+ 6/24 * this.height);
      this.seq1[i].resize(50, 50);
      this.seq1[i].onHover = function () {
        this.text = pitch[notePattern1[i] % pitch.length];
      }
      this.seq1[i].onOutside = function () {
        this.text = "";
      }
      this.seq1[i].onPress = function () {
        seq1Count[i]++;
        if (seq1Count[i] %2 == 1){ // on
          this.color = "yellow"; 
          amp1[i] = 0.5;
          dur1[i] = random(0.3, 0.4);

        } else { // off
          this.color = "#B2B2B2";
          amp1[i] = 0;
        }
      }
    }
    
    // seq 2
    for (let i = 0; i<4; i++) {
      this.seq2[i] = new Clickable();
      this.seq2[i].cornerRadius = 10;
      this.seq2[i].strokeWeight = 2;
      this.seq2[i].color = "#B2B2B2";
      this.seq2[i].text = "";
      this.seq2[i].locate(400+ this.width/8 *(i+3) +10, 80+ 10/24 * this.height);
      this.seq2[i].resize(50, 50);
      this.seq2[i].onHover = function () {
        this.text = pitch[notePattern1[i] % pitch.length];
      }
      this.seq2[i].onOutside = function () {
        this.text = "";
      }
      this.seq2[i].onPress = function () {
        seq2Count[i]++;
        if (seq2Count[i] %2 == 1){ // on
          this.color = "yellow";          
          amp2[i] = 0.3;
          dur2[i] = random(0.3, 0.4);
        } else { // off
          this.color = "#B2B2B2";
          amp2[i] = 0;
        }
      }
    }
    
    // random sequence button
    this.seqRandom.cornerRadius = 10;
    this.seqRandom.strokeWeight = 0;
    this.seqRandom.color = "#B2B2B2";
    this.seqRandom.textColor = "#FFFFFF";
    this.seqRandom.textScaled = true;
    this.seqRandom.text = "!!!";
    this.seqRandom.locate(400+ this.width/8*2 +10, 80+ 8/24 * this.height +8);
    this.seqRandom.resize(30, 30);
    this.seqRandom.onHover = function () {
      this.color = "yellow";
      //this.color = "#939393";
      this.textColor = "#000000";
    }
    this.seqRandom.onOutside = function () {
      this.color = "#B2B2B2";
      this.textColor = "#FFFFFF";
    }
    this.seqRandom.onPress = function () {
        this.color = "#939393";
        this.textColor = "#000000";
        for (let i=0; i<4; i++) {
        notePattern1[i] = round(random(48, 72)); // range of C2 to C4
      }
    }
    this.seqRandom.onRelease = function () {
        this.color = "#B2B2B2";
        this.textColor = "#FFFFFF";
      
    }
    
    // FX 1
    this.seqFX1.cornerRadius = 5;
    this.seqFX1.strokeWeight = 0;
    this.seqFX1.color = "#B2B2B2";
    this.seqFX1.textColor = "#FFFFFF";
    this.seqFX1.textScaled = true;
    this.seqFX1.text = "FX";
    this.seqFX1.locate(400+ this.width/8*2 +10, 80+ 6/24 * this.height +8);
    this.seqFX1.resize(30, 30);
    this.seqFX1.onPress = function () {
      seqFX1Count++;
      if (seqFX1Count %2 == 1){ // on
        this.color = "#939393"; 
        this.textColor = "#000000";
      } else { // off
        this.color = "#B2B2B2";
        this.textColor = "#FFFFFF";
        
      }
    }
    // FX 2
    this.seqFX2.cornerRadius = 5;
    this.seqFX2.strokeWeight = 0;
    this.seqFX2.color = "#B2B2B2";
    this.seqFX2.textColor = "#FFFFFF";
    this.seqFX2.textScaled = true;
    this.seqFX2.text = "FX";
    this.seqFX2.locate(400+ this.width/8*2 +10, 80+ 10/24 * this.height +8);
    this.seqFX2.resize(30, 30);
    this.seqFX2.onPress = function () {
      seqFX2Count++;
      if (seqFX2Count %2 == 1){ // on
        this.color = "#939393"; 
        this.textColor = "#000000";
      } else { // off
        this.color = "#B2B2B2";
        this.textColor = "#FFFFFF";
        
      }
    }
    
  }
  
  drawSeq() {
    fill(0);
    textSize(16);
    text("Synth 1", 400+ this.width/6, 80+ 7/24 * this.height +8);
    text("Synth 2", 400+ this.width/6, 80+ 11/24 * this.height +8);
    
    // seq 1 & 2
    for (let i = 0; i<4; i++) {
      this.seq1[i].draw();
      this.seq2[i].draw();
    }
    
    // random sequence button
    this.seqRandom.draw();
    
    // FX button
    this.seqFX1.draw();
    this.seqFX2.draw();
    
  }
  
  createPads() {
    for (let i = 0; i<8; i++) {
      this.pads[i] = new Clickable();

      this.pads[i].cornerRadius = 10;
      this.pads[i].strokeWeight = 2;
      this.pads[i].color = "#B2B2B2";
      this.pads[i].textColor = "#FFFFFF";
      this.pads[i].text = this.padsi[i];
      this.pads[i].textSize = 14;
      if (i<4) {
        this.pads[i].locate(400+ this.width/6 *(i+2) -38, 80+ 16/24 * this.height);
      } else {
        this.pads[i].locate(400+ this.width/6 *(i%4 +2) -38, 80+ 20/24 * this.height);
        //this.pads[i].locate(400+ this.width/5 *(i%4 + 1) -20, 80+ 20/24 * this.height);
      }
      this.pads[i].resize(50, 50);
    }
    
    this.pads[0].onHover = function () {
      this.text = "F";
    }
    this.pads[0].onOutside = function () {
      this.text = "Kick";
    }
    this.pads[0].onPress = function () {
      this.color = "#939393";
      userStartAudio();
      Kick.play();
    } 
    this.pads[0].onRelease = function () {
      this.color = "#B2B2B2";
      Kick.stop();    
    } 
    this.pads[1].onHover = function () {
      this.text = "G";
    }
    this.pads[1].onOutside = function () {
      this.text = "Snare";
    }
    this.pads[1].onPress = function () {
      this.color = "#939393";
      userStartAudio();
      Snare.play();
    } 
    this.pads[1].onRelease = function () {
      this.color = "#B2B2B2";
      Snare.stop();    
    }
    this.pads[2].onHover = function () {
      this.text = "H";
    }
    this.pads[2].onOutside = function () {
      this.text = "Rim";
    }
    this.pads[2].onPress = function () {
      this.color = "#939393";
      userStartAudio();
      Rim.play();
    } 
    this.pads[2].onRelease = function () {
      this.color = "#B2B2B2";
      Rim.stop();    
    }
    this.pads[3].onHover = function () {
      this.text = "J";
    }
    this.pads[3].onOutside = function () {
      this.text = "Hi-Hat";
    }
    this.pads[3].onPress = function () {
      this.color = "#939393";
      userStartAudio();
      Hihat.play();
    } 
    this.pads[3].onRelease = function () {
      this.color = "#B2B2B2";
      Hihat.stop();    
    }
    this.pads[4].onHover = function () {
      this.text = "V";
    }
    this.pads[4].onOutside = function () {
      this.text = "Tom";
    }
    this.pads[4].onPress = function () {
      this.color = "#939393";
      userStartAudio();
      Tom.play();
    } 
    this.pads[4].onRelease = function () {
      this.color = "#B2B2B2";
      Tom.stop();    
    }
    this.pads[5].onHover = function () {
      this.text = "B";
    }
    this.pads[5].onOutside = function () {
      this.text = "Clap";
    }
    this.pads[5].onPress = function () {
      this.color = "#939393";
      userStartAudio();
      Clap.play();
    } 
    this.pads[5].onRelease = function () {
      this.color = "#B2B2B2";
      Clap.stop();    
    }
    this.pads[6].onHover = function () {
      this.text = "N";
    }
    this.pads[6].onOutside = function () {
      this.text = " Conga \n Low";
    }
    this.pads[6].onPress = function () {
      this.color = "#939393";
      userStartAudio();
      CongaLo.play();
    } 
    this.pads[6].onRelease = function () {
      this.color = "#B2B2B2";
      CongaLo.stop();    
    }
    this.pads[7].onHover = function () {
      this.text = "M";
    }
    this.pads[7].onOutside = function () {
      this.text = " Conga \n High";
    }
    this.pads[7].onPress = function () {
      this.color = "#939393";
      userStartAudio();
      CongaHi.play();
    } 
    this.pads[7].onRelease = function () {
      this.color = "#B2B2B2";
      CongaHi.stop();    
    }
    
    // FX pads
    this.FXpads.cornerRadius = 5;
    this.FXpads.strokeWeight = 0;
    this.FXpads.color = "#B2B2B2";
    this.FXpads.textColor = "#FFFFFF";
    this.FXpads.textScaled = true;
    this.FXpads.text = "FX";
    this.FXpads.locate(400+ this.width/8 +12, 80+ 20/24 * this.height +10);
    this.FXpads.resize(30, 30);
    this.FXpads.onPress = function () {
      FXpadsCount++;
      if (FXpadsCount %2 == 1){ // on
        this.color = "#939393"; 
        this.textColor = "#000000";
      } else { // off
        this.FXpadsisOn = false;
        this.color = "#B2B2B2";
        this.textColor = "#FFFFFF";
        
      }
    } 
    
  }
  
  drawPads() {
    // pad volume
    noStroke();
    this.padVolKnob.update();
    this.padVol = this.padVolKnob.knobValue;
    Kick.setVolume(this.padVol, 0.3);
    Snare.setVolume(this.padVol, 0.2);
    Rim.setVolume(this.padVol, 0.2);
    Hihat.setVolume(this.padVol, 0.2);
    Tom.setVolume(this.padVol, 0.3);
    Clap.setVolume(this.padVol, 0.2);
    CongaLo.setVolume(this.padVol, 0.3);
    CongaHi.setVolume(this.padVol, 0.3);
    
    // drum pads
    for (let i = 0; i<8; i++) {
      this.pads[i].draw();      
    }
    
    // FX pads
    this.FXpads.draw();
  }
  
} 