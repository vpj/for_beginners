declare interface Window {
    //renderCube(id: string, x: number, y: number, z: number): void
    //renderMatrix(id: string, x: number, y: number): void
}

interface Highlight {
    position: number[],
    top?: string,
    front: string,
    side?: string,
  }
  
  interface Point {
    x: number
    y: number
}


interface Options {
    highlight?: Highlight[]
    cellSize?: number
}