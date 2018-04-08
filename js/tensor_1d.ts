import { Tensor2D } from "./tensor_2d";

class Tensor1D extends Tensor2D {
    constructor(size: number[], end: string[], options: Options, parent: HTMLElement) {
        super(size.concat([1]), end.concat([null]), options, parent)
    }

    render() {
        this.renderFrame();
        this.renderCells();
        this.renderLabels(0);
    }
}

export { Tensor1D }