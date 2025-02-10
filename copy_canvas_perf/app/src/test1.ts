type TResult = { text: string; value: number };
const results: TResult[] = [];

const NUM_ITERATIONS = 1000;
function drawWebGL(context: WebGLRenderingContext, opacity: number): void {
    // Set color buffer to red (1,0,0) and opaque
    context.clearColor(1, 0, 0, opacity);
    //Set the color with the color buffer
    context.clear(context.COLOR_BUFFER_BIT);
}

const curApproachTitle = 'Current implementation clearRect + drawImage';
function curApproach() {
    const sourceCanvasWebGL = document.getElementById('SourceCanvasWebGL') as HTMLCanvasElement;
    const sourceContextWebGL = sourceCanvasWebGL.getContext('webgl');
    const destCanvas2d = document.getElementById('DestCanvas2d') as HTMLCanvasElement;
    const destContext2d = destCanvas2d.getContext('2d');
    destContext2d.globalCompositeOperation = 'source-over'; // default

    // Benchmark drawImage using WebGL canvas
    const start = performance.now();
    const nextFn = (index: number) => {
        // 1. Draw WebGL
        drawWebGL(sourceContextWebGL, index / NUM_ITERATIONS);

        // 2. Copy to 2d canvas
        destContext2d.clearRect(0, 0, 800, 600);
        destContext2d.drawImage(sourceCanvasWebGL, 0, 0);
        // if (index === NUM_ITERATIONS) {
        //     resOutput({ text: 'cur approach', value: performance.now() - start });
        //     return;
        // }
        // requestAnimationFrame(nextFn);
    };
    for (let i = 0; i < NUM_ITERATIONS; i++) {
        nextFn(i);
    }
    resOutput({ text: curApproachTitle, value: performance.now() - start });
    // nextFn();
}

const copyCanvasNewTitle = 'globalCompositeOperation=copy';
function copyCanvasNew() {
    const sourceCanvasWebGL = document.getElementById('SourceCanvasWebGL') as HTMLCanvasElement;
    const sourceContextWebGL = sourceCanvasWebGL.getContext('webgl');
    const destCanvas2d = document.getElementById('DestCanvas2d') as HTMLCanvasElement;
    const destContext2d = destCanvas2d.getContext('2d');
    destContext2d.globalCompositeOperation = 'copy';

    // Benchmark drawImage using WebGL canvas
    const start = performance.now();
    const nextFn = (index: number) => {
        // 1. Draw WebGL
        drawWebGL(sourceContextWebGL, index / NUM_ITERATIONS);

        // 2. Copy to 2d canvas
        // destContext2d.clearRect(0, 0, 800, 600); not needed with destContext2d.globalCompositeOperation = 'copy';
        destContext2d.drawImage(sourceCanvasWebGL, 0, 0);
    };
    for (let i = 0; i < NUM_ITERATIONS; i++) {
        nextFn(i);
    }
    resOutput({ text: copyCanvasNewTitle, value: performance.now() - start });
}

const copyCanvasNew2Title = 'globalCompositeOperation=copy + drawImage with width and height';
function copyCanvasNew2() {
    const sourceCanvasWebGL = document.getElementById('SourceCanvasWebGL') as HTMLCanvasElement;
    const sourceContextWebGL = sourceCanvasWebGL.getContext('webgl');
    const destCanvas2d = document.getElementById('DestCanvas2d') as HTMLCanvasElement;
    const destContext2d = destCanvas2d.getContext('2d');
    destContext2d.globalCompositeOperation = 'copy';

    // Benchmark drawImage using WebGL canvas
    const start = performance.now();
    const nextFn = (index: number) => {
        // 1. Draw WebGL
        drawWebGL(sourceContextWebGL, index / NUM_ITERATIONS);

        // 2. Copy to 2d canvas
        // destContext2d.clearRect(0, 0, 800, 600); not needed with destContext2d.globalCompositeOperation = 'copy';
        destContext2d.drawImage(sourceCanvasWebGL, 0, 0, 800, 600, 0, 0, 800, 600);
    };
    for (let i = 0; i < NUM_ITERATIONS; i++) {
        nextFn(i);
    }
    resOutput({
        text: copyCanvasNew2Title,
        value: performance.now() - start,
    });
}

