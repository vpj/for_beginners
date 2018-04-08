import { CELL_SIZE, BLOCK_SIZE, ELLIPSES, SVG_NS } from "./consts"
import { Tensor } from "./tensor";

class Cell2D {
    parent: SVGGElement
    elem: SVGElement
    x: number
    y: number
    tensor: Tensor2D
    highlight: Highlight

    constructor(x: number, y: number, highlight: Highlight, tensor: Tensor2D, parent: SVGGElement) {
        this.parent = parent
        this.x = x
        this.y = y
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
        this.elem = this.renderFace(
            [this.tensor.getPoint(this.x, this.y),
                this.tensor.getPoint(this.x, this.y + 1),
                this.tensor.getPoint(this.x + 1, this.y + 1),
                this.tensor.getPoint(this.x + 1, this.y)]
        )
        this.parent.appendChild(this.elem)
    }

    renderLabel(face: string, label: string) {
        let text = document.createElementNS(SVG_NS, "text")
        
        let p: Point
        switch(face) {
            case "top":
                this.elem = text
                p = this.tensor.getPoint(this.x + 0.5, this.y+0.5)
                p.y -= 9
                break;
            default:
                this.elem = text
                p = this.tensor.getPoint(this.x + 0.5, this.y+0.5)
                p.x -= CELL_SIZE
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

class Tensor2D implements Tensor {
    parent: HTMLElement
    content: SVGElement
    elem: SVGGElement
    x: number
    y: number
    highlight: { [position: string]: Highlight } = {}

    constructor(x: number, y: number, highlight: Highlight[], parent: HTMLElement) {
        this.parent = parent
        this.x = x
        this.y = y
        for (let h of highlight) {
            let p = `${h.position[0]}_${h.position[1]}`
            this.highlight[p] = h
        }

    }

    get X(): number {
        return Math.min(this.x, 7)
    }
    get Y(): number {
        return Math.min(this.y, 7)
    }

    getPoint(x: number, y: number): Point {
        return { x: x * CELL_SIZE, y: y * CELL_SIZE }
    }


    render() {
        this.renderFrame();
        this.renderCells();
        this.renderXLabels();
        this.renderYLabels()
    }

    protected renderFrame() {
        this.content = document.createElementNS(SVG_NS, "svg")
        this.content.classList.add("fbeg-2d-content")
        this.parent.appendChild(this.content)

        this.elem = document.createElementNS(SVG_NS, "g")
        this.elem.classList.add("fbeg-2d")
        this.content.appendChild(this.elem)

        this.content.style.width = `${this.getPoint(this.X, 0).x - this.getPoint(-1, 0).x}px`
        this.content.style.height = `${this.getPoint(0, this.Y).y - this.getPoint(0, -1).y}px`
        this.elem.style.transform = `translate(${-this.getPoint(-1, 0).x}px, ${-this.getPoint(0, -1).y}px)`
    }

    protected renderCells() {
        for (let x = 0; x < this.X; ++x) {
            for (let y = 0; y < this.Y; ++y) {
                if (this.x > this.X) {
                    if (x == this.X - 2) continue
                }
                if (this.y > this.Y) {
                    if (y == this.Y - 2) continue
                }

                let p = `${x}_${y}`

                let cell = new Cell2D(x, y, this.highlight[p], this, this.elem)
                cell.render()
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

            let cell = new Cell2D(x, 0, null, this, this.elem)
            cell.renderLabel("top", label)
        }
    }

    protected renderYLabels() {
        for (let y = 0; y < this.Y; ++y) {
            let label = `${y}`
            if (this.y > this.Y) {
                if (y == this.Y - 2) label = ELLIPSES
                if (y == this.Y - 1) label = `${this.y - 1}`
            }

            let cell = new Cell2D(0, y, null, this, this.elem)
            cell.renderLabel("front", label)
        }
    }
}


export { Tensor2D }