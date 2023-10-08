class starsound {
  constructor(sumStar) {
    this.sound = null;
    this.sumStar = sumStar; // sum of stars at each slice
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
    this.amp = 1/this.sumStar;
    if ( y>0 ) {
      this.amp = map(y, 0.0, 15.0, 0.5, 0.1);
    } else if (y<0) {
      this.amp = map(y, 0.0, -15.0, 0.5, 0.1);
    }
    this.startT = startT;
    this.numPan = map(x, -15.0, 15.0, -1.0, 1.0);
    this.sound.pan(this.numPan);
    
  }
  setW2(x, y, startT) { // freq = 1/z
    this.sound = soundObj[1];
    this.rate = map(this.freq[1], 0.03, 2.5, 0.5, 2.0); // confirm range
    this.amp = 1/this.sumStar;
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
    this.amp = 1/this.sumStar;
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
    this.amp = 1/this.sumStar;
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
    this.sound.play(this.startT, this.rate, this.amp);
  }
  
  
} // end of class

/* add before setup
function preload() {
  //soundObj[0] = loadSound('Samples/Kick.mp3');
  soundObj[0] = loadSound('Samples/Bass.mp3');
  soundObj[1] = loadSound('Samples/Brass.mp3');
  soundObj[2] = loadSound('Samples/Pad.mp3');
  soundObj[3] = loadSound('Samples/Box.mp3');
  //soundObj[0] = loadSound('Samples/Hihat.mp3');
}
*/