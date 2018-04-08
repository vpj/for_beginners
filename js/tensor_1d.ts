import { Tensor2D } from "./tensor_2d";

class Tensor1D extends Tensor2D {
    constructor(size: number[], end: string[], highlight: Highlight[], parent: HTMLElement) {
        super(size, end, highlight, parent)
    }

    render() {
        this.renderFrame();
        this.renderCells();
        this.renderLabels(0);
    }
}

export { Tensor1D }