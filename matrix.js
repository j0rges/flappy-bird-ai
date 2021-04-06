/*
    Some functions for matrix operations.
    Add two matrices, multiply two matrices and calculate the inner product of
    two vectors.
    NOTE: some operations modify the ojects given as arguments.
*/

export function add(A, B) {
    if((A.length != B.length) || (A[0].length != B[0].length)) {
        throw "Matrices must be of the same size"
    }
    let result = new Array(A.length);
    for(let i = 0; i < A.length; i++){
        let colA = A[i], colB = B[i];
        let col = new Array(colA.length);
        for(let j = 0; j < colA.length; j++){
            col[j] = colA[j] + colB[j];
        }
        result[i] = col;
    }
    return result;
}

export function inner_product(v1, v2) {
    let result = 0;
    for( let i = 0; i < v1.length; i++){
        result += v1[i] * v2[i];
    }
    return result;
}

function get_row(matrix, row) {
    let result = [];
    for(let i = 0; i < matrix.length; i++){
        result[i] = matrix[i][row];
    }
    return result;
}

// multiply two matrices. Assumes each is an array of columns.
export function multiply(A, B) {
    // initialize the result matrix.
    let result = new Array(B.length);
    for( let i = 0; i < result.length; i++){
        result[i] = new Array(A[0].length);
    }
    for(let row = 0; row < A[0].length; row ++){
        let row_of_A = get_row(A, row);
        for(let col = 0; col < B.length; col ++){
            result[col][row] = inner_product(row_of_A,B[col]);
        }
    }
    return result;
}

function vector_operation(v1, v2, callback) {
    for(let i = 0; i < v1.length; i++) {
        v1[i] = callback(v1[i],v2[i])
    }
    return v1;
}

function vector_add(v1, v2) {
    // adds the second vector to the first. Alters the object referenced in the
    // argument.
    for(let i = 0; i < v1.length; i++) {
        v1[i] += v2[i]
    }
    return v1;
}

export function normalize_rows(A) {
    // Note that this function modifies the object referenced in the argument.
    let sum = Array.from(A[0]);
    for(let i = 1; i < A.length; i++) {
        sum = vector_add(sum, A[i]);
    }
    for(let i = 0; i < A.length; i++) {
        A[i] = vector_operation(A[i], sum, (x,y) => x/y);
    }
    return A;
}

// take an array of arrays and concatenate them.
export function flatten(array) {
    return array.reduce((result, arr) => result.concat(arr), []);
}
