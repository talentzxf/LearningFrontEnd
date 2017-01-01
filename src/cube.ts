import {Coordinate} from './Coordinate'

function offset(val){
    if(val == 0 ) return val;
    if(val > 0) return val+0.1;
    if(val < 0) return val-0.1;
}

enum COLORS{
    B = 0x0000FF,  // blue
    Y = 0xFFFF00,  // yellow
    G = 0x00FF00,  // green
    O = 0xFF9900,  // orange
    R = 0xFF0000,  // red
    W = 0xFFFFFF   // white
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
                face.color = new THREE.Color(COLORS.G);
            } else if(face.normal.equals(new THREE.Vector3(0,1,0))){
                face.color = new THREE.Color(COLORS.R);
            } else if(face.normal.equals(new THREE.Vector3(0,0,1))){
                face.color = new THREE.Color(COLORS.W);
            } else if(face.normal.equals(new THREE.Vector3(-1,0,0))){
                face.color = new THREE.Color(COLORS.B);
            } else if(face.normal.equals(new THREE.Vector3(0,-1,0))){
                face.color = new THREE.Color(COLORS.O);
            } else if(face.normal.equals(new THREE.Vector3(0,0,-1))){
                face.color = new THREE.Color(COLORS.Y);
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

    rotateAxisAngle(axis:THREE.Vector3, angle:number){

        this.cube.rotateOnAxis(axis, angle);
    }

    getGeometry(){
        return this.cube;
    }

    setFaceColor(f:string,c:string){
        let faceArray = f.split("");
        let colorArray = c.split("");

        let colorFaceMapObj = _.object(faceArray,colorArray);

        for(var faceIdx in this.geometry.faces){
            var face = this.geometry.faces[faceIdx];
            if(face.normal.equals(new THREE.Vector3(1,0,0))){
                if(colorFaceMapObj.R != null )
                    face.color = new THREE.Color(COLORS[colorFaceMapObj.R]);
            } else if(face.normal.equals(new THREE.Vector3(0,1,0))){
                if(colorFaceMapObj.U != null )
                    face.color = new THREE.Color(COLORS[colorFaceMapObj.U]);
            } else if(face.normal.equals(new THREE.Vector3(0,0,1))){
                if(colorFaceMapObj.F != null )
                    face.color = new THREE.Color(COLORS[colorFaceMapObj.F]);
            } else if(face.normal.equals(new THREE.Vector3(-1,0,0))){
                if(colorFaceMapObj.L != null )
                    face.color = new THREE.Color(COLORS[colorFaceMapObj.L]);
            } else if(face.normal.equals(new THREE.Vector3(0,-1,0))){
                if(colorFaceMapObj.D != null )
                    face.color = new THREE.Color(COLORS[colorFaceMapObj.D]);
            } else if(face.normal.equals(new THREE.Vector3(0,0,-1))){
                if(colorFaceMapObj.B != null )
                    face.color = new THREE.Color(COLORS[colorFaceMapObj.B]);
            }
        }
    }

}

export class Cube{
    coord:Coordinate;
    renderer: CubeRenderer;
    tags:Array = [];
    originTags: Array = [];
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
    rotateAxisAngle(axis:THREE.Vector3, angle:number){
        this.renderer.rotateAxisAngle(axis, angle);
    }
    print(){
       this.coord.print();
    }
    getGeometry(){
        return this.renderer.getGeometry();
    }

    setTag(idx:number,c:string){
        this.tags[idx] = c;
    }

    addTag(c:string){
        this.tags.push(c);
    }

    getTags(){
        return this.tags;
    }

    addOriginTag(c:string){
        this.originTags.push(c);
    }

    setFaceColor(f:string, c:string){
        this.renderer.setFaceColor(f,c);
    }

    getOriginTags(){
        return this.originTags;
    }

    consolidateTag(fromFace:string, toFace:string){
        for(var tagIdx in this.tags){
            if(this.tags[tagIdx] == fromFace){
                this.tags[tagIdx] = toFace;
            }
        }
    }
}