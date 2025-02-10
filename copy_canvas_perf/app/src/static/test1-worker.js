let offscreenCanvasWebGL;
let sourceContextWebGL;
let destCanvas2d;
let destContext2d;

onmessage = (evt) => {
    const NUM_ITERATIONS = 1000;
    if (!offscreenCanvasWebGL) {
        offscreenCanvasWebGL = new OffscreenCanvas(1600, 1200);
        sourceContextWebGL = offscreenCanvasWebGL.getContext('webgl');
        destCanvas2d = evt.data.offscreen;
        destContext2d = destCanvas2d.getContext('2d');
        destContext2d.globalCompositeOperation = 'copy';
    } else {
        for (let i = 0; i < NUM_ITERATIONS; i++) {
            // Perform some drawing using the gl context
            sourceContextWebGL.clearColor(1, 0, 0, 1);
            sourceContextWebGL.clear(sourceContextWebGL.COLOR_BUFFER_BIT);
            destContext2d.drawImage(offscreenCanvasWebGL, 0, 0);
        }
    
        self.postMessage({ end: true });
    }
};
