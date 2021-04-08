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

// find distance between two points.
export function pythag(cateto1,cateto2){
  return Math.sqrt(Math.pow(cateto1, 2) + Math.pow(cateto2, 2));
}

// positive modulus.
export function modulus(a,b){
  if (a >= 0) return (a % b);
  if (b <= 0) return (-b + (a % b));
  while (a < 0){
    a += b;
  }
  return a;
}
