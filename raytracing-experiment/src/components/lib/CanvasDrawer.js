class CanvasDrawer{
  constructor(canvasId){
    var ele = document.getElementById(canvasId)

    if(ele.getContext){
      this.ctx = ele.getContext("2d")
    }
  }

  drawCoordinate(){
    this.ctx.beginPath();
    this.ctx.arc(95, 50, 40, 0, 2 * Math.PI);
    this.ctx.stroke();
  }
}

export {CanvasDrawer}
