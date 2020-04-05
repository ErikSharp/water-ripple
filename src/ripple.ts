import p5 from "p5";
import { Drawable } from "./drawable";
import { Updatable } from "./updatable";

export class Ripple implements Drawable, Updatable {
    private frame1: number[][];
    private frame2: number[][];
    private current: number[][];
    private next: number[][];
    private damping = 0.99;

    constructor(private p: p5, private cols: number, private rows: number) {
        this.frame1 = [];
        this.frame2 = [];

        for (let x = 0; x < this.cols; x++) {
            this.frame1[x] = [];
            this.frame2[x] = [];
            for (let y = 0; y < this.rows; y++) {
                this.frame1[x][y] = 0;
                this.frame2[x][y] = 0;
            }
        }

        this.current = this.frame1;
        this.next = this.frame2;

        let clamp = (value: number, min: number, max: number) => {
            return Math.min(Math.max(value, min), max);
        };

        p.mouseDragged = () => {
            let x = clamp(p.floor(p.mouseX), 1, p.width - 2);
            let y = clamp(p.floor(p.mouseY), 1, p.height - 2);
            this.current[x][y] = 255;
        };
    }

    update() {
        this.current = this.current === this.frame1 ? this.frame2 : this.frame1;
        this.next = this.next === this.frame1 ? this.frame2 : this.frame1;
    }

    draw() {
        for (let x = 1; x < this.cols - 1; x++) {
            for (let y = 1; y < this.rows - 1; y++) {
                this.current[x][y] =
                    (this.next[x - 1][y] +
                        this.next[x + 1][y] +
                        this.next[x][y + 1] +
                        this.next[x][y - 1]) /
                        2 -
                    this.current[x][y];

                this.current[x][y] = this.current[x][y] * this.damping;
            }
        }

        this.p.loadPixels();
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                //figure out where we are in the 1 dim array of pixels
                let index = x + y * this.cols;
                let value = this.p.floor(this.current[x][y]);

                this.p.pixels[index * 4] = value;
                this.p.pixels[index * 4 + 1] = value;
                this.p.pixels[index * 4 + 2] = value;
                this.p.pixels[index * 4 + 3] = 255;
            }
        }

        this.p.updatePixels();
    }
}
