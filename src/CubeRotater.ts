import {Cube} from './cube';
import {FaceCalculator} from "./FaceCalculator";

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
    speed = 0.2;

    faceIndexArray = ["F","R","L","D","U","B"];

    // Add reverse commands.
    faceCommandArray = this.faceIndexArray.concat(["F'","R'","L'","D'","U'","B'"]);

    faceRotateMap = {};
    faceReverseMap = {};
    rotateAxis:THREE.Vector3;
    scene:THREE.Scene;

    rotatingFace:string;

    // CW -- clock wise. Positive
    // CCW -- counter clock wise. Negative
    rotateCW:boolean;

    bufferedCommands:Array = [];
    genRandomSequence:boolean = false;
    faceCalculator: FaceCalculator;


    getReverse(face:string){
        return this.faceReverseMap[face];
    }

    initFaceRotateMap(){
        this.initFaceReverseMap();

        for(let faceIdx in this.faceIndexArray){
            let face = this.faceIndexArray[faceIdx];
            this.faceRotateMap[face] = {};
        }

        // All clockwise rotation
        this.faceRotateMap['L']['F'] = 'D';
        this.faceRotateMap['L']['D'] = 'B';
        this.faceRotateMap['L']['B'] = 'U';
        this.faceRotateMap['L']['U'] = 'F';

        this.faceRotateMap['R']['F'] = this.getReverse('D');
        this.faceRotateMap['R']['D'] = this.getReverse('B');
        this.faceRotateMap['R']['B'] = this.getReverse('U');
        this.faceRotateMap['R']['U'] = this.getReverse('F');

        this.faceRotateMap['U']['F'] = 'L';
        this.faceRotateMap['U']['R'] = 'F';
        this.faceRotateMap['U']['B'] = 'R';
        this.faceRotateMap['U']['L'] = 'B';

        this.faceRotateMap['D']['F'] = this.getReverse('L');
        this.faceRotateMap['D']['R'] = this.getReverse('F');
        this.faceRotateMap['D']['B'] = this.getReverse('R');
        this.faceRotateMap['D']['L'] = this.getReverse('B');

        this.faceRotateMap['F']['U'] = 'R';
        this.faceRotateMap['F']['L'] = 'U';
        this.faceRotateMap['F']['D'] = 'L';
        this.faceRotateMap['F']['R'] = 'D';

        this.faceRotateMap['B']['U'] = this.getReverse('R');
        this.faceRotateMap['B']['L'] = this.getReverse('U');
        this.faceRotateMap['B']['D'] = this.getReverse('L');
        this.faceRotateMap['B']['R'] = this.getReverse('D');
    }

    initFaceReverseMap(){
        this.faceReverseMap['F'] = 'B';
        this.faceReverseMap['L'] = 'R';
        this.faceReverseMap['U'] = 'D';

        this.faceReverseMap['B'] = 'F';
        this.faceReverseMap['R'] = 'L';
        this.faceReverseMap['D'] = 'U';
    }

    removeSelf(){
        //this.cubes.forEach(function(cubes){
        //    cubes.forEach(function(cube){
        //      this.scene.remove(cube.getGeometry());
        //    })
        //})

        for(let idx in this.cubes){
            if(!this.cubes.hasOwnProperty(idx)){
                continue;
            }
            let cubes = this.cubes[idx];
            for(let cIdx in cubes){
                if(!cubes.hasOwnProperty(cIdx)){
                    continue;
                }
                let cube = cubes[cIdx];
                this.scene.remove(cube.getGeometry());
            }
        }
    }

    initCubes(faces){

        this.faceCalculator = new FaceCalculator(faces);

        for(let index in this.faceIndexArray){
            this.cubes[this.faceIndexArray[index]] = [];
        }

        let half_dim=1;

        for(let x = -half_dim; x <= half_dim; x++ ){
            for(let y=-half_dim ; y<=half_dim ; y++ ){
                for( let z=-half_dim; z<=half_dim ;z++){
                    let newCube = new Cube(x,y,z,this.scene);

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

                    newCube.colorFace();
                    this.faceCalculator.colorCube(newCube);

                }
            }
        }

    }

    getElemStr(){
        if(this.faceCalculator != null)
            return this.faceCalculator.getElemStr();
    }

    constructor(scene, faces){
        this.scene = scene;

        this.initFaceRotateMap();
        this.initCubes(faces);
    }


    update(){
        if(this.rotating){
            let childArray = this.cubes[this.rotatingFace];
            for(let idx = 0; idx < childArray.length; idx++){
                let cube = childArray[idx];
                let obj = cube.getGeometry();
                obj.rotateAroundWorldAxis(this.rotateAxis, this.speed);
            }
            this.angle += this.speed;

            if( this.angle > Math.PI/2 ){
                // Compensate angel error
                let errorAngle = Math.PI/2 - this.angle;
                console.log("Fixing angle:" + errorAngle);
                let childArray = this.cubes[this.rotatingFace];
                for(let idx = 0; idx < childArray.length ; idx++){
                    let cube = childArray[idx];
                    let obj = cube.getGeometry();
                    obj.rotateAroundWorldAxis(this.rotateAxis, errorAngle);
                }

                this.angle = 0;

                // Move from one face to another
                for( let idx = 0; idx < childArray.length; idx++ ){
                    let cube = childArray[idx];
                    let tags = cube.getTags();
                    for(let tagIdx = 0 ; tagIdx < tags.length; tagIdx++){
                        let tag = tags[tagIdx];

                        if(this.faceRotateMap[this.rotatingFace][tag] != null){
                            if(this.rotateCW){
                                cube.setTag(tagIdx, this.faceRotateMap[this.rotatingFace][tag]);
                            }else{
                                cube.setTag(tagIdx, this.getReverse(this.faceRotateMap[this.rotatingFace][tag]));
                            }

                            // Remove from previous arrays;
                            this.cubes[tag] = _.without(this.cubes[tag], cube);
                        }
                    }
                }

                // Reconsolidate all cubes according to tag
                for( let idx = 0 ; idx < childArray.length; idx++ ){
                    let cube = childArray[idx];

                    let tags = cube.getTags();

                    for(let tagIdx = 0; tagIdx < tags.length; tagIdx++){
                        let tag = tags[tagIdx];

                        if(this.faceRotateMap[this.rotatingFace][tag] != null)
                            this.cubes[tag].push(cube);
                    }
                }

                this.rotating = false;
                console.log("Stopped rotating!");
            }

        }else{
            this.executeNextCommand();
        }
    }

    executeNextCommand(){
        if(this.bufferedCommands.length){
            this.apply_command(this.bufferedCommands.shift());
        }else if(this.genRandomSequence){
            let faceIdx = Math.floor(Math.random() * 100) % this.faceCommandArray.length;
            this.apply_command( this.faceCommandArray[faceIdx] );
        }
    }

    buffer_commands(commands:string){
        // Parse command to array.
        let resArray = [];
        for(let idx in commands){
            let char = commands.charAt(idx);
            if(char == "'"){
                resArray[resArray.length-1] = resArray[resArray.length-1]+"'";
            } else if(char == 2){
                resArray.push(resArray[resArray.length-1]);
            } else if(char == 3){
                resArray.push(resArray[resArray.length-1]);
                resArray.push(resArray[resArray.length-1]);
            } else if(char == ' ' || char == 1){
                continue;
            } else {
                resArray.push(char);
            }
        }
        // Convert string to array
        this.bufferedCommands = this.bufferedCommands.concat(resArray);
    }

    apply_command(command:string){
        let c = command;

        if(this.rotating){
            console.log("Rotating, please wait!");
            return;
        }

        switch(c){
            case "L":
            case "R'":
                this.rotateAxis = new THREE.Vector3(1,0,0);
                break;
            case "L'":
            case "R":
                this.rotateAxis = new THREE.Vector3(-1,0,0);
                break;
            case "U":
            case "D'":
                this.rotateAxis = new THREE.Vector3(0,-1,0);
                break;
            case "U'":
            case "D":
                this.rotateAxis = new THREE.Vector3(0,1,0);
                break;
            case "F":
            case "B'":
                this.rotateAxis = new THREE.Vector3(0,0,-1);
                break;

            case "F'":
            case "B":
                this.rotateAxis = new THREE.Vector3(0,0,1);
                break;
            default:
                console.log("Encountered unknown command:" + c)
        }

        if(c.indexOf("'") == 1){
            this.rotateCW = false;
            c = c.charAt(0);
        }else{
            this.rotateCW = true;
        }

        this.angle = 0;
        this.rotating = true;

        this.rotatingFace = c;

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

    toggle_random(){
        this.genRandomSequence = !this.genRandomSequence;
    }
}