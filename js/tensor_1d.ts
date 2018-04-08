import { Tensor2D } from "./tensor_2d";

class Tensor1D extends Tensor2D {
    constructor(x: number, highlight: Highlight[], parent: HTMLElement) {
        super(x, 1, highlight, parent);
    }

    render() {
        this.renderFrame();
        this.renderCells();
        this.renderXLabels();
    }
}

export { Tensor1D }