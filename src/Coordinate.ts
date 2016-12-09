export class Coordinate{
    x:number;
    y:number;
    z:number;
    constructor (public x:number, public y:number, public z:number){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    print(){
        console.log("X:" + this.x + " Y:" + this.y + " Z:" + this.z);
    }
}