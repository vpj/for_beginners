import { CELL_SIZE, BLOCK_SIZE, ELLIPSES, SVG_NS } from "./consts"
import { Tensor } from "./tensor";


interface CellHasFaces {
    top: boolean,
    front: boolean,
    side: boolean
}

class Cell3D {
    parent: SVGGElement
    elem: SVGGElement
    topFace: SVGElement
    frontFace: SVGElement
    sideFace: SVGElement
    cell: number[]
    highlight: Highlight
    tensor: Tensor3D

    constructor(cell: number[], highlight: Highlight, tensor: Tensor3D, parent: SVGGElement) {
        this.parent = parent
        this.highlight = highlight
        this.tensor = tensor
        this.cell = cell
    }

    private getHighlight(face: string): string {
        if (this.highlight == null) {
            return null
        }
        switch (face) {
            case 'front':
                return this.highlight.front
            case 'side':
                return this.highlight.side
            default:
                return this.highlight.top
        }
    }
    render(hasFaces: CellHasFaces) {
        let x = this.cell[0]
        let y = this.cell[1]
        let z = this.cell[2]
        this.renderCellContainer()

        if (hasFaces.top) {
            this.topFace = this.renderFace(
                [this.tensor.getPoint(x, y, z),
                this.tensor.getPoint(x, y, z + 1),
                this.tensor.getPoint(x + 1, y, z + 1),
                this.tensor.getPoint(x + 1, y, z)],
                "top",
                this.getHighlight('top')
            )
            this.elem.appendChild(this.topFace);
        }

        if (hasFaces.front) {
            this.frontFace = this.renderFace(
                [this.tensor.getPoint(x, y, z),
                this.tensor.getPoint(x, y + 1, z),
                this.tensor.getPoint(x + 1, y + 1, z),
                this.tensor.getPoint(x + 1, y, z)],
                "front",
                this.getHighlight('front')
            )
            this.elem.appendChild(this.frontFace);
        }

        if (hasFaces.side) {
            this.sideFace = this.renderFace(
                [this.tensor.getPoint(x + 1, y, z),
                this.tensor.getPoint(x + 1, y + 1, z),
                this.tensor.getPoint(x + 1, y + 1, z + 1),
                this.tensor.getPoint(x + 1, y, z + 1)],
                "side",
                this.getHighlight('side')
            )
            this.elem.appendChild(this.sideFace);
        }
    }

    private renderFace(points: Point[], cssClass: string, highlight: string): SVGElement {
        let face = document.createElementNS(SVG_NS, "polygon")

        face.classList.add("fbeg-face")
        face.classList.add(`fbeg-face-${cssClass}`)

        let pointsStr = ""
        for (let p of points) {
            pointsStr += `${p.x},${p.y} `
        }
        face.setAttribute("points", pointsStr)
        if (highlight != null) {
            face.style.fill = highlight
        }
        return face
    }

    renderLabel(face: string, label: string) {
        let x = this.cell[0]
        let y = this.cell[1]
        let z = this.cell[2]

        this.renderCellContainer()

        let text = document.createElementNS(SVG_NS, "text")

        let p: Point
        switch (face) {
            case "top":
                this.topFace = text
                p = this.tensor.getPoint(x + 0.5, y + 0.5, z)
                p.y -= 9
                break;
            case "side":
                this.sideFace = text
                p = this.tensor.getPoint(x + 1, y + 0.5, z + 0.5)
                p.y -= 9
                break;
            default:
                this.frontFace = text
                p = this.tensor.getPoint(x + 0.5, y + 0.5, z)
                p.x -= CELL_SIZE
                break;
        }
        text.setAttribute('x', `${p.x}px`)
        text.setAttribute('y', `${p.y}px`)

        text.classList.add(`fbeg-label`)
        //text.classList.add(`fbeg-face`)
        text.classList.add(`fbeg-face-label-${face}`)
        text.textContent = label
        this.elem.appendChild(text)
    }

