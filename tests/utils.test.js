import * as utils from '../utils.js';

// test cumsum
test('default cumulative sum', () => {
    expect(utils.cumsum([1,2,3])).toStrictEqual([1,3,6]);
});

test('default cumulative sum empty array', () => {
    expect(utils.cumsum([])).toStrictEqual([]);
});

test('cumulative sum with starting point', () => {
    expect(utils.cumsum([1,2,3], 10)).toStrictEqual([11,13,16]);
});

test('cumulative sum using function', () => {
    let values = [{score:1},{score:2},{score:3}]
    expect(utils.cumsum(values, 0, (val) => val.score)).toStrictEqual([1,3,6]);
});

// test get_index
test('test get_index', () => {
    expect(utils.get_index([1,2,3],2)).toBe(1);
});

test('test get_index before first element', () => {
    expect(utils.get_index([1,2,3],0)).toBe(0);
});

test('test get_index after last element', () => {
    expect(utils.get_index([1,2,3],12)).toBe(3);
});

test('test get_index empty array', () => {
    expect(utils.get_index([],2)).toBe(0);
});