const offScreenCanvasTitle = 'Offscreen canvas';
function offScreenCanvas() {
    const offscreenCanvasWebGL = new OffscreenCanvas(1600, 1200);
    const sourceContextWebGL = offscreenCanvasWebGL.getContext('webgl');
    const destCanvas2d = document.getElementById('DestCanvas2d') as HTMLCanvasElement;
    const destContext2d = destCanvas2d.getContext('2d');
    destContext2d.globalCompositeOperation = 'copy';

    // Benchmark drawImage using WebGL canvas
    const start = performance.now();
    const nextFn = (index: number) => {
        // 1. Draw WebGL
        drawWebGL(sourceContextWebGL, index / NUM_ITERATIONS);

        // 2. Copy to 2d canvas
        // destContext2d.clearRect(0, 0, 800, 600); not needed with destContext2d.globalCompositeOperation = 'copy';
        destContext2d.drawImage(offscreenCanvasWebGL, 0, 0);
    };
    for (let i = 0; i < NUM_ITERATIONS; i++) {
        nextFn(i);
    }
    resOutput({ text: offScreenCanvasTitle, value: performance.now() - start });
}

const copyCanvasNewOffscreenWorkerTitle = 'Offscreen canvas + web worker';
let isInitialized = false;
let worker: Worker;
function copyCanvasNewOffscreenWorker() {
    if (!isInitialized) {
        const destCanvas2d = document.getElementById('DestCanvas2d_second') as HTMLCanvasElement;
        const offscreen = destCanvas2d.transferControlToOffscreen();
        worker = new Worker('test1-worker.js');
        worker.postMessage({ offscreen }, [offscreen]);
        isInitialized = true;
    }
    const start = performance.now();
    worker.postMessage({ start: true });

    worker.onmessage = function (evt) {
        if (evt.data.end === true)
            resOutput({ text: copyCanvasNewOffscreenWorkerTitle, value: performance.now() - start });
    };
}

function resOutput(r: TResult): void {
    results.push(r);
    document.getElementById('results').innerText = results.map((r) => `${r.value.toFixed(2)}ms - ${r.text}`).join('\n');
}

const STEPS = 10;
const EXAMPLES = 5;
function resOutAverage(): void {
    const allTitles = [
        curApproachTitle,
        copyCanvasNewTitle,
        copyCanvasNew2Title,
        offScreenCanvasTitle,
        copyCanvasNewOffscreenWorkerTitle,
    ];
    const rows = EXAMPLES; // number of rows
    const cols = STEPS; // number of columns

    const res = new Array(rows).fill(0).map(() => new Array(cols).fill(null));

    for (let i = 0; i < STEPS; i++) {
        for (let j = 0; j < EXAMPLES; j++) {
            let index = i * EXAMPLES + j;
            res[j][i] = results[index].value;
        }
    }

    const avgRes: number[] = [];
    for (let i = 0; i < EXAMPLES; i++) {
        const curRes = res[i];
        const curResSorted = curRes.map((r) => r).sort((a, b) => a - b);
        let sum = 0;
        for (let j = 1; j < curResSorted.length - 1; j++) {
            sum += curResSorted[j];
        }
        if (curResSorted.length - 2 > 0) sum /= curResSorted.length - 2;
        avgRes.push(sum);
    }

    document.getElementById('average').innerText = allTitles
        .map((t, index) => `${avgRes[index].toFixed(2)}ms - ${t}`)
        .join('\n');
}

function test1() {
    const timeout = 1000;
    for (let i = 0; i < STEPS; i++) {
        setTimeout(curApproach, i * EXAMPLES * timeout);
        setTimeout(copyCanvasNew, i * EXAMPLES * timeout + timeout);
        setTimeout(copyCanvasNew2, i * EXAMPLES * timeout + 2 * timeout);
        setTimeout(offScreenCanvas, i * EXAMPLES * timeout + 3 * timeout);
        setTimeout(copyCanvasNewOffscreenWorker, i * EXAMPLES * timeout + 4 * timeout);
    }
    setTimeout(resOutAverage, timeout * STEPS * EXAMPLES);
}

test1();
