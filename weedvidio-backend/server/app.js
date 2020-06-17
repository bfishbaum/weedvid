require('dotenv').config()
const express = require('express');
const path = require('path');
const bodyparser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { ExpressPeerServer } = require('peer');

console.log("the port is ", process.env.PORT)
const port = parseInt(process.env.PORT)
const cookieSecret = process.env.COOKIESECRET
const { router, removeFromNeedToMeet } = require(__dirname + path.resolve('/router'))

const app = express()

function* verifyOrigin(ctx){
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
	const allowedUrls = [process.env.FRONTEND_URL_LOCAL, process.env.FRONTEND_URL, process.env.FRONTEND_URL_DEV]
	var origin = req.headers.origin;
	// console.log(origin)
	if(allowedUrls.indexOf(origin) > -1 || allowedUrls == []){
		res.setHeader('Access-Control-Allow-Origin', origin);
	}
	//res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
	res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.header('Access-Control-Allow-Credentials', true);
	return next();
}

const allowedUrls = [process.env.FRONTEND_URL_LOCAL, process.env.FRONTEND_URL, process.env.FRONTEND_URL_DEV]

// app.use(cookieParser(cookieSecret))
app.use(bodyparser.json())
// app.use(bodyparser.urlencoded({ extended: true })); 

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === "production"){
	app.use("/api", cors(), router)
	app.use(express.static(path.join(__dirname, '../build')))
	app.get('/', function(req, res) {
		res.sendFile(path.join(__dirname, '../build/index.html'))
	})
} else {
	app.use("/api", corsFrontend, router)
}

server = app.listen(port, () => console.log("listening on port: ", port))

const peerServer = ExpressPeerServer(server, { debug: true });
peerServer.on('connection', (client) => {  });
peerServer.on('disconnect', (client) => { removeFromNeedToMeet(client.id) });
app.use('/peerjs', peerServer)

module.exports = {app, server}
