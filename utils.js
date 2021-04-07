// calculate cumulative sum. Not sure if it always work, because I am not sure
// about the exact behaviour of map.
export let cumsum = (arr,start = 0, f = (val) => val) => arr.map((val) => start+=f(val));

// in the future this will be bisect function. Return the value i such that
// array_value[i-1] < value <= array_value[i]
export function get_index(value_array, value) {
    for(let i = 0; i < value_array.length; i++) {
        if(value <= value_array[i]) return i;
    }
    return value_array.length;
}
