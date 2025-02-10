/**
 * Example with benchmarks from codepen
 */
function fn1() {
    const outputCanvas = document.getElementById('outputCanvas') as HTMLCanvasElement;
    const ctx = outputCanvas.getContext('2d');

    const NUM_ITERATIONS = 10000;

    function createWebGLCanvas() {
        const glCanvas = document.createElement('canvas');
        glCanvas.width = 1024;
        glCanvas.height = 1024;
        const gl = glCanvas.getContext('webgl');

        if (!gl) {
            console.error('WebGL not supported');
            return null;
        }

        // Clear background
        gl.clearColor(0.1, 0.2, 0.3, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Vertex shader source
        const vsSource = `
            attribute vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        // Fragment shader source
        const fsSource = `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(1.0, 0.5, 0.2, 1.0); // Orange triangle
            }
        `;

        // Compile shaders
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vsSource);
        gl.compileShader(vertexShader);

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fsSource);
        gl.compileShader(fragmentShader);

        // Create shader program
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        gl.useProgram(shaderProgram);

        // Triangle vertex data (normalized device coordinates)
        const triangleVertices = new Float32Array([
            -0.5,
            -0.5, // Bottom-left
            0.5,
            -0.5, // Bottom-right
            0.0,
            0.5, // Top
        ]);

        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(shaderProgram, 'position');
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLocation);

        // Draw the triangle
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        // Draw lines (simple grid pattern)
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.lineWidth(2);

        const gridVertices = new Float32Array([
            -1.0,
            0.0,
            1.0,
            0.0, // Horizontal line
            0.0,
            -1.0,
            0.0,
            1.0, // Vertical line
        ]);

        const gridBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, gridBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, gridVertices, gl.STATIC_DRAW);

        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLocation);

        // Set color for lines (white)
        const fsSourceLines = `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
            }
        `;
        const fragmentShaderLines = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShaderLines, fsSourceLines);
        gl.compileShader(fragmentShaderLines);

        // Create separate program for lines
        const shaderProgramLines = gl.createProgram();
        gl.attachShader(shaderProgramLines, vertexShader);
        gl.attachShader(shaderProgramLines, fragmentShaderLines);
        gl.linkProgram(shaderProgramLines);
        gl.useProgram(shaderProgramLines);

        gl.drawArrays(gl.LINES, 0, 4); // Draw grid lines

        return glCanvas;
    }

    async function runBenchmark() {
        const webglCanvas = createWebGLCanvas();

        if (!webglCanvas) {
            document.getElementById('results').innerText = 'WebGL not supported.';
            return;
        }

        // Convert WebGL canvas to ImageBitmap
        const imageBitmap = await createImageBitmap(webglCanvas);

        // Benchmark drawImage using WebGL canvas
        let start = performance.now();
        for (let i = 0; i < NUM_ITERATIONS; i++) {
            ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
            ctx.drawImage(webglCanvas, 0, 0);
        }
        let timeCanvas = performance.now() - start;

        // Benchmark drawImage using ImageBitmap
        start = performance.now();
        for (let i = 0; i < NUM_ITERATIONS; i++) {
            ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
            ctx.drawImage(imageBitmap, 0, 0);
        }
        let timeImageBitmap = performance.now() - start;

        // Benchmark drawImage using drawImage + copy
        start = performance.now();
        for (let i = 0; i < NUM_ITERATIONS; i++) {
            ctx.globalCompositeOperation = 'copy';
            ctx.drawImage(webglCanvas, 0, 0);
        }
        let timeCanvasCompositeOperation = performance.now() - start;

        // Benchmark drawImage + copyOperation using webGLCanvas
        start = performance.now();
        for (let i = 0; i < NUM_ITERATIONS; i++) {
            ctx.globalCompositeOperation = 'copy';
            ctx.drawImage(imageBitmap, 0, 0);
        }
        let timeImageBitmapCompositeOperation = performance.now() - start;

        // Display results
        document.getElementById('results').innerText =
            `drawImage(WebGL canvas) time: ${timeCanvas.toFixed(2)}ms\n` +
            `drawImage(ImageBitmap) time: ${timeImageBitmap.toFixed(2)}ms\n` +
            `drawImage(WebGL Canvas) + copy time: ${timeCanvasCompositeOperation.toFixed(2)}ms\n` +
            `drawImage(ImageBitmap) + copy time: ${timeImageBitmapCompositeOperation.toFixed(2)}ms`;
    }

    runBenchmark();
}

fn1();
