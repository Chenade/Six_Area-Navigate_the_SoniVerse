class starsound {
  constructor(sumStar) {
    this.sumStar = sumStar; // for ampplitude division
    this.pan3D = null;
    this.noiseDust = null;
    this.osc = null;
    this.BPF = null;
    this.res = 0;
    this.freq = 0; // x 
    this.amp = 0; 
    this.dur = 0; // y
    this.startT = 0;
    
  }
  
  // construct sound based on wavelength (W1~W4)
  setW1(freq, dur, startT) {
    this.pan3D = new p5.Panner3D("HRTF");
    this.noiseDust = new p5.Noise();
    this.osc = new p5.Oscillator('sawtooth');
    this.BPF = new p5.Filter('bandpass');
    
    this.res = 5;
    this.freq = constrain(map(freq, -15, 15, 50, 5000), 50, 5000);
    this.dur = constrain(map(dur, -15, 15, 1.5, 0.2), 0, 1.5);
    this.amp = 1/this.sumStar;
    this.osc.freq(this.freq, 0.2, startT);
    this.BPF.set(this.freq, this.res);
    //this.pan3D.set(freq, dur, 0); // x,y,z
    this.pan3D.set(-45, -45, 0); // x,y,z
    this.pan3D.process(this.osc);
    this.noiseDust.disconnect();
    this.noiseDust.connect(this.BPF);
    
  }
  setW2(freq, dur, startT) {
    this.pan3D = new p5.Panner3D("HRTF");
    this.noiseDust = new p5.Noise();
    this.osc = new p5.Oscillator('triangle');
    this.BPF = new p5.Filter('bandpass');
    
    this.res = 15;
    this.freq = constrain(map(freq, -15, 15, 50, 5000), 50, 5000);
    this.dur = constrain(map(dur, -15, 15, 1.5, 0.2), 0, 1.5);
    this.amp = 1/this.sumStar;
    this.osc.freq(this.freq, 0.2, startT);
    this.BPF.set(this.freq, this.res);
    //this.pan3D.set(freq, dur, 0); // x,y,z
    this.pan3D.set(45, 45, 0); // x,y,z  
    this.pan3D.process(this.osc);
    this.noiseDust.disconnect();
    this.noiseDust.connect(this.BPF);
    
  }
  setW3(freq, dur, startT) {
    this.noiseDust = new p5.Noise();
    this.osc = new p5.Oscillator('square');
    //this.BPF = new p5.Filter('bandpass');
    
    //this.res = 25;
    this.freq = constrain(map(freq, -15, 15, 50, 5000), 50, 5000);
    this.dur = constrain(map(dur, -15, 15, 1.5, 0.2), 0, 1.5);
    this.amp = 1/this.sumStar;
    this.osc.freq(this.freq, 0.2, startT);
    //this.BPF.set(this.freq, this.res);
    
    //this.noiseDust.disconnect();
    //this.noiseDust.connect(this.BPF);
    
  }
  setW4(freq, dur, startT) {
    this.noiseDust = new p5.Noise();
    this.osc = new p5.Oscillator('sawtooth');
    //this.BPF = new p5.Filter('bandpass');
    
    //this.res = 25;
    this.freq = constrain(map(freq, -15, 15, 50, 5000), 50, 5000);
    this.dur = constrain(map(dur, -15, 15, 1.5, 0.2), 0, 1.5);
    this.amp = 1/this.sumStar;
    this.osc.freq(this.freq, 0.2, startT);
    //this.BPF.set(this.freq, this.res);
    
    //this.noiseDust.disconnect();
    //this.noiseDust.connect(this.BPF);
    
  }
  
  // methods
  playNote(wType) {
    if (wType == 1 || wType == 2) {
      // start
      this.noiseDust.start();
      this.noiseDust.amp(this.amp*2/3, 0.2);
      this.osc.start();
      this.osc.amp(this.amp*1/3, 0.2);
      // stop after duration
      this.noiseDust.amp(0, 0.4, this.dur);
      this.osc.amp(0, 0.2, this.dur);
    
    } else if (wType == 3 || wType == 4 ) {
      this.osc.start();
      this.osc.amp(this.amp, 0.2);
      // stop after duration
      this.osc.amp(0, 0.2, this.dur);
    } 
  }
  
  
} // end of class


