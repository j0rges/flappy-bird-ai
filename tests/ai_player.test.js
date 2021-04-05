import Player from '../ai_player.js';

const player = new Player([1,-1,-1,1,0,0,2,-2,0,0]);

test('Weights correctly formated', () => {
    expect(player.weights).toStrictEqual([[1,-1],[-1,1],[0,0],[2,-2],[0,0]]);
});

test('Player.decide_action is 1', () => {
    expect(player.decide_action([1,0,0,0,0])).toBe(1);
});

test('Player.decide_action is 0', () => {
    expect(player.decide_action([-11,0,0,0,0])).toBe(0);
});
