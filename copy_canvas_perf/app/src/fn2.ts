/**
 * Offscreen canvas example with image bitmap from MDN
 */
function fn2() {
    const canvasOne = document.getElementById('one') as HTMLCanvasElement;
    const one = canvasOne.getContext('bitmaprenderer');
    const canvasTwo = document.getElementById('two') as HTMLCanvasElement;
    const two = canvasTwo.getContext('bitmaprenderer');

    const offscreen = new OffscreenCanvas(256, 256);
    const gl = offscreen.getContext('webgl');

    // Perform some drawing for the first canvas using the gl context
    // Filling with red for the first canvas
    gl.clearColor(1, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const bitmapOne = offscreen.transferToImageBitmap();
    one.transferFromImageBitmap(bitmapOne);

    // Perform some more drawing for the second canvas
    // Drawing nothing for the second canvas
    const bitmapTwo = offscreen.transferToImageBitmap();
    two.transferFromImageBitmap(bitmapTwo);
}

fn2();
