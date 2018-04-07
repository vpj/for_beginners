import { CELL_SIZE, BLOCK_SIZE, ELLIPSES } from "./consts"
import { Tensor } from "./tensor";

class Cell2D {
    parent: HTMLElement
    elem: HTMLElement
    face: HTMLElement
    x: number
    y: number
    tensor: Tensor2D

    constructor(x: number, y: number, tensor: Tensor2D, parent: HTMLElement) {
        this.parent = parent
        this.x = x
        this.y = y
        this.tensor = tensor
    }

    render(isBorderRight: boolean, isBorderBottom: boolean) {
        this.renderCellContainer()

        this.face = document.createElement("div")
        this.face.classList.add(`fbeg-face`)
        if (isBorderRight) this.face.classList.add("fbeg-face-right")
        if (isBorderBottom) this.face.classList.add("fbeg-face-bottom")
        this.elem.appendChild(this.face)
    }

    renderLabel(label: string) {
        this.renderCellContainer()

        this.face = document.createElement("div")
        this.face.classList.add(`fbeg-label`)
        this.face.classList.add(`fbeg-face`)
        this.face.textContent = label
        this.elem.appendChild(this.face)
    }

    private renderCellContainer() {
        this.elem = document.createElement("div")
        this.elem.classList.add("fbeg-cell")
        this.parent.appendChild(this.elem)

        let x = this.x
        let y = this.y
        this.elem.style.top = `${y * CELL_SIZE}px`
        this.elem.style.left = `${x * CELL_SIZE}px`
    }
}

class Tensor2D implements Tensor {
    parent: HTMLElement
    container: HTMLElement
    content: HTMLElement
    elem: HTMLElement
    x: number
    y: number

    constructor(x: number, y: number, parent: HTMLElement) {
        this.parent = parent
        this.x = x
        this.y = y
    }

    get X(): number {
        return Math.min(this.x, 7)
    }
    get Y(): number {
        return Math.min(this.y, 7)
    }

    render() {
        this.renderFrame();
        this.renderCells();
        this.renderXLabels();
        this.renderYLabels()
    }

    protected renderFrame() {
        this.container = document.createElement("div")
        this.container.classList.add("fbeg-tensor-container")
        this.parent.appendChild(this.container)

        this.content = document.createElement("div")
        this.content.classList.add("fbeg-2d-content")
        this.container.appendChild(this.content)

        this.elem = document.createElement("div")
        this.elem.classList.add("fbeg-2d")
        this.content.appendChild(this.elem)

        let w = (1.2 + this.X) * CELL_SIZE
        let h = (1.2 + this.Y) * CELL_SIZE

        this.container.style.width = `${w}px`
        this.container.style.height = `${h}px`
    }

    protected renderCells() {
        for (let x = 0; x < this.X; ++x) {
            for (let y = 0; y < this.Y; ++y) {
                let isBorderRight = false
                let isBorderBottom = false
                if (this.x > this.X) {
                    if (x == this.X - 3) isBorderRight = true
                    if (x == this.X - 2) continue
                }
                if (this.y > this.Y) {
                    if (y == this.Y - 3) isBorderBottom = true
                    if (y == this.Y - 2) continue
                }

                if (x == this.X - 1) isBorderRight = true
                if (y == this.Y - 1) isBorderBottom = true

                let cell = new Cell2D(x, y, this, this.elem)
                cell.render(isBorderRight, isBorderBottom)
            }
        }
    }

    protected renderXLabels() {
        for (let x = 0; x < this.X; ++x) {
            let label = `${x}`
            if (this.x > this.X) {
                if (x == this.X - 2) label = ELLIPSES
                if (x == this.X - 1) label = `${this.x - 1}`
            }

            let cell = new Cell2D(x, -1, this, this.elem)
            cell.renderLabel(label)
        }
    }

    protected renderYLabels() {
        for (let y = 0; y < this.Y; ++y) {
            let label = `${y}`
            if (this.y > this.Y) {
                if (y == this.Y - 2) label = ELLIPSES
                if (y == this.Y - 1) label = `${this.y - 1}`
            }

            let cell = new Cell2D(-1, y, this, this.elem)
            cell.renderLabel(label)
        }
    }
}


export { Tensor2D }