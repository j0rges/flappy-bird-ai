import * as matrix from "./matrix.js";

export default class Player {
    constructor(weights) {
        this.weights = this.format_weights(weights);
        this.params = weights;
    }
    // choose whether to jump or not. 1 is jump 0 is don't.
    decide_action(state) {
        // state = [x distance top, x distance bottom, y distance, x speed, y speed]
        let results = matrix.multiply(this.weights,[state]);
        if(results[0][0] > results[0][1]){
            return 1;
        } else {
            return 0;
        }
    }
    format_weights(weights) {
        // weights = Array(10)
        let matrix = [];
        for(let i = 0; i < weights.length/2; i++) {
            matrix[i] = weights.slice(2*i, 2*(i+1));
        }
        return matrix;
    }
}
