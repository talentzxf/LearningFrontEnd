<template>
  <!-- After I found this is similar to wolfram.com, this project seems not so interesting now. -->
  <div>
    <input v-model="formula"/>
    == {{result}}

    <div>
      <template v-for="(value, index) in bindingVariables">
        {{index}}: <input v-model="bindingVariables[index]" v-on:keyup="valueChange">
      </template>
    </div>

    <canvas id="maincanvas" width="500px" height="500px" style="border:1px solid red">
    </canvas>

  </div>
</template>
<script>
  import {parser} from "./lib/calculator_gramma"
  import {CanvasDrawer} from "./lib/CanvasDrawer"

  export default {
    name: "FuncDrawer",
    data: function () {
      return {
        result: "NaN",
        formula: "Input formula here",
        bindingVariables: {},
        parser: parser,
        canvasDrawer: null,
      }
    },
    mounted: function(){
      this.canvasDrawer = new CanvasDrawer("maincanvas")
    },
    methods: {
      valueChange: function () {
        console.log(this.bindingVariables)
        this.recalculate()
      },
      recalculate: function () {
        this.parser.yy.variables = this.bindingVariables
        this.result = this.parser.parse(this.formula)

        this.redrawCanvas()
      },
      redrawCanvas: function () {
        this.canvasDrawer.drawCoordinate();
      }
    },
    watch: {
      formula: function (newFormula) {
        try {
          this.recalculate();
        } catch (e) {
          this.result = NaN
          console.log(e)
        }
      }
    }
  }
</script>
