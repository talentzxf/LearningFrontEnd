// TODO: Add param validations
Array.prototype.subarray = function (start, end) {
    if (end == null) {
        end = this.length;
    }

    if (start < 0 || end > this.length) {
        throw "Param error!"
    }

    let retArray = [];
    for (let idx = start; idx <= end; idx++) {
        retArray.push(this[idx]);
    }

    return retArray;
}

export class CubicSolver {
    applicableMoves:Array = [0, 262143, 259263, 74943, 74898];
    affectedCubies:Array =
        [
            [0, 1, 2, 3, 0, 1, 2, 3],   // U
            [4, 7, 6, 5, 4, 5, 6, 7],   // D
            [0, 9, 4, 8, 0, 3, 5, 4],   // F
            [2, 10, 6, 11, 2, 1, 7, 6],   // B
            [3, 11, 7, 9, 3, 2, 6, 5],   // L
            [1, 8, 5, 10, 1, 0, 4, 7],   // R
        ];

    phase:number = 0;
    inputArray:Array;

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
        if (this.phase < 2)
            return state.subarray(20, 32);

        //-- Phase 2: Corner orientations, E slice edges.
        if (this.phase < 3) {
            let result = state.subarray(31, 40);
            for (let e = 0; e < 12; e++)
                result[0] |= (state[e] / 8) << e;
            return result;
        }

//--- Phase 3: Edge slices M and S, corner tetrads, overall parity.
        if (this.phase < 4) {
            let result = [];

            for (let e = 0; e < 12; e++)
                result[0] |= ((state[e] > 7) ? 2 : (state[e] & 1)) << (2 * e);
            for (let c = 0; c < 8; c++)
                result[1] |= ((state[c + 12] - 12) & 5) << (3 * c);
            for (let i = 12; i < 20; i++)
                for (let j = i + 1; j < 20; j++)
                    result[2] ^= state[i] > state[j];
            return result;
        }

//--- Phase 4: The rest.
        return state;
    }

    swap(array1, array2) {
        let t = array1;
        array1 = array2;
        array2 = t;
    }

    inverse(move:number) {
        return move + 2 - 2 * (move % 3);
    }

    solve() {
        //--- Define the goal.
        let goal = ["UF", "UR", "UB", "UL", "DF", "DR", "DB", "DL", "FR", "FL", "BR", "BL",
            "UFR", "URB", "UBL", "ULF", "DRF", "DFL", "DLB", "DBR"];

        //--- Prepare current (start) and goal state.
        let currentState = [], goalState = [];
        for (let i = 0; i < 20; i++) {

            //--- Goal state.
            goalState[i] = i;

            //--- Current (start) state.
            let cubie = this.inputArray[i];
            currentState[20+i] = 0;

            let idx = goal.indexOf(cubie);
            while (idx == -1) {
                currentState[20+i]++;
                cubie = cubie.substr(1) + cubie[0];
                idx = goal.indexOf(cubie);
            }

            currentState[i] = idx;

            //let idx = -1;
            //while (idx == -1) {
            //
            //    idx = goal.indexOf(cubie);
            //    if (idx == -1) {
            //        if (currentState.indexOf(i) == -1)
            //            currentState[i + 20] = 0;
            //        else {
            //            currentState[i + 20]++;
            //        }
            //    }else{
            //
            //    }
            //
            //}
        }


        //--- Dance the funky Thistlethwaite...
        nextPhasePlease:
            while (++this.phase < 5) {

                //--- Compute ids for current and goal state, skip phase if equal.
                let currentId = this.id(currentState), goalId = this.id(goalState);
                if (_.isEqual(currentId, goalId))
                    continue;

                //--- Initialize the BFS queue.
                let q = [];
                q.push(currentState);
                q.push(goalState)

                //--- Initialize the BFS tables.
                let predecessor = [];
                let direction = [], lastMove = [];
                direction[currentId] = 1;
                direction[goalId] = 2;

                //--- Dance the funky bidirectional BFS...
                while (1) {

                    //--- Get state from queue, compute its ID and get its direction.
                    let oldState = q.pop();
                    let oldId = this.id(oldState);
                    let oldDir = direction[oldId];

                    //--- Apply all applicable moves to it and handle the new state.
                    for (let move = 0; move < 18; move++) {
                        if (this.applicableMoves[this.phase] & (1 << move)) {

                            //--- Apply the move.
                            let newState = this.applyMove(move, oldState);
                            let newId = this.id(newState);
                            let newDir = direction[newId];

                            //--- Have we seen this state (id) from the other direction already?
                            //--- I.e. have we found a connection?
                            if (newDir && newDir != oldDir) {

                                //--- Make oldId represent the forwards and newId the backwards search state.
                                if (oldDir > 1) {
                                    this.swap(newId, oldId);
                                    move = this.inverse(move);
                                }

                                //--- Reconstruct the connecting algorithm.
                                let algorithm = [];
                                algorithm.push(move);
                                while (oldId != currentId) {
                                    algorithm.unshift(lastMove[oldId]);
                                    oldId = predecessor[oldId];
                                }
                                while (newId != goalId) {
                                    algorithm.push(this.inverse(lastMove[newId]));
                                    newId = predecessor[newId];
                                }

                                //--- Print and apply the algorithm.
                                for (let i = 0; i < algorithm.length; i++) {
                                    console.log("UDFBLR"[algorithm[i] / 3] + "" + (algorithm[i] % 3 + 1));
                                    currentState = this.applyMove(algorithm[i], currentState);
                                }

                                //--- Jump to the next phase.
                                continue nextPhasePlease;
                            }

                            //--- If we've never seen this state (id) before, visit it.
                            if (!newDir) {
                                q.push(newState);
                                newDir = oldDir;
                                lastMove[newId] = move;
                                predecessor[newId] = oldId;
                            }
                        }
                    }
                }
            }
    }

    constructor(inputArray:Array<string>) {
        this.inputArray = inputArray;
    }
}