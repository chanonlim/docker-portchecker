'use strict';

const express = require("express");
const net = require("net");
const app = new express();

function checkPort(port, opts)  {
	opts = Object.assign({timeout: 1000}, opts);

	return new Promise((resolve => {
		const socket = new net.Socket();

		const onError = () => {
			socket.destroy();
			resolve(false);
		};

		socket.setTimeout(opts.timeout);
		socket.on("error", onError);
		socket.on("timeout", onError);

		socket.connect(port, opts.host, () => {
			socket.end();
			resolve(true);
		});
	}));
};

app.get('/portcheck', (req, res) => {
  if (!req.query.port) { res.json({error: "NoPort", message: "Port must be specified", isOpen: null}) }
  var host = req.query.host || (req.headers['x-forwarded-for'] || req.connection.remoteAddress)
  checkPort(req.query.port, {host: host.split(", ")})
  .then(r=> {
    res.json({host: host.split(", ")[0], isOpen: r})
  })
})
app.listen(80)
console.log("Listening on container's port 80")
