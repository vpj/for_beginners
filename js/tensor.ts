abstract class Tensor {
    parent: HTMLElement
    content: SVGElement
    elem: SVGGElement
    size: number[]
    end: string[]
    fullSize: number[]
    highlight: { [position: string]: Highlight } = {}
    cellSize: number = 15

    constructor(size: number[], end: string[], options: Options, parent: HTMLElement) {
        this.parent = parent
        this.size = size
        this.end = end
        if (options.highlight != null) {
            for (let h of options.highlight) {
                let p = h.position.join('_')
                this.highlight[p] = h
            }
        }
        if (options.cellSize != null) {
            this.cellSize = options.cellSize
        }

        this.fullSize = []
        for (let i = 0; i < size.length; ++i) {
            this.fullSize.push(size[i] + (end[i] == null ? 0 : 2))
        }
    }

    abstract render(): void
}

export { Tensor }