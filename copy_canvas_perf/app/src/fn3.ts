/**
 *  Offscreen canvas example with web worker from MDN
 */
function fn3() {
    const htmlCanvas = document.getElementById('canvas') as HTMLCanvasElement;
    const offscreen = htmlCanvas.transferControlToOffscreen();

    // offscreen canvas worker
    const worker = new Worker('fn3-worker.js');
    worker.postMessage({ canvas: offscreen }, [offscreen]);
}

fn3();
