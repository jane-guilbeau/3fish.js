// import sprites
const fish1 = new Image();
fish1.src = 'images/fish1.png';
const fish1r = new Image();
fish1r.src = 'images/fish1r.png';

const fish2 = new Image();
fish2.src = 'images/fish2.png';
const fish2r = new Image();
fish2r.src = 'images/fish2r.png';

const fish3 = new Image();
fish3.src = 'images/fish3.png';
const fish3r = new Image();
fish3r.src = 'images/fish3r.png';

const bg = new Image();
bg.src = 'images/bg.png';

// setup canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = bg.naturalWidth;
canvas.height = bg.naturalHeight;

// scale canvas
const globalScale = 4; 
canvas.style.width = `${canvas.getAttribute('width') * globalScale}px`;
canvas.style.height = `${canvas.getAttribute('height') * globalScale}px`;

// function to generate random number
function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

// function to round to nearest multiple of a number
function roundTo(number, multiple) {
    if (number % multiple < multiple / 2) return number - (number % multiple);
    else return number + (multiple - (number % multiple));
}

// define fish class
class Fish {
    constructor(x, y, speed, sprite, flippedSprite) {
        // set argument properties
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.flippedSprite = flippedSprite

        // set hidden properties
        this.spriteFlipped = false;
        this.velX = speed;
        this.velY = speed;
        this.flipChance = 500;
    }

    draw() {
        ctx.drawImage(
            // flip sprite depending on object state
            this.spriteFlipped ? this.flippedSprite : this.sprite,
            
            // round sprite position for pixel perfection
            roundTo(this.x, 1),
            roundTo(this.y, 1),
            );
    }

    update() {
        // adjust window width to global scale
        const windowWidthScaled = window.innerWidth / globalScale;
        const windowHeightScaled = window.innerHeight / globalScale;

        // collision with screen edge or canvas edge
        if ((this.x + this.sprite.naturalWidth) >= windowWidthScaled || (this.x + this.sprite.naturalWidth) >= canvas.width) {
            // reverse direction
            this.velX = -(this.velX);

            // place object within bounds
            this.x = Math.min(windowWidthScaled, canvas.width) - this.sprite.naturalWidth;

            //flip sprite
            this.spriteFlipped = !this.spriteFlipped;
        }

        if (this.x <= 0) {
            this.velX = -(this.velX);
            this.x = 0;
            this.spriteFlipped = !this.spriteFlipped;
        }

        if ((this.y + this.sprite.naturalHeight) >= windowHeightScaled || (this.y + this.sprite.naturalHeight) >= canvas.height) {
            this.velY = -(this.velY);
            this.y = Math.min(windowHeightScaled, canvas.height) - this.sprite.naturalHeight;
        }

        if (this.y <= 0) {
            this.velY = -(this.velY);
            this.y = 0;
        }

        // add in random turns
        if (random(1, this.flipChance) === this.flipChance) {
            // reverse x direction
            this.velX = -(this.velX);

            // flip sprite
            this.spriteFlipped = !this.spriteFlipped;
        }

        if (random(1, this.flipChance) === this.flipChance) {
            // reverse y direction
            this.velY = -(this.velY);
        }


        // add velocity to object position
        this.x += this.velX;
        this.y += this.velY;
    }
}

// create fishies
const fishies = [];
fishies.push(new Fish(90 ,100, 0.4, fish1, fish1r));
fishies.push(new Fish(70, 20, 0.7, fish2, fish2r));
fishies.push(new Fish(20, 20, 0.7, fish3, fish3r));

// draw each frame
function loop() {
    ctx.drawImage(bg, 0, 0, bg.naturalWidth, bg.naturalHeight);

    for (const fish of fishies) {
        fish.draw();
        fish.update();
    }
    
    setTimeout(() => {
        requestAnimationFrame(loop);
    }, 1000 / 60);
}

// begin animation
loop();