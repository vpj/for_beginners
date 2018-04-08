import { ELLIPSES, SVG_NS } from "./consts"
import { Tensor } from "./tensor";

class Cell2D {
    parent: SVGGElement
    elem: SVGElement
    cell: number[]
    tensor: Tensor2D
    highlight: Highlight

    constructor(cell: number[], highlight: Highlight, tensor: Tensor2D, parent: SVGGElement) {
        this.parent = parent
        this.cell = cell
        this.highlight = highlight
        this.tensor = tensor
    }

    private renderFace(points: Point[]): SVGElement {
        let face = document.createElementNS(SVG_NS, "polygon")

        face.classList.add("fbeg-face")

        let pointsStr = ""
        for (let p of points) {
            pointsStr += `${p.x},${p.y} `
        }
        face.setAttribute("points", pointsStr)
        if(this.highlight != null && this.highlight.front != null) {
            face.style.fill = this.highlight.front
        }
        return face
    }

    render() {
        let x = this.cell[0]
        let y = this.cell[1]
        let z = this.cell[2]

        this.elem = this.renderFace(
            [this.tensor.getPoint(x, y),
                this.tensor.getPoint(x, y + 1),
                this.tensor.getPoint(x + 1, y + 1),
                this.tensor.getPoint(x + 1, y)]
        )
        this.parent.appendChild(this.elem)
    }

    renderLabel(face: string, label: string, cellSize: number) {
        let text = document.createElementNS(SVG_NS, "text")
        let x = this.cell[0]
        let y = this.cell[1]
        
        let p: Point
        switch(face) {
            case "top":
                this.elem = text
                p = this.tensor.getPoint(x + 0.5, y+0.5)
                p.y -= 9
                break;
            default:
                this.elem = text
                p = this.tensor.getPoint(x + 0.5, y+0.5)
                p.x -= cellSize
                p.y += 2
                break;
        }
        text.setAttribute('x', `${p.x}px`)
        text.setAttribute('y', `${p.y}px`)

        text.classList.add(`fbeg-label`)
        text.textContent = label
        this.parent.appendChild(text)
    }
}

class Tensor2D extends Tensor {
    constructor(size: number[], end: string[], options: Options, parent: HTMLElement) {
        super(size, end, options, parent)
    }

    getPoint(x: number, y: number): Point {
        return { x: x * this.cellSize, y: y * this.cellSize }
    }


    render() {
        this.renderFrame();
        this.renderCells();
        this.renderLabels(0);
        this.renderLabels(1);
    }

    protected renderFrame() {
        this.content = document.createElementNS(SVG_NS, "svg")
        this.content.classList.add("fbeg-2d-content")
        this.parent.appendChild(this.content)

        this.elem = document.createElementNS(SVG_NS, "g")
        this.elem.classList.add("fbeg-2d")
        this.content.appendChild(this.elem)

        let X = this.fullSize[0]
        let Y = this.fullSize[1]

        this.content.style.width = `${this.getPoint(X, 0).x - this.getPoint(-1, 0).x}px`
        this.content.style.height = `${this.getPoint(0, Y).y - this.getPoint(0, -1).y}px`
        this.elem.style.transform = `translate(${-this.getPoint(-1, 0).x}px, ${-this.getPoint(0, -1).y}px)`
    }

    protected renderCells() {
        let X = this.fullSize[0]
        let Y = this.fullSize[1]

        for (let x = 0; x < X; ++x) {
            for (let y = 0; y < Y; ++y) {
                if (this.end[0] != null) {
                    if (x == X - 2) continue
                }
                if (this.end[1] != null) {
                    if (y == Y - 2) continue
                }

                let p = `${x}_${y}`

                let cell = new Cell2D([x, y], this.highlight[p], this, this.elem)
                cell.render()
            }
        }
    }

    protected renderLabels(d: number) {
        for (let x = 0; x < this.fullSize[d]; ++x) {
            let label = `${x}`
            if (this.end[d] != null) {
                if (x == this.fullSize[d] - 2) label = ELLIPSES
                if (x == this.fullSize[d] - 1) label = this.end[d]
            }
            let c = [0, 0]
            c[d] = x

            let cell = new Cell2D(c, null, this, this.elem)
            cell.renderLabel("top", label, this.cellSize)
        }
    }
}


export { Tensor2D }