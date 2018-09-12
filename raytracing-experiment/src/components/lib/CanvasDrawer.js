class CanvasDrawer {
  constructor(canvasId) {
    var ele = document.getElementById(canvasId)

    this.width = ele.scrollWidth
    this.height = ele.scrollHeight

    if (ele.getContext) {
      this.ctx = ele.getContext("2d")
    }

    console.log("Width:" + this.width + "Height:" + this.height)
  }

  drawCoordinate() {
    this.ctx.beginPath();
    // this.ctx.arc(95, 50, 40, 0, 2 * Math.PI);
    
    this.ctx.stroke();
  }
}

export {CanvasDrawer}
