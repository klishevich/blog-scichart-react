onmessage = (evt) => {
    const canvas = evt.data.canvas;
    const gl = canvas.getContext('webgl');

    // Drawing once
    // Perform some drawing using the gl context
    console.log('drawing');
    gl.clearColor(1, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Drawing in a loop
    // function render(time) {
    //     // Perform some drawing using the gl context
    //     gl.clearColor(1, 0, 0, 1);
    //     gl.clear(gl.COLOR_BUFFER_BIT);

    //     requestAnimationFrame(render);
    // }
    // requestAnimationFrame(render);
};
