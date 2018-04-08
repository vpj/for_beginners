abstract class Tensor {
    parent: HTMLElement
    content: SVGElement
    elem: SVGGElement
    size: number[]
    end: string[]
    fullSize: number[]
    highlight: { [position: string]: Highlight } = {}

    constructor(size: number[], end: string[], highlight: Highlight[], parent: HTMLElement) {
        this.parent = parent
        this.size = size
        this.end = end
        for (let h of highlight) {
            let p = h.position.join('_')
            this.highlight[p] = h
        }

        this.fullSize = []
        for (let i = 0; i < size.length; ++i) {
            this.fullSize.push(size[i] + (end[i] == null ? 0 : 2))
        }
    }

    abstract render(): void
}

export {Tensor}