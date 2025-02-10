let offscreenCanvasWebGL;
let sourceContextWebGL;
let destCanvas2d;
let destContext2d;

function drawWebGL2(gl, opacity) {
    if (!gl) {
        console.error('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    // Generate vertex data for 1000 lines
    const numLines = 1_000_000;
    const vertices = new Float32Array(numLines * 4); // 4 values per line (x1, y1, x2, y2)

    // Fill the vertex array with random coordinates for 1000 lines
    for (let i = 0; i < numLines; i++) {
        const x1 = Math.random() * 2 - 1; // Random value between -1 and 1
        const y1 = Math.random() * 2 - 1; // Random value between -1 and 1
        const x2 = Math.random() * 2 - 1; // Random value between -1 and 1
        const y2 = Math.random() * 2 - 1; // Random value between -1 and 1

        vertices[i * 4] = x1;
        vertices[i * 4 + 1] = y1;
        vertices[i * 4 + 2] = x2;
        vertices[i * 4 + 3] = y2;
    }

    // Create a buffer and upload the vertex data
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Function to compile a shader
    // @ts-ignore
    function compileShader(gl, source, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('ERROR compiling shader!', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    // Create a vertex shader
    const vertexShaderSource = `
        attribute vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;
    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);

    // Create a fragment shader
    const fragmentShaderSource = `
        precision mediump float;
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red color
        }
    `;
    const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

    // Link shaders into a program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    // Get attribute location and enable it
    const positionAttribLocation = gl.getAttribLocation(shaderProgram, "a_position");
    gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttribLocation);

    // Set clear color and clear canvas
    gl.clearColor(0.8, 0.8, 0.8, 1.0); // Light grey background
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the lines
    gl.drawArrays(gl.LINES, 0, vertices.length / 2);
}

onmessage = (evt) => {
    const NUM_ITERATIONS = 1;
    if (!offscreenCanvasWebGL) {
        offscreenCanvasWebGL = new OffscreenCanvas(800, 600);
        sourceContextWebGL = offscreenCanvasWebGL.getContext('webgl');
        destCanvas2d = evt.data.offscreen;
        destContext2d = destCanvas2d.getContext('2d');
        destContext2d.globalCompositeOperation = 'copy';
    } else {
        for (let i = 0; i < NUM_ITERATIONS; i++) {
            drawWebGL2(sourceContextWebGL, 1);
            destContext2d.drawImage(offscreenCanvasWebGL, 0, 0);
        }
    
        self.postMessage({ end: true });
    }
};
