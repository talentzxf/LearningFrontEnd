import {Coordinate} from './Coordinate'

function offset(val){
    if(val == 0 ) return val;
    if(val > 0) return val+0.1;
    if(val < 0) return val-0.1;
}

class CubeRenderer{
    cube;
    constructor(colorIdx: number, scene:THREE.scene){
        var color:number;
        switch(colorIdx){
            case 0:
                color = 0xff0000;
            break;
            case 1:
                color = 0xffff00;
            break;
            case 2:
                color = 0x0000ff;
            break;
        }

        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshPhongMaterial( { color: color, specular: 0xffffff,
            shininess: 20, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
        this.cube = new THREE.Mesh( geometry, material );

        scene.add(this.cube);
    }

    setPos(coord:Coordinate){

        coord.print();
        this.cube.position.x = offset(coord.x);
        this.cube.position.y = offset(coord.y);
        this.cube.position.z = offset(coord.z);
    }

}

export class Cube{
    coord:Coordinate;
    renderer: CubeRenderer;
    constructor(x:number, y:number, z:number, color:number, scene:THREE.scene){
        this.coord = new Coordinate(x,y,z);
        this.renderer = new CubeRenderer(color, scene);
        this.renderer.setPos(this.coord);
    }

    print(){
       this.coord.print();
    }

}