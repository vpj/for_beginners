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
    x: number
    y: number
    z: number
    highlight: string
    tensor: Tensor3D

    constructor(x: number, y: number, z: number, highlight: string, tensor: Tensor3D, parent: SVGGElement) {
        this.parent = parent
        this.x = x
        this.y = y
        this.z = z
        this.highlight = highlight
        this.tensor = tensor
    }

    render(hasFaces: CellHasFaces) {
        this.renderCellContainer()

        if (hasFaces.top) {
            this.topFace = this.renderFace(
                [this.tensor.getPoint(this.x, this.y, this.z),
                this.tensor.getPoint(this.x, this.y, this.z + 1),
                this.tensor.getPoint(this.x + 1, this.y, this.z + 1),
                this.tensor.getPoint(this.x + 1, this.y, this.z)],
                "top"
            )
            this.elem.appendChild(this.topFace);
        }

        if(hasFaces.front) {
            this.frontFace = this.renderFace(
                [this.tensor.getPoint(this.x, this.y, this.z),
                this.tensor.getPoint(this.x, this.y + 1, this.z),
                this.tensor.getPoint(this.x + 1, this.y + 1, this.z),
                this.tensor.getPoint(this.x + 1, this.y, this.z)],
                "front"
            )
            this.elem.appendChild(this.frontFace);
        }

        if(hasFaces.side) {
            this.sideFace = this.renderFace(
                [this.tensor.getPoint(this.x + 1, this.y, this.z),
                this.tensor.getPoint(this.x + 1, this.y + 1, this.z),
                this.tensor.getPoint(this.x + 1, this.y + 1, this.z + 1),
                this.tensor.getPoint(this.x + 1, this.y, this.z + 1)],
                "side"
            )
            this.elem.appendChild(this.sideFace);
        }
    }

    private renderFace(points: Point[], cssClass: string): SVGElement {
        let face = document.createElementNS(SVG_NS, "polygon")

        face.classList.add("fbeg-face")
        face.classList.add(`fbeg-face-${cssClass}`)

        let pointsStr = ""
        for (let p of points) {
            pointsStr += `${p.x},${p.y} `
        }
        face.setAttribute("points", pointsStr)
        if(this.highlight != null) {
            face.style.fill = this.highlight
        }
        return face
    }

    renderLabel(face: string, label: string) {
        this.renderCellContainer()

        let text = document.createElementNS(SVG_NS, "text")
        
        let p: Point
        switch(face) {
            case "top":
                this.topFace = text
                p = this.tensor.getPoint(this.x + 0.5, this.y+0.5, this.z)
                p.y -= 9
                break;
            case "side":
                this.sideFace = text
                p = this.tensor.getPoint(this.x + 1, this.y+0.5, this.z+0.5)
                p.y -= 9
                break;
            default:
                this.frontFace = text
                p = this.tensor.getPoint(this.x + 0.5, this.y+0.5, this.z)
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

class Tensor3D implements Tensor {
    parent: HTMLElement
    content: SVGElement
    elem: SVGGElement
    x: number
    y: number
    z: number
    highlight: { [position: string]: string } = {}
    maxX = 12
    maxY = 12
    maxZ = 12

    constructor(x: number, y: number, z: number, highlight: Highlight[], parent: HTMLElement) {
        this.parent = parent
        this.x = x
        this.y = y
        this.z = z
        for (let h of highlight) {
            let p = h.position.join('_')
            this.highlight[p] = h.color
        }
    }

    getPoint(x: number, y: number, z: number): Point {
        let angleX = Math.PI / 12
        let angleZ = Math.PI / 9
        let dx = x * Math.cos(angleX) + z * Math.cos(angleZ);
        let dy = x * Math.sin(angleX) - z * Math.sin(angleZ) + y;

        return { x: dx * CELL_SIZE, y: dy * CELL_SIZE }
    }

    get X(): number {
        return Math.min(this.x, this.maxX)
    }
    get Y(): number {
        return Math.min(this.y, this.maxY)
    }
    get Z(): number {
        return Math.min(this.z, this.maxZ)
    }

    render() {
        this.renderFrame();
        this.renderCells();
        this.renderXLabels();
        this.renderYLabels();
        this.renderZLabels();
    }

    protected renderFrame() {
        this.content = document.createElementNS(SVG_NS, "svg")
        this.content.classList.add("fbeg-3d-content")
        this.parent.appendChild(this.content)

        this.elem = document.createElementNS(SVG_NS, "g")
        this.elem.classList.add("fbeg-3d")
        this.content.appendChild(this.elem)

        this.content.style.width = `${this.getPoint(this.X, 0, this.Z).x - this.getPoint(-1, 0, 0).x}px`
        this.content.style.height = `${this.getPoint(this.X, this.Y, 0).y - this.getPoint(0, 0, this.Z).y}px`
        console.log(`translate(${this.getPoint(-1, 0, 0).x}, ${-this.getPoint(0, 0, this.Z).y})`)
        this.elem.style.transform = `translate(${-this.getPoint(-1, 0, 0).x}px, ${-this.getPoint(0, 0, this.Z).y}px)`
    }

    protected renderCells() {
        let faces = new Array<boolean>(6)

        for (let x = 0; x < this.X; ++x) {
            for (let y = 0; y < this.Y; ++y) {
                for (let z = 0; z < this.Z; ++z) {
                    let faces: CellHasFaces = {
                        top: y == 0,
                        front: z == 0,
                        side: x == this.X - 1
                    }
                    if (this.x > this.X) {
                        if (x == this.X - 3) faces.side = true
                        if (x == this.X - 2) continue
                    }
                    if (this.y > this.Y) {
                        if (y == this.Y - 2) continue
                        if (y == this.Y - 1) faces.top = true
                    }
                    if (this.z > this.Z) {
                        if (z == this.Z - 2) continue
                        if (z == this.Z - 1) faces.front = true
                    }

                    if (!faces.top && !faces.front && !faces.side) {
                        continue
                    }

                    let p = `${x}_${y}_${z}`
                    let cell = new Cell3D(x, y, z, this.highlight[p], this, this.elem)
                    cell.render(faces)
                }
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

            let cell = new Cell3D(x, 0, 0, null, this, this.elem)
            cell.renderLabel('top', label)
        }
    }

    protected renderYLabels() {
        for (let y = 0; y < this.Y; ++y) {
            let label = `${y}`
            if (this.y > this.Y) {
                if (y == this.Y - 2) label = ELLIPSES
                if (y == this.Y - 1) label = `${this.y - 1}`
            }

            let cell = new Cell3D(0, y, 0, null, this, this.elem)
            cell.renderLabel('front', label)
        }
    }

    protected renderZLabels() {
        for (let z = 0; z < this.Z; ++z) {
            let label = `${z}`
            if (this.z > this.Z) {
                if (z == this.Z - 2) label = ELLIPSES
                if (z == this.Z - 1) label = `${this.z - 1}`
            }

            let cell = new Cell3D(this.X - 1, 0, z, null, this, this.elem)
            cell.renderLabel('side', label)
        }
    }
}

export { Tensor3D }