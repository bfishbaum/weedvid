require('dotenv').config()
const express = require('express');
const path = require('path');
const bodyparser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { ExpressPeerServer } = require('peer');

console.log("the port is ", process.env.SERVER_PORT)
const port = parseInt(process.env.SERVER_PORT)
const cookieSecret = process.env.COOKIESECRET
const { router, removeFromNeedToMeet, upUserCount, downUserCount } = require(__dirname + path.resolve('/router'))

const app = express()

function* verifyOrigin(ctx) {
	origin = ctx.headers.origin
	console.log(origin)
	if( validOrigins.indexOf(origin) != -1) {
		ctx.set('Access-Control-Allow-Origin', origin)
	}
}

const corsOptions = {
	origin: verifyOrigin,
	methods: ['GET, POST'], 
	allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
	credentials: true
}

const corsFrontend = (req, res, next) => {
	// const allowedUrls = [process.env.FRONTEND_URL_LOCAL, process.env.FRONTEND_URL, process.env.FRONTEND_URL_DEV]
	// const allowedUrls = ["http://localhost:8080", "https://localhost:8080", "http://localhost:443", "http://localhost:443",
	const allowedUrls = ["https://www.weedvid.io"]
	var origin = req.headers.origin;
	if(allowedUrls.indexOf(origin) > -1 || allowedUrls == []){
		res.setHeader('Access-Control-Allow-Origin', origin);
	}
	//res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
	res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.header('Access-Control-Allow-Credentials', true);
	return next();
}

// app.use(cookieParser(cookieSecret))
app.enable('trust proxy')
app.use(bodyparser.json())

// app.use(bodyparser.urlencoded({ extended: true })); 

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === "production"){
	app.use("/api", corsFrontend, router)
	app.use(express.static(path.join(__dirname, '../dist')))
	app.get('/*', function(req, res) {
		res.sendFile(path.join(__dirname, '../dist/index.html'))
	})
} else {
	app.use("/api", corsFrontend, router)
}

server = app.listen(port, () => console.log("listening on port: ", port))

const peerServer = ExpressPeerServer(server, { debug: true });

peerServer.on('connection', (client) => { 
	console.log("Connected!:", client.id)
});

peerServer.on('disconnect', (client) => { 
	removeFromNeedToMeet(client.id)
});

app.use('/peerjs', peerServer)

module.exports = {app, server}
