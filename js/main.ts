import { Tensor3D } from "./tensor_3d";
import { Tensor2D } from "./tensor_2d";
import { Tensor } from "./tensor";
import { Tensor1D } from "./tensor_1d";

function breakdownDimensions(dimensions: any[]) {
  let result: number[][] = new Array<number[]>();

  let isSpecified = false;
  for (let v of dimensions) {
    if (typeof (v) != "number") {
      isSpecified = true;
    }
  }

  if (isSpecified) {
    for (let v of dimensions) {
      if (typeof (v) == "number") {
        result.push([v]);
      } else {
        if (v.length > 0) {
          result.push(v);
        } else if(v.length > 3) {
          return [];
        }
      }
    }
  } else {
    for (let i = 0; i < dimensions.length - 3; ++i) {
      result.push([dimensions[i]]);
    }
    let last = new Array<number>();
    for (let i = Math.max(0, dimensions.length - 3); i < dimensions.length; ++i) {
      last.push(dimensions[i]);
    }
    if (last.length > 0) {
      result.push(last);
    }
  }

  return result;
}

function renderTensor(id: string, dimensions: any[]) {
  let container = document.getElementById(id)
  if (container == null) {
    return
  }
  container.classList.add("fbeg-container")

  let dimensionsBreakdown = breakdownDimensions(dimensions);
  if(dimensionsBreakdown.length <= 0) {
    return
  }

  for(let d of dimensionsBreakdown) {
    let tensor: Tensor
    if(d.length == 1) {
      tensor = new Tensor1D(d[0], container);
    } else if(d.length == 2) {
      tensor = new Tensor2D(d[0], d[1], container);
    } else {
      tensor = new Tensor3D(d[0], d[1], d[2], container);      
    }

    tensor.render()
  }
}

function test() {
  renderTensor("testing-div", [5, [3, 2], [10, 10, 28]])
}

export { renderTensor, test }
