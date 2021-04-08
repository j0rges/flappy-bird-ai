import game from './flappyBird.js';

addEventListener("load",setup);

function click_event(e, interactive) {
    game(e, interactive);
    // remove form from DOM.
    document.getElementById("button_form").remove();
}

function setup() {
    document.getElementById("play_start").onclick = (e) => click_event(e,1);
    document.getElementById("ai_start").onclick = (e) => click_event(e, 0);
}
