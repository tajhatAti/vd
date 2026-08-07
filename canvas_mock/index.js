function dummy() {
  return this;
}

const dummyCtx = {
  drawImage: dummy,
  getImageData: () => ({ data: new Uint8ClampedArray(0) }),
  putImageData: dummy,
  createImageData: () => ({ data: new Uint8ClampedArray(0) }),
  beginPath: dummy,
  closePath: dummy,
  moveTo: dummy,
  lineTo: dummy,
  stroke: dummy,
  fill: dummy,
  rect: dummy,
  fillRect: dummy,
  clearRect: dummy,
  strokeRect: dummy,
  arc: dummy,
  arcTo: dummy,
  quadraticCurveTo: dummy,
  bezierCurveTo: dummy,
  fillText: dummy,
  strokeText: dummy,
  measureText: () => ({ width: 0, height: 0 }),
  scale: dummy,
  rotate: dummy,
  translate: dummy,
  transform: dummy,
  setTransform: dummy,
  resetTransform: dummy,
  createLinearGradient: () => dummyCtx,
  createRadialGradient: () => dummyCtx,
  createPattern: () => dummyCtx,
  save: dummy,
  restore: dummy,
  clip: dummy,
  isPointInPath: () => false,
  isPointInStroke: () => false,
  setLineDash: dummy,
  getLineDash: () => [],
  font: "",
  textAlign: "left",
  textBaseline: "top",
  direction: "ltr",
  fillStyle: "",
  strokeStyle: "",
  lineWidth: 1,
  lineCap: "butt",
  lineJoin: "miter",
  miterLimit: 10,
  shadowBlur: 0,
  shadowColor: "transparent",
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  globalAlpha: 1.0,
  globalCompositeOperation: "source-over",
  imageSmoothingEnabled: true
};

const dummyCanvas = {
  getContext: () => dummyCtx,
  toBuffer: () => Buffer.alloc(0),
  toDataURL: () => "",
  createPNGStream: () => ({ on: () => {} }),
  createJPEGStream: () => ({ on: () => {} })
};

module.exports = {
  createCanvas: (w, h) => {
    return {
      ...dummyCanvas,
      width: w,
      height: h
    };
  },
  loadImage: async () => ({
    width: 100,
    height: 100
  }),
  registerFont: () => {},
  Canvas: function() { return dummyCanvas; },
  Image: function() { return {}; }
};
