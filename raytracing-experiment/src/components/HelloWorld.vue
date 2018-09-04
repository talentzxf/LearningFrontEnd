<template>
  <div class="MainWindow">
    <input type="button" value="up" @click="adjust(0.0,-0.1)"> <br>
    <input type="button" value="left" @click="adjust(-0.1,0.0)">
    <input type="button" value="right" @click="adjust(0.1,0.0)"> <br>
    <input type="button" value="down" @click="adjust(0.0,0.01)"> <br>

    <input type="button" value="zoomIn" @click="zoom(0.9)"> <br>
    <input type="button" value="zoomOut" @click="zoom(1.01)"> <br>

    <input type="button" value="pause/resume" @click="pauseResumeToggle()"> <br>

    cX<input v-model="cX" >
    cY<input v-model="cY" >
    scale<input v-model="scale" >

    <div id="glmaincanvas"></div>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        cX: -0.5,
        cY: -0.5,
        scale: 3.0,
        pause: false,
        pauseTime: 0.0,
        iterateCount: 100,
      };
    },
    methods:{
      adjust(deltaX, deltaY){
        this.cX += deltaX
        this.cY += deltaY
      },

      zoom(zoomFactor){
        this.scale *= zoomFactor
      },

      pauseResumeToggle(){
        this.pause = !this.pause
        var GL = require("litegl")
        var getTime = GL.utils.getTime
        this.pauseTime = getTime()
      }
    },
    mounted: function () {
      // Begin to render
      var GL = require("litegl")
      var Shader = GL.Shader;
      var getTime = GL.utils.getTime

      var gl = GL.create({width: 800, height: 800})
      document.getElementById("glmaincanvas").appendChild(gl.canvas)
      gl.animate();
      gl.captureMouse();
      var pos = [0,0];
      //build the mesh
      var texture = GL.Texture.fromURL("/static/texture.png",{temp_color:[80,120,40,255], minFilter: gl.LINEAR_MIPMAP_LINEAR});
      // //basic distort shader
      // var shader = new Shader( Shader.SCREEN_VERTEX_SHADER, "\
		// 	precision highp float;\n\
		// 	uniform sampler2D texture;\n\
		// 	uniform float u_time;\n\
		// 	uniform vec2 u_mousepos;\n\
		// 	varying vec2 v_coord;\n\
		// 	void main() {\n\
		// 		vec2 n = (v_coord - u_mousepos);\n\
		// 		float l = length(n);\n\
		// 		n /= l;\n\
		// 		vec2 uv = v_coord - n * 0.1;\n\
		// 		gl_FragColor = texture2D(texture, uv);\n\
		// 	}\n\
		// ");

      // Mandelbrot shader

      var shader = new Shader( Shader.SCREEN_VERTEX_SHADER, "\
      	precision highp float;\n\
      	varying vec2 v_coord;\n\
      	uniform float u_time;\n\
      	uniform float cX;\n\
      	uniform float cY;\n\
      	uniform float scale;\n\
      	vec2 complex_multi(vec2 a, vec2 b){\n\
      	return vec2(a.x*b.x-a.y*b.y,a.x*b.y+a.y*b.x);\n\
      	}\n\
      	vec2 iterate(vec2 val){\n\
      	  vec2 return_val = vec2(0,0);\n\
      	  for(int i = 0 ; i < " + this.iterateCount.toString() + " ; i++ ){\n\
      	   return_val = complex_multi( return_val, complex_multi(return_val,return_val)) + u_time*return_val + val;\n\
      	  }\n\
      	  return return_val;\n\
      	}\n\
    float iterate_count(vec2 val, float target){\n\
      vec2 return_val = vec2(0,0);\n\
      for(int i = 0 ; i < " + this.iterateCount.toString() + " ; i++ ){\n\
        return_val = complex_multi(return_val,return_val) + u_time*return_val + val;\n\
        if(length(return_val)>target){\n\
        return float(i);\n\
        }\n\
      }\n\
      return 0.0;\n\
    }\n\
    void main() {\n\
          vec2 c = vec2(cX,cY);\n\
      		gl_FragColor = vec4(0.0,iterate_count((v_coord+c)*scale, 30.0)/30.0,\n\
      		0.0,1.0);\n\
      	}\n\
      ");

      var _this = this
      gl.ondraw = function(){
        shader.toViewport({
          u_time : _this.pause?(_this.pauseTime%10000)*0.0005:(getTime()%10000)*0.0005,
          cX : _this.cX,
          cY : _this.cY,
          scale: _this.scale,
        });
      }

      gl.onmousemove = function(e)
      {
        pos[0] = e.canvasx;
        pos[1] = e.canvasy;
      }
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
