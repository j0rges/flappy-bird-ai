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

You will be able to find it in [http://localhost:8080/flappyBird.html](http://localhost:8080/flappyBird.html). Note that I have only tested this on Chrome, so
I can't make any promises about other browsers.

You can use the space bar to jump and the key 'p' to pause the game. You resume
by pressing either the space bar or 'p' again. After you lose just press the
space bar to start again.

## Tests

There isn't really any tests yet, but I plan to use [Jest](https://jestjs.io/)
to do some simple unit testing. The tests are located in './tests' and can be run
as follows:

```bash
node --experimental-vm-modules node_modules/.bin/jest
```

## Lincense

[MIT](https://choosealicense.com/licenses/mit/)
