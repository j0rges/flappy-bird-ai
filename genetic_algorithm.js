/*
    Library to train using genetic algorithms.
    The class of objects to be trained must have
*/
import {cumsum, get_index} from './utils.js';

function crossover(parent1, parent2) {
    let crossover_point = Math.floor(Math.random() * parent1.length);
    let child1 = parent1.slice(0,crossover_point).concat(parent2.slice(crossover_point));
    let child2 = parent2.slice(0,crossover_point).concat(parent1.slice(crossover_point));
    return [child1, child2]
}

function mutate(parameters, mutation_prob = 0.1) {
    function mutate_param(param) {
        if(Math.random() < mutation_prob) {
            // add or substract up to 50% of current value.
            return param * ((1 - 0.5) + Math.random());
        }
        return param;
    }
    return parameters.map(mutate_param);
}

function select_parent(parent_array, cdf) {
    let random = Math.random() * cdf[cdf.length-1];
    return parent_array[get_index(cdf, random)];
}

// returns the same number of children as there is parents (assuming even number).
// parents must have attribute score and method get_params.
export function children_parameters(parent_array) {
    // cumulative distribution function to sample the parents.
    let cdf = cumsum(parent_array,0,(parent) => parent.score + 1);
    let children = [];
    for(let i = 0; i < parent_array.length / 2; i++) {
        let parent1 = select_parent(parent_array,cdf).get_params();
        let parent2 = select_parent(parent_array,cdf).get_params();
        children = children.concat(crossover(parent1,parent2).map(mutate));
    }
    return children;
}
