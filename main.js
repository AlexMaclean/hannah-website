const butterflySpeed = 1;
const butterflyMaxRotation = 0.1;
const butterflyMaxDRotation = 0.01;
const butterflyDensity = 1 / 50000;
const butterflySpriteSize = 50;
const butterflyNumSprites = 6;

let butterflySprite = new Image();
butterflySprite.src = './butterfly.png';

const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;


class Butterfly {
    constructor(x, y, rotation) {
        this.x = x;
        this.y = y;

        this.rotation = rotation;
        this.dRotation = 0

        this.sprite = Math.floor(Math.random() * butterflyNumSprites);
    }

    draw() {
        // ctx.beginPath();
        // // ctx.fillStyle = this.color;
        // ctx.moveTo(this.x, this.y);
        // ctx.lineTo(this.x +  Math.sin(this.rotation) * 5, this.y + Math.cos(this.rotation) * 5);
        // //ctx.lineTo(this.x - 10, this.y + 10);
        // ctx.stroke();
        ctx.save();
        ctx.translate(this.x, this.y); // change origin
        ctx.rotate(- this.rotation + Math.PI); // rotate
        ctx.drawImage(butterflySprite,
            Math.floor(this.sprite) * 200, 0, 200, 200,
            -butterflySpriteSize,-butterflySpriteSize,butterflySpriteSize,butterflySpriteSize);
        ctx.restore()

    }

    update() {
        this.rotation += this.dRotation;
        this.x += Math.sin(this.rotation) * butterflySpeed;
        this.y += Math.cos(this.rotation) * butterflySpeed;

        this.dRotation += Math.random() * butterflyMaxDRotation - butterflyMaxDRotation / 2;
        if (this.dRotation > butterflyMaxRotation || this.dRotation < -butterflyMaxRotation) {
            this.dRotation  = this.dRotation * -0.5;
        }

        this.sprite = (this.sprite + 0.2) % butterflyNumSprites;
    }
}


const numButterflies = Math.floor(width * height * butterflyDensity);
const butterflies = Array(numButterflies);
for (let i = 0; i < numButterflies; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const rotation = Math.random() * Math.PI * 2;

    const color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
    butterflies[i] = (new Butterfly(x, y, rotation, color));
}



function loop() {
    // ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    // ctx.fillRect(0, 0, width, height);
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < butterflies.length; i++) {
        butterflies[i].draw();
        butterflies[i].update();
    }

    requestAnimationFrame(loop);
}

loop();

