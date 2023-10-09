class starsound {
  constructor(sumStar) {
    this.sound = null;
    this.sumStar = 30; // sum of stars at each slice
    this.freq = [2.13, 0.83, 0.22, 0.016];
    this.rate = 1.0; // z
    this.amp = 0.0; // y
    this.startT = 0.0;
    this.numPan = 0.0; // x
  }
  
  // construct sound based on wavelength (W1~W4)
  setW1(x, y, startT) { // freq = 1/z
    this.sound = soundObj[0];
    this.rate = map(this.freq[0], 0.03, 2.5, 0.5, 2.0); // confirm range
    this.amp = constrain(1/this.sumStar, 0.01, 0.99);
    if (y>0) {
      this.amp = map(y, 0.0, 15.0, this.amp, 0.01);
    } else if (y<0) {
      this.amp = map(y, 0.0, -15.0, this.amp, 0.01);
    }
    this.startT = startT;
    this.numPan = map(x, -15.0, 15.0, -1.0, 1.0);
    //print(this.amp);
    //print(this.numPan);
    this.sound.pan(this.numPan);
    
  }
  setW2(x, y, startT) { // freq = 1/z
    this.sound = soundObj[1];
    this.rate = map(this.freq[1], 0.03, 2.5, 0.5, 2.0); // confirm range
    this.amp = constrain(1/this.sumStar, 0.01, 0.99);
    if ( y>0 ) {
      this.amp = map(y, 0.0, 15.0, 0.5, 0.1);
    } else if (y<0) {
      this.amp = map(y, 0.0, -15.0, 0.5, 0.1);
    }
    this.startT = startT;
    this.numPan = map(x, -15.0, 15.0, -1.0, 1.0);
    this.sound.pan(this.numPan);    
  }
  setW3(x, y, startT) { // freq = 1/z
    this.sound = soundObj[2];
    this.rate = map(this.freq[2], 0.1, 2.5, 0.5, 2.0); // confirm range
    this.amp = constrain(1/this.sumStar, 0.01, 0.99);
    if ( y>0 ) {
      this.amp = map(y, 0.0, 15.0, 0.5, 0.1);
    } else if (y<0) {
      this.amp = map(y, 0.0, -15.0, 0.5, 0.1);
    }
    this.startT = startT;
    this.numPan = map(x, -15.0, 15.0, -1.0, 1.0);
    this.sound.pan(this.numPan);    
  }
  setW4(x, y, startT) { // freq = 1/z
    this.sound = soundObj[3];
    this.rate = map(this.freq[3], 0.1, 2.5, 0.5, 2.0); // confirm range
    this.amp = constrain(1/this.sumStar, 0.01, 0.99);
    if ( y>0 ) {
      this.amp = map(y, 0.0, 15.0, 0.5, 0.1);
    } else if (y<0) {
      this.amp = map(y, 0.0, -15.0, 0.5, 0.1);
    }
    this.startT = startT;
    this.numPan = map(x, -15.0, 15.0, -1.0, 1.0);
    this.sound.pan(this.numPan);  
    
  }
  
  // methods
  playNote() {
    this.sound.playMode('sustain');
    this.sound.connect();
    this.sound.play(this.startT, this.rate, this.amp);
  }
  pauseNote() {
    // this.sound.setVolume(0.0);
    this.sound.pause();
    this.sound.disconnect();
  }
  
  
} // end of class