import {Coordinate} from './Coordinate'

function offset(val){
    if(val == 0 ) return val;
    if(val > 0) return val+0.1;
    if(val < 0) return val-0.1;
}

class CubeRenderer{
    cube;
    geometry;
    constructor(scene:THREE.scene){
        this.geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshPhongMaterial( { specular: 0xffffff,
            shininess: 20, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
        //geometry.faces[0].color = new THREE.Color( 0xff0000 );
        //geometry.faces[1].color = new THREE.Color( 0x000f00 );
        //geometry.faces[4].color = new THREE.Color( 0xff000f );
        this.cube = new THREE.Mesh( this.geometry, material );

        scene.add(this.cube);
    }

    colorFace(){
        for(var faceIdx in this.geometry.faces){
            var face = this.geometry.faces[faceIdx];
            if(face.normal.equals(new THREE.Vector3(1,0,0))){
                face.color = new THREE.Color(0xffff00);
            } else if(face.normal.equals(new THREE.Vector3(0,1,0))){
                face.color = new THREE.Color(0xff0000);
            } else if(face.normal.equals(new THREE.Vector3(0,0,1))){
                face.color = new THREE.Color(0x0000ff);
            } else if(face.normal.equals(new THREE.Vector3(-1,0,0))){
                face.color = new THREE.Color(0x00ff00);
            } else if(face.normal.equals(new THREE.Vector3(0,-1,0))){
                face.color = new THREE.Color(0x00ffff);
            } else if(face.normal.equals(new THREE.Vector3(0,0,-1))){
                face.color = new THREE.Color(0xff00ff);
            }

        }
    }

    setPos(coord:Coordinate){

        coord.print();
        this.cube.position.x = offset(coord.x);
        this.cube.position.y = offset(coord.y);
        this.cube.position.z = offset(coord.z);
    }

    rotateX(angle){
        this.cube.rotateX(angle);
    }

}

export class Cube{
    coord:Coordinate;
    renderer: CubeRenderer;
    constructor(x:number, y:number, z:number, scene:THREE.scene){
        this.coord = new Coordinate(x,y,z);
        this.renderer = new CubeRenderer(scene);
        this.renderer.setPos(this.coord);
    }
    colorFace(){
        this.renderer.colorFace();
    }

    rotateX(angle){
        this.renderer.rotateX(angle);
    }
    print(){
       this.coord.print();
    }

}