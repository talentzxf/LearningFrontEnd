<template>
  <div>
    FuncDrawer {{result}}
  </div>
</template>
<script>
  import {calculatorGramma} from "./lib/calculator_gramma"
  import {Parser} from "jison"
  export default{
    name:"FuncDrawer",
    data: function(){
      return {
        result: -1,
      }
    },
    methods: {
      gramma: function(){
        return {

        }
      }
    },
    mounted: function(){
      var parser = new Parser(calculatorGramma)
      // var parsedResult = parser.generate();
      // console.log(parsedResult)
      parser.parse("1+2")
    }
  }
</script>
