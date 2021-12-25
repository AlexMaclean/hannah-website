



// /* Function to linearly interpolate between a0 and a1
//  * Weight w should be in the range [0.0, 1.0]
//  */
function interpolate(a0, a1, w) {
    /* // You may want clamping by inserting:
     * if (0.0 > w) return a0;
     * if (1.0 < w) return a1;
     */
    //return (a1 - a0) * w + a0;
     // Use this cubic interpolation [[Smoothstep]] instead, for a smooth appearance:
    return (a1 - a0) * (3.0 - w * 2.0) * w * w + a0;
     /*
     * // Use [[Smootherstep]] for an even smoother result with a second derivative equal to zero on boundaries:
     * return (a1 - a0) * ((w * (w * 6.0 - 15.0) + 10.0) * w * w * w) + a0;
     */
}

// /* Create pseudorandom direction vector
//  */
// function randomGradient(ix, iy) {
//     // No precomputed gradients mean this works for any number of grid coordinates
//     const w = 8 * 8;
//     const s = w / 2; // rotation width
//     const a = ix, b = iy;
//     a *= 3284157443; b ^= a << s | a >> w-s;
//     b *= 1911520717; a ^= b << s | b >> w-s;
//     a *= 2048419325;
//     const random = a * (Math.PI / ~(~0 >> 1));
//     return [Math.cos(random), Math.sin(random)];
// }

// Computes the dot product of the distance and gradient vectors.




// Compute Perlin noise at coordinates x, y

class PerlinNoise{
    constructor(width, height, size) {
        this.size = size;
        this.grid = this.makeGrid(width, height, size);
    }

    makeGrid(width, height, size) {
        const gridX = Math.ceil(width / size + 1);
        const gridY = Math.ceil(height / size + 1);
        const grid = new Array(gridX);
        for (var xi = 0; xi < gridX; xi++) {
            grid[xi] = new Array(gridY);
            for (var yi = 0; yi < gridY; yi++) {
                grid[xi][yi] = this.randomGradient();
            }
        }
        console.log(grid);
        return grid;
    }

    randomGradient() {
        const random = Math.random() * (Math.PI * 2);
        return [Math.cos(random), Math.sin(random)];
    }

    dotGridGradient(ix, iy, x, y) {
        console.log(ix, iy, x, y);
        // Get gradient from integer coordinates
        const gradient = this.grid[ix][iy];

        // Compute the distance vector
        const dx = x - ix;
        const dy = y - iy;

        // console.log(dx, dy)

        // Compute the dot-product
        return dx * gradient[0] + dy * gradient[1];
    }

    noise(x, y) {
        const xi = x / this.size;
        const yi = y / this.size;

        const x0 = Math.floor(xi);
        const y0 = Math.floor(yi);
        const x1 = x0 + 1;
        const y1 = y0 + 1;

        // console.log(x0, y0, x1, y1);

        const sx = xi - x0;
        const sy = yi - y0;

        // console.log(sx, sy);

        const ix0 = interpolate(
            this.dotGridGradient(x0, y0, xi, yi),
            this.dotGridGradient(x1, y0, xi, yi), sx);

        const ix1 = interpolate(
            this.dotGridGradient(x0, y1, xi, yi),
            this.dotGridGradient(x1, y1, xi, yi), sx);

        const value = interpolate(ix0, ix1, sy);
        return value;
    }


//     // Determine grid cell coordinates
//     const x0 = x;
//     const x1 = x0 + 1;
//     const y0 = y;
//     const y1 = y0 + 1;

//     // Determine interpolation weights
//     // Could also use higher order polynomial/s-curve here
//     const sx = x - x0;
//     const sy = y - y0;

//     // Interpolate between grid point gradients
//     var n0, n1, ix0, ix1, value;

//     n0 = dotGridGradient(x0, y0, x, y);
//     n1 = dotGridGradient(x1, y0, x, y);
//     ix0 = interpolate(n0, n1, sx);

//     n0 = dotGridGradient(x0, y1, x, y);
//     n1 = dotGridGradient(x1, y1, x, y);
//     ix1 = interpolate(n0, n1, sx);

//     value = interpolate(ix0, ix1, sy);
//     return value;
}

p = new PerlinNoise(width, height, 200);

for (var x = 0; x < width; x += 10) {
    for (var y = 0; y < height; y += 10) {
        const value = p.noise(x, y);
        console.log(value);
        const color = (255 * value * 2 + 255) / 2;
        ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
        ctx.fillRect(x, y, 10, 10);

    }
}