    private renderCellContainer() {
        this.elem = document.createElementNS(SVG_NS, "g")
        this.elem.classList.add("fbeg-cell")
        this.parent.appendChild(this.elem)
    }
}

class Tensor3D extends Tensor {
    constructor(size: number[], end: string[], highlight: Highlight[], parent: HTMLElement) {
        super(size, end, highlight, parent)
    }

    getPoint(x: number, y: number, z: number): Point {
        let angleX = Math.PI / 12
        let angleZ = Math.PI / 9
        let dx = x * Math.cos(angleX) + z * Math.cos(angleZ);
        let dy = x * Math.sin(angleX) - z * Math.sin(angleZ) + y;

        return { x: dx * CELL_SIZE, y: dy * CELL_SIZE }
    }

    render() {
        this.renderFrame();
        this.renderCells();
        this.renderLabels(0, 'top');
        this.renderLabels(1, 'front');
        this.renderLabels(2, 'side');
    }

    protected renderFrame() {
        this.content = document.createElementNS(SVG_NS, "svg")
        this.content.classList.add("fbeg-3d-content")
        this.parent.appendChild(this.content)

        this.elem = document.createElementNS(SVG_NS, "g")
        this.elem.classList.add("fbeg-3d")
        this.content.appendChild(this.elem)

        let X = this.fullSize[0]
        let Y = this.fullSize[1]
        let Z = this.fullSize[2]

        this.content.style.width = `${this.getPoint(X, 0, Z).x - this.getPoint(-1, 0, 0).x}px`
        this.content.style.height = `${this.getPoint(X, Y, 0).y - this.getPoint(0, 0, Z).y}px`
        console.log(`translate(${this.getPoint(-1, 0, 0).x}, ${-this.getPoint(0, 0, Z).y})`)
        this.elem.style.transform = `translate(${-this.getPoint(-1, 0, 0).x}px, ${-this.getPoint(0, 0, Z).y}px)`
    }

    private getFaces(cell: number[]): CellHasFaces {
        let faces: CellHasFaces = {
            top: cell[1] == 0,
            front: cell[2] == 0,
            side: cell[0] == this.fullSize[0] - 1
        }
        for (let i = 0; i < 3; ++i) {
            let c = cell[i]
            let f = this.fullSize[i]
            if (this.end[i] == null) {
                continue
            }

            if (c == f - 2) {
                return null
            }

            if (i == 0 && c == f - 3) {
                faces.side = true
            } else if (i == 1 && c == f - 1) {
                faces.side = true
            } else if (i == 2 && c == f - 1) {
                faces.front = true
            }
        }

        if (!faces.top && !faces.front && !faces.side) {
            return null
        }

        return faces
    }

    protected renderCells() {
        let faces = new Array<boolean>(6)

        let c = [0, 0, -1]
        while (true) {
            c[2]++
            for (let i = 2; i > 0; --i) {
                if (c[i] >= this.fullSize[i]) {
                    c[i] = 0
                    c[i - 1]++
                }
            }

            if (c[0] >= this.fullSize[0]) {
                break
            }

            let faces = this.getFaces(c)
            if (faces == null) {
                continue
            }

            let p = c.join('_')
            let cell = new Cell3D(c, this.highlight[p], this, this.elem)
            cell.render(faces)
        }
    }

    protected renderLabels(d: number, face: string) {
        for (let x = 0; x < this.fullSize[d]; ++x) {
            let label = `${x}`
            if (this.end[d] != null) {
                if (x == this.fullSize[d] - 2) label = ELLIPSES
                if (x == this.fullSize[d]  - 1) label = this.end[d]
            }

            let c = [0, 0, 0]
            c[d] = x
            if(d == 2) {
                c[0] = this.fullSize[0] - 1
            }
            let cell = new Cell3D(c, null, this, this.elem)
            cell.renderLabel(face, label)
        }
    }
}

export { Tensor3D }