<template>
<div>
</div>
</template>

<script>
    export default {
        name: "InvertedPendulum",
        data: function(){
          return {
            renderer: new THREE.WebGLRenderer(),
            scene: new THREE.Scene(),
            camera: null,
            cube: null
          }
        },
        methods: {
          animate: function(){
            requestAnimationFrame(this.animate)
            this.renderer.render(this.scene, this.camera)
            this.cube.rotation.x += 0.01;
            this.cube.rotation.y += 0.01;
          }
        },
        mounted: function ()  {
          this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

          var geometry = new THREE.BoxGeometry( 1, 1, 1 );
          var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
          this.cube = new THREE.Mesh( geometry, material );
          this.scene.add( this.cube );

          this.camera.position.z = 5;
          this.renderer.setSize( window.innerWidth, window.innerHeight );
          document.body.appendChild( this.renderer.domElement );
          this.animate()
        }
    }
</script>

<style scoped>
</style>
