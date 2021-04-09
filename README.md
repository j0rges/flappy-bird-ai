# Flappy Bird AI

A small project which consists of a simple flappy bird browser game (no bells
or whistles yet) and a simple AI player which will learn using genetic
algorithms.

It is just a small project I am doing for fun.

## Usage

If you want to play the game you can clone this repository, then install the
dependencies and start the server:

```bash
npm ci
node server.js
```

You will be able to find it in [http://localhost:8080/flappyBird.html](http://localhost:8080/flappyBird.html). Note that I have only tested it on Chrome, so
I can't make any promises about other browsers.

If you want to play yourself, choose start and press space bar to start the game.
You can press 'p' to pause the game, and press it again to resume. Once you die
you can press the space bar to start again.

Alternatively, if you choose to train the ai, simply press space bar to start the
first generation and when a generation dies press the space bar again to start
the next generation.

## Tests

I use [Jest](https://jestjs.io/) to do some simple unit testing, they aren't very
thorough, please don't look at them. The tests are located in './tests' and can
be run as follows:

```bash
node --experimental-vm-modules node_modules/.bin/jest
```

## Lincense

[MIT](https://choosealicense.com/licenses/mit/)
