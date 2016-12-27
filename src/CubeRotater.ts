import {Cube} from './cube';

THREE.Object3D._matrixAux = new THREE.Matrix4(); // global auxiliar variable
// Warnings: 1) axis is assumed to be normalized.
//  2) matrix must be updated. If not, call object.updateMatrix() first
//  3) this assumes we are not using quaternions
THREE.Object3D.prototype.rotateAroundWorldAxis = function(axis, radians) {
    THREE.Object3D._matrixAux.makeRotationAxis(axis, radians);
    this.matrix.multiplyMatrices(THREE.Object3D._matrixAux,this.matrix); // r56
    THREE.Object3D._matrixAux.extractRotation(this.matrix);
    this.rotation.setFromRotationMatrix(THREE.Object3D._matrixAux, this.rotation.order );
    this.position.setFromMatrixPosition( this.matrix );
}

export class CubeRotater{
    cubes = [];
    angle = 0;
    rotating = false;
    speed = 0.01;

    faceIndexArray = ['F','R','L','D','U','B'];
    faceRotateMap = {};
    rotateAxis:THREE.Vector3;
    rotateAxisIndex:string;
    scene:THREE.Scene;

    rotatingFace:string;

    initFaceRotateMap(){
        this.faceRotateMap['X'] = {};
        this.faceRotateMap['Y'] = {};
        this.faceRotateMap['Z'] = {};

        this.faceRotateMap['X']['F'] = 'D';
        this.faceRotateMap['X']['D'] = 'B';
        this.faceRotateMap['X']['B'] = 'U';
        this.faceRotateMap['X']['U'] = 'F';

        this.faceRotateMap['Y']['F'] = 'R';
        this.faceRotateMap['Y']['R'] = 'B';
        this.faceRotateMap['Y']['B'] = 'L';
        this.faceRotateMap['Y']['L'] = 'F';

        this.faceRotateMap['Z']['U'] = 'L';
        this.faceRotateMap['Z']['L'] = 'D';
        this.faceRotateMap['Z']['D'] = 'R';
        this.faceRotateMap['Z']['R'] = 'U';

    }

    constructor(scene){
        this.scene = scene;
        this.initFaceRotateMap();

        for(let index in this.faceIndexArray){
            this.cubes[this.faceIndexArray[index]] = [];
        }

        for(let x = -1; x <= 1; x++ ){
            for(let y=-1 ; y<=1 ; y++ ){
                for( let z=-1; z<=1 ;z++){
                    let newCube = new Cube(x,y,z,scene);
                    newCube.colorFace();

                    if(x == -1 ){
                        this.cubes['L'].push(newCube);
                        newCube.getGeometry().tag += "L";
                        newCube.addTag('L');
                        newCube.addOriginTag('L');
                    }

                    if(x == 1){
                        this.cubes['R'].push(newCube);
                        newCube.addTag('R');
                        newCube.getGeometry().tag += "R";
                        newCube.addOriginTag('R');
                    }

                    if(y == -1){
                        this.cubes['D'].push(newCube);
                        newCube.addTag('D');
                        newCube.getGeometry().tag += "D";
                        newCube.addOriginTag('D');
                    }

                    if(y == 1){
                        this.cubes['U'].push(newCube);
                        newCube.addTag('U');
                        newCube.getGeometry().tag += "U";
                        newCube.addOriginTag('U');
                    }

                    if(z == -1 ){
                        this.cubes['B'].push(newCube);
                        newCube.addTag('B');
                        newCube.getGeometry().tag += "B";
                        newCube.addOriginTag('B');
                    }

                    if(z == 1){
                        this.cubes['F'].push(newCube);
                        newCube.addTag('F');
                        newCube.getGeometry().tag += "F";
                        newCube.addOriginTag('F');
                    }
                }
            }
        }
    }

    update(){
        if(this.rotating){
            let childArray = this.cubes[this.rotatingFace];
            for(let idx in childArray){
                let cube = childArray[idx];
                // console.log("Rotating:" + cube.getOriginTags());
                let obj = cube.getGeometry();
                obj.rotateAroundWorldAxis(this.rotateAxis, this.speed);
            }
            this.angle += this.speed;
        }


        if( this.angle > Math.PI/2 ){
            this.angle = 0;
            this.rotating = false;

            // Move from one face to another
            for( let idx in childArray ){
                let cube = childArray[idx];
                let tags = cube.getTags();
                for(let tagIdx in tags){
                    let tag = tags[tagIdx];
                    if(this.faceRotateMap[this.rotateAxisIndex][tag] != null){
                        cube.setTag(tagIdx, this.faceRotateMap[this.rotateAxisIndex][tag]);
                        // Remove from previous arrays;
                        this.cubes[tag] = _.without(this.cubes[tag], cube);
                    }
                }
             }

            // Reconsolidate all cubes according to tag
            for( let idx in childArray ){
                let cube = childArray[idx];
                let tags = cube.getTags();
                for(let tagIdx in tags){
                    let tag = tags[tagIdx];
                    if(this.faceRotateMap[this.rotateAxisIndex][tag] != null){
                        this.cubes[tag].push(cube);
                    }
                }
            }

            console.log("Stopped rotating!");
        }
    }

    apply_command(commands:string){
        let c = commands;

        if(this.rotating){
            console.log("Rotating, please wait!");
            return;
        }

        this.angle = 0;
        this.rotating = true;

        this.rotatingFace = c;

        if(c == 'L' || c == 'R'){
            this.rotateAxis = new THREE.Vector3(1,0,0);
            this.rotateAxisIndex = 'X';
        } else if(c == 'U' || c == 'D'){
            this.rotateAxis = new THREE.Vector3(0,1,0);
            this.rotateAxisIndex = 'Y';
        } else if(c == 'F' || c == 'B'){
            this.rotateAxis = new THREE.Vector3(0,0,1);
            this.rotateAxisIndex = 'Z';
        }
    }

    show_face(face:string, isVisible:boolean){
        let cubes = this.cubes[face];
        for(let cubeIdx in cubes){
            if(isVisible){
                this.scene.add(cubes[cubeIdx].getGeometry());
            }else{
                this.scene.remove(cubes[cubeIdx].getGeometry());
            }
        }
    }
}