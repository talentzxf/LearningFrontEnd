export class CameraImgPicker{

    w:number = 0;
    h:number = 0;
    dim:number = 4;
    d:Array = [];

    constructor(imgData:Array, width:number, height:number){
        this.d = imgData;
        this.w = width;
        this.h = height;
    }

    getPixel(r,c){
        let retPixel = [];
        for(let dimIdx = 0 ; dimIdx < this.dim; dimIdx++){
            retPixel.push(this.d[ this.dim*( r*this.w + c ) + dimIdx])
        }
        return retPixel;
    }

    process(){
        console.log(this.getPixel(100,100));
    }
}

function initCommands(){
    console.log("Good good!")
    if(!window.createImgPicker){
        console.log("Create img picker!!!")
        window.createImgPicker = function(imgData, width, height){
            return new CameraImgPicker(imgData, width, height);
        }
    }
}

initCommands();

