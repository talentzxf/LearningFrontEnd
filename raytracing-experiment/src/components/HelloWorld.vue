<template>
  <div class="MainWindow">
    <div id="glmaincanvas"></div>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
      };
    },
    mounted: function () {
      // Begin to render
      var GL = require("litegl")
      var gl = GL.create({width:800, height: 800})

      document.getElementById("glmaincanvas").appendChild(gl.canvas)
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
