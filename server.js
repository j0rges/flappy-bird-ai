import * as node_static from 'node-static';
import * as http from 'http';

// var node_static = require('node-static');
// var http = require('http');

var file = new(node_static.Server)(process.cwd());

http.createServer(function (req, res) {
  file.serve(req, res);
}).listen(8080);
