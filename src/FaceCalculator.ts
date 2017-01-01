/**
 * URL: http://codegolf.stackexchange.com/questions/10768/solve-rubiks-cube
 *
 * 0-1 2-3 4-5 6-7 8-9 10-11 12-13 14-15 16-17 18-19 20-21 22-23 24-25-26 27-28-29 30-31-32 33-34-35 36-37-38 39-40-41 42-43-44 45-46-47
 UF  UR  UB  UL  DF   DR    DB   DL    FR    FL     BR    BL     UFR      URB      UBL      ULF      DRF      DFL      DLB      DBR

 Front:

                             +-------+-------+-------+
                            /       /       /       /|
                           /  30   /   4   /  27   / |
                          +-------+-------+-------+  |
                         /       /       /       /|28+
                        /   6   /       /   2   / | /|
                       +-------+-------+-------+  |/ |
                      /       /       /       /|3 +  |
                     /  33   /   0   /  24   / | /|21+
                    +-------+-------+-------+  |/ | /|
                    |       |       |       |26+  |/ |
                    |  35   |   1   |   25  | /|  +  |
                    |       |       |       |/ | /|47+
                    +-------+-------+-------+  |/ | /
                    |       |       |       |17+  |/
                    |  18   |       |  16   | /|11+
                    |       |       |       |/ | /
                    +-------+-------+-------+  |/
                    |       |       |       |37+
                    |  40   |   9   |  38   | /
                    |       |       |       |/
                    +-------+-------+-------+


 Hidden faces:

                    +-------+-------+-------+
                   /|       |       |       |
                  / |  31   |   5   |  29   |
                 +  |       |       |       |
                /|32+-------+-------+-------+
               / | /|       |       |       |
              +  |/ |  22   |       |  20   |
             /|7 +  |       |       |       |
            / | /|23+-------+-------+-------+
           +  |/ | /|       |       |       |
           |34+  |/ |  44   |  13   |  46   |
           | /|  +  |       |       |       |
           |/ | /|43+-------+-------+-------+
           +  |/ | /       /       /       /
           |19+  |/  42   /  12   /  45   /
           | /|15+-------+-------+-------+
           |/ | /       /       /       /
           +  |/  14   /       /  10   /
           |41+-------+-------+-------+
           | /       /       /       /
           |/  39   /   8   /   36  /
           +-------+-------+-------+


 */


import {Cube} from "cube"
export class FaceCalculator{
    inited:boolean = false;
    faceMap:Array = [];
    sortedFaceMap: Array = []
    centerColors:Array = [];
    f2c:Array = [];

    C2F(c){
        return this.centerColors[c];
    }

    F2C(f){
        return this.f2c[f];
    }

    constructor(faces){
        if(faces == null)
            return;

        let frontFace = faces[0];
        this.centerColors[faces[0][4]] = 'F';
        this.f2c['F'] = faces[0][4];
        let leftFace = faces[1];
        this.centerColors[faces[1][4]] = 'L';
        this.f2c['L'] = faces[1][4];
        let rightFace = faces[2];
        this.centerColors[faces[2][4]] = 'R';
        this.f2c['R'] = faces[2][4]
        let upFace = faces[3];
        this.centerColors[faces[3][4]] = 'U';
        this.f2c['U'] = faces[3][4];
        let backFace = faces[4];
        this.centerColors[faces[4][4]] = 'B';
        this.f2c['B'] = faces[4][4];
        let downFace = faces[5];
        this.centerColors[faces[5][4]] = 'D';
        this.f2c['D'] = faces[5][4];

        this.faceMap["UF"] = this.C2F(faces[3][7]) + this.C2F(faces[0][1]);
        this.faceMap["UR"] = this.C2F(faces[3][5]) + this.C2F(faces[2][1]);
        this.faceMap["UB"] = this.C2F(faces[3][1]) + this.C2F(faces[4][1]);
        this.faceMap["UL"] = this.C2F(faces[3][3]) + this.C2F(faces[1][1]);

        this.faceMap["DF"] = this.C2F(faces[5][1]) + this.C2F(faces[0][7]);
        this.faceMap["DR"] = this.C2F(faces[5][5]) + this.C2F(faces[2][7]);
        this.faceMap["DB"] = this.C2F(faces[5][7]) + this.C2F(faces[4][7]);
        this.faceMap["DL"] = this.C2F(faces[5][3]) + this.C2F(faces[1][7]);

        this.faceMap["FR"] = this.C2F(faces[0][5]) + this.C2F(faces[2][3]);
        this.faceMap["FL"] = this.C2F(faces[0][3]) + this.C2F(faces[1][5]);

        this.faceMap["BR"] = this.C2F(faces[4][3]) + this.C2F(faces[2][5]);
        this.faceMap["BL"] = this.C2F(faces[4][5]) + this.C2F(faces[1][3]);

        this.faceMap["UFR"] = this.C2F(faces[3][8]) + this.C2F(faces[0][2]) + this.C2F(faces[2][0]);
        this.faceMap["URB"] = this.C2F(faces[3][2]) + this.C2F(faces[2][2]) + this.C2F(faces[4][0]);
        this.faceMap["UBL"] = this.C2F(faces[3][0]) + this.C2F(faces[4][2]) + this.C2F(faces[1][0]);
        this.faceMap["ULF"] = this.C2F(faces[3][6]) + this.C2F(faces[1][2]) + this.C2F(faces[0][0]);

        this.faceMap["DRF"] = this.C2F(faces[5][2]) + this.C2F(faces[2][6]) + this.C2F(faces[0][8]);
        this.faceMap["DFL"] = this.C2F(faces[5][0]) + this.C2F(faces[0][6]) + this.C2F(faces[1][8]);
        this.faceMap["DLB"] = this.C2F(faces[5][6]) + this.C2F(faces[1][6]) + this.C2F(faces[4][8]);
        this.faceMap["DBR"] = this.C2F(faces[5][8]) + this.C2F(faces[4][6]) + this.C2F(faces[2][8]);


        let retStr = ""
        for(let faceIdx in this.faceMap){
            retStr += this.faceMap[faceIdx] + " ";
        }
        console.log("20-elements input format is:" + retStr);

        // Init sorted face map for future lookup
        for(let faceIdx in this.faceMap){
            let sortedFaceIdx = Array.from(faceIdx).sort().join('');
            this.sortedFaceMap[sortedFaceIdx] = faceIdx;
        }

        // Append center cubes
        this.sortedFaceMap['F'] = 'F';
        this.sortedFaceMap['L'] = 'L';
        this.sortedFaceMap['R'] = 'R';
        this.sortedFaceMap['U'] = 'U';
        this.sortedFaceMap['B'] = 'B';
        this.sortedFaceMap['D'] = 'D';

        this.inited = true;
    }

    colorCube(cube:Cube){
        if(!this.inited){
            return;
        }

        let tags:Array = cube.getTags();
        if(tags.length == 0){
            return;
        }
        let sortedIdx = tags.sort().join('');

        let rawIdx = this.sortedFaceMap[sortedIdx];
        let colorStr = rawIdx;
        if(rawIdx.length != 1 ){
            colorStr = this.faceMap[rawIdx];
        }


        for(let colorIdx in colorStr){
            cube.setFaceColor(rawIdx[colorIdx], this.F2C(colorStr[colorIdx]));
        }
    }
}