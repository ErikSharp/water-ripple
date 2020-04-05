import p5 from "p5";
import { Drawable } from "./drawable";
import { Updatable } from "./updatable";
import { Ripple } from "./ripple";

export class Sketch implements Drawable, Updatable {
    updatables: Updatable[] = [];
    drawables: Drawable[] = [];
    cols = 300;
    rows = 300;

    constructor(private p: p5) {
        p.createCanvas(this.cols, this.rows);
        let ripple = new Ripple(p, this.cols, this.rows);
        this.updatables.push(ripple);
        this.drawables.push(ripple);
    }

    update() {
        this.updatables.forEach((u) => u.update());
    }

    draw() {
        this.p.background(0);
        this.drawables.forEach((d) => d.draw());
    }
}
