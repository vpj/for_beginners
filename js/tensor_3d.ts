import { CELL_SIZE, BLOCK_SIZE, ELLIPSES } from "./consts"
import { Tensor } from "./tensor";

class Cell3D {
    parent: HTMLElement
    elem: HTMLElement
    faces: HTMLElement[]
    x: number
    y: number
    z: number
    tensor: Tensor3D

    constructor(x: number, y: number, z: number, tensor: Tensor3D, parent: HTMLElement) {
        this.parent = parent
        this.x = x
        this.y = y
        this.z = z
        this.tensor = tensor
    }

    render(hasFaces: boolean[]) {
        this.renderCellContainer()

        this.faces = new Array<HTMLElement>(6)
        for (let i = 0; i < 6; ++i) {
            if (hasFaces && hasFaces[i] == false)
                continue
            this.faces[i] = document.createElement("div")
            this.faces[i].classList.add(`fbeg-face`)
            this.faces[i].classList.add(`fbeg-face-${i + 1}`)
            this.elem.appendChild(this.faces[i])
        }
    }

    renderLabel(face: number, label: string) {
        this.renderCellContainer()

        this.faces = new Array<HTMLElement>(6)
        this.faces[face] = document.createElement("div")
        this.faces[face].classList.add(`fbeg-label`)
        this.faces[face].classList.add(`fbeg-face`)
        this.faces[face].classList.add(`fbeg-face-${face + 1}`)
        this.faces[face].textContent = label
        this.elem.appendChild(this.faces[face])
    }

    private renderCellContainer() {
        this.elem = document.createElement("div")
        this.elem.classList.add("fbeg-cell")
        this.parent.appendChild(this.elem)

        let z = BLOCK_SIZE - this.z
        let x = BLOCK_SIZE - this.tensor.X + this.x + 1
        let y = this.tensor.Y - this.y
        this.elem.style.top = `${z * CELL_SIZE}px`
        this.elem.style.left = `${x * CELL_SIZE}px`
        this.elem.style.transform = `translate3d(0px, 0px, ${y * CELL_SIZE}px)`
    }
}

class Tensor3D implements Tensor {
    parent: HTMLElement
    container: HTMLElement
    content: HTMLElement
    elem: HTMLElement
    x: number
    y: number
    z: number
    xLabel: string
    yLabel: string
    zLabel: string

    constructor(x: number, y: number, z: number, parent: HTMLElement) {
        this.parent = parent
        if (typeof(x) == "string") {
            this.x = 10
            this.xLabel = x
        } else {
            this.x = x
            this.xLabel = `${x - 1}`
        }
        if (typeof(y) == "string") {
            this.y = 10
            this.yLabel = y
        } else {
            this.y = y
            this.yLabel = `${y - 1}`
        }
        if (typeof(z) == "string") {
            this.z = 10
            this.zLabel = z
        } else {
            this.z = z
            this.zLabel = `${z - 1}`
        }
    }

    get X(): number {
        return Math.min(this.x, 7)
    }
    get Y(): number {
        return Math.min(this.y, 7)
    }
    get Z(): number {
        return Math.min(this.z, 7)
    }

    render() {
        this.renderFrame();
        this.renderCells();
        this.renderXLabels();
        this.renderYLabels();
        this.renderZLabels();
    }

    protected renderFrame() {
        this.container = document.createElement("div")
        this.container.classList.add("fbeg-tensor-container")
        this.parent.appendChild(this.container)

        this.content = document.createElement("div")
        this.content.classList.add("fbeg-3d-content")
        this.container.appendChild(this.content)

        this.elem = document.createElement("div")
        this.elem.classList.add("fbeg-3d")
        this.content.appendChild(this.elem)

        let l = (1 + Math.cos(Math.PI / 5.5) * this.X) * CELL_SIZE
        let L = (1 + Math.cos(Math.PI / 5.5) * 7) * CELL_SIZE
        let r = (0 + Math.cos(Math.PI / 6) * this.Z) * CELL_SIZE
        let R = (0 + Math.cos(Math.PI / 6) * 7) * CELL_SIZE
        let b = CELL_SIZE
        let t = (1 + this.Y + (Math.sin(Math.PI / 6) + Math.sin(Math.PI / 48)) * (this.Z + this.X) / 2) * CELL_SIZE
        let T = (1 + 7 + (Math.sin(Math.PI / 6) + Math.sin(Math.PI / 48)) * 7) * CELL_SIZE

        this.container.style.width = `${l + r}px`
        this.container.style.height = `${t + b}px`
        this.content.style.left = `${l - L}px`
        this.content.style.top = `${t - T}px`
        //this.elem.style.width = `${200}px`
        //this.elem.style.height = `${200}px`
    }

    protected renderCells() {
        let faces = new Array<boolean>(6)

        for (let x = 0; x < this.X; ++x) {
            for (let y = 0; y < this.Y; ++y) {
                for (let z = 0; z < this.Z; ++z) {
                    faces[0] = y == 0 //top
                    faces[1] = z == this.Z - 1 //back
                    faces[2] = z == 0 //front
                    faces[3] = x == 0 //side behind
                    faces[4] = x == this.X - 1 //side front
                    faces[5] = y == this.Y - 1 // bottom

                    if (this.x > this.X) {
                        if (x == this.X - 3) faces[4] = true
                        if (x == this.X - 2) continue
                        if (x == this.X - 1) faces[3] = true
                    }
                    if (this.y > this.Y) {
                        if (y == this.Y - 3) faces[5] = true
                        if (y == this.Y - 2) continue
                        if (y == this.Y - 1) faces[0] = true
                    }
                    if (this.z > this.Z) {
                        if (z == this.Z - 3) faces[1] = true
                        if (z == this.Z - 2) continue
                        if (z == this.Z - 1) faces[2] = true
                    }

                    let has = false
                    for (let i = 0; i < 6; ++i) {
                        if (faces[i])
                            has = true
                    }

                    if (!has)
                        continue

                    let cell = new Cell3D(x, y, z, this, this.elem)
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
                if (x == this.X - 1) label = this.xLabel
            }

            let cell = new Cell3D(x, -1, 0, this, this.elem)
            cell.renderLabel(2, label)
        }
    }

    protected renderYLabels() {
        for (let y = 0; y < this.Y; ++y) {
            let label = `${y}`
            if (this.y > this.Y) {
                if (y == this.Y - 2) label = ELLIPSES
                if (y == this.Y - 1) label = this.yLabel
            }

            let cell = new Cell3D(-1, y, 0, this, this.elem)
            cell.renderLabel(2, label)
        }
    }

    protected renderZLabels() {
        for (let z = 0; z < this.Z; ++z) {
            let label = `${z}`
            if (this.z > this.Z) {
                if (z == this.Z - 2) label = ELLIPSES
                if (z == this.Z - 1) label = this.zLabel
            }

            let cell = new Cell3D(this.X - 1, -1, z, this, this.elem)
            cell.renderLabel(4, label)
        }
    }
}

export { Tensor3D }