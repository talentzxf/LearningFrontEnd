export class CubicSolver {
    affectedCubies:Array =
        [
            [0, 1, 2, 3, 0, 1, 2, 3],   // U
            [4, 7, 6, 5, 4, 5, 6, 7],   // D
            [0, 9, 4, 8, 0, 3, 5, 4],   // F
            [2, 10, 6, 11, 2, 1, 7, 6],   // B
            [3, 11, 7, 9, 3, 2, 6, 5],   // L
            [1, 8, 5, 10, 1, 0, 4, 7],   // R
        ];

    phase:number;

    inverse(move:number) {
        return move + 2 - 2 * (move % 3);
    }

    applyMove(move:number, state:Array<number>) {
        let turns = move % 3 + 1;
        let face = move / 3;
        while (turns--) {
            let oldState = _.clone(state);
            for (let i = 0; i < 8; i++) {
                let isCorner = i > 3;
                let target = this.affectedCubies[face][i] + isCorner * 12;
                let killer = this.affectedCubies[face][(i & 3) == 3 ? i - 3 : i + 1] + isCorner * 12;
                ;
                let orientationDelta = (i < 4) ? (face > 1 && face < 4) : (face < 2) ? 0 : 2 - (i & 1);
                state[target] = oldState[killer];
                state[target + 20] = oldState[killer + 20] + orientationDelta;
                if (!turns)
                    state[target + 20] %= 2 + isCorner;
            }
        }
        return state;
    }

//----------------------------------------------------------------------

    id(state:Array<number>) {

    //--- Phase 1: Edge orientations.
    if( this.phase < 2 )
        return _.
//    return vi( state.begin() + 20, state.begin() + 32 );
//
//    //-- Phase 2: Corner orientations, E slice edges.
//    if( phase < 3 ){
//    vi result( state.begin() + 31, state.begin() + 40 );
//    for( int e=0; e<12; e++ )
//    result[0] |= (state[e] / 8) << e;
//    return result;
//}
//
////--- Phase 3: Edge slices M and S, corner tetrads, overall parity.
//if( phase < 4 ){
//    vi result( 3 );
//    for( int e=0; e<12; e++ )
//    result[0] |= ((state[e] > 7) ? 2 : (state[e] & 1)) << (2*e);
//    for( int c=0; c<8; c++ )
//    result[1] |= ((state[c+12]-12) & 5) << (3*c);
//    for( int i=12; i<20; i++ )
//    for( int j=i+1; j<20; j++ )
//    result[2] ^= state[i] > state[j];
//    return result;
//}
//
////--- Phase 4: The rest.
//return state;
    }


    constructor(inputArray:Array<string>) {

    }
}