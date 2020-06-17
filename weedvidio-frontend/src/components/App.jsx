
// eslint-disable-next-line
import Peer from 'peerjs'
import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCannabis, faBong, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Button, Jumbotron, Spinner, Container, Row, Col } from 'react-bootstrap'
import {fetchJSONPost} from '../helpers/fetchAPI'

import { Link } from 'react-router-dom'
import {withRouter} from 'react-router-dom'

import './App.css'


const jumbotronStyle = {
	'margin': 'auto',
	'backgroundColor':'white',
	'width':'900px',
	'border': '5px solid black'
}

const titleStyle = {
	'display': 'block',
	'margin': '20px auto',
	'textAlign': 'center'
}

console.log(process.env.NODE_ENV)
console.log(window.location)
// const IS_DOCKERDEV = process.env.NODE_ENV == "dockerdev"
const IS_DEV = process.env.NODE_ENV == "development" 
const IS_PROD = true

const SERVER_URL = !IS_DEV ? "" : "http://localhost:8000"
console.log("ENV: ", process.env)
console.log("is prod?:", IS_PROD)

// const peerHost = 'weedvid.io'
const peerHost = IS_PROD ? "weedvid.io" : "localhost"
const peerPort = IS_PROD ? 443 : (IS_DEV ? 8000 : 80)
console.log(peerHost)

const peerOptions = {
	host: peerHost,
	path: '/peerjs',
	secure: IS_PROD,
	port: peerPort,
	debug: 3,
}

const USER_COUNT_TIME_MS = 10000
console.log("Server URL", SERVER_URL)

class App extends Component {
	makeDisplayInfoJSX = () => {
		if(this.state.appState == "ready") {
			return (
				<div className="btn fake-btn disabled text-center ready">
					Ready
				</div>
			)
		} else if (this.state.appState == "searching") {
			return (
				<div className="btn fake-btn disabled text-center searching">
					Searching <Spinner animation="border" variant="dark" size="lg"/>
				</div>
					
			)
		} else if (this.state.appState == "connected") {
			return (
				<div className="btn fake-btn disabled text-center connected">
					Connected
				</div>
			)
		} else {
			return (
				<div className="btn fake-btn disabled text-center loading">
					Loading...
				</div>
			)
		}
	}

	makeLiveUserCountJSX = () => {
		var userCount = this.state.userCount
		if(userCount == 0) {
			return (<h3>No other users</h3>)
		}
		else {
			return (
				<h3><FontAwesomeIcon icon={faUsers}/>&nbsp;&nbsp;{userCount}</h3>
			)
		}
	}

	render () {
		return (
			<Container>
				<Col>
				<Row>
					<h1 className="main-title"><FontAwesomeIcon icon={faBong}/>&nbsp;&nbsp;Weedvid.io&nbsp;&nbsp;<FontAwesomeIcon icon={faCannabis}/></h1>
					{/* <h3>{(this.state.userId != null) ? "Your user id is: " + this.state.userId : "Not connected to server! Try reloading the page"}</h3>
					<h3>{(this.state.partnerId != null) ? "Your partner's id is: " + this.state.partnerId : "Not connected to other! Press the connect button to get started"}</h3> */}
				</Row>

				<Row>
				<Jumbotron className="video-container">
					<video width={700} autoPlay className="remote-video" id="remote-video"></video>
					<video width={160} autoPlay muted className="local-video" id="local-video"></video>
				</Jumbotron>
				</Row>
				<Row className="bottom-row justify-content-around">
					<Col>
					<Row className="button-row justify-content-around">
						<Button variant="dark" size="lg" onClick={this.getNewPartner} className="action-btn">
							{this.state.appState === "searching" ? "Stop" : "Match me!"} 
						</Button>
						<Button variant="dark" size="lg" onClick={() => {this.props.history.push('/about')}} className="action-btn">
							About
						</Button>
					</Row>
					</Col>
					<Col>
					<Row className="info-row justify-content-around">
						{this.makeDisplayInfoJSX()}
						{this.makeLiveUserCountJSX()}
					</Row>
					</Col>
				</Row>
				{!IS_PROD ? (<Row> {this.state.displayInfo} </Row>) : (null)}
				</Col>
				<Row>
					<p>Version 1.0.0</p>
				</Row>
			</Container>
		)
	}

	pingSuccess(userCount) {
		this.setState({
			userCount: userCount,
		})
	}
	
	hangup() {
		console.log("hangup")
		if (this.isConnected()) {
			this.state.conn.close()
		}				
		fetchJSONPost(SERVER_URL + "/api/stopListening", { userId: this.state.userId} )
		.then(res => {
			this.setState({
				appState: "ready",
			})
		})
		.catch(err => {
			this.setState({
				appState: "ready",
			})
		})
	}

	setup(callback, error) {
		fetchJSONPost(SERVER_URL + "/api/setUp", {})
		.then(res => {
			if(res.success) {
				this.setupSuccess(res.data)
			}
		})
		.catch(err => this.setupFailure(err))

	}

	setupSuccess(data){
		var ourPeer = new Peer(data.userId, peerOptions)
		navigator.mediaDevices.getUserMedia({video: true, audio: true})
		.then((stream) => {
			var localScreen = document.getElementById("local-video")
			localScreen.srcObject = stream
			this.setState({
				stream: stream,
				displayInfo: "Got local stream",
				appState: "ready"
			})	
		}).catch((err) => {
			this.setState({
				displayInfo: "Failed to get local stream"
			})	
		});
		this.setState({
			peer: ourPeer,
			userId: data.userId,
			userCount: data.userCount + 1,
		})
	}

	setupFailure(err){
		console.error(err)
		this.setState({
			info: "Set up failed. Please reload."
		})
	}
	
	getNewPartnerSuccess(data) {
		var action = data.action
		var partnerId = data.partnerId 
		this.setState({
			partnerId: partnerId
		})
		if(action === "listen") {
			this.listen()
		} else if (action === "call"){
			this.call(data.partnerId)
		}
	}

	getNewPartnerFailure(err) {
		console.error(err)
		this.setState({
			info: "Couldn't find other person",
			displayInfo: "Couldn't get other partner"
		})
	}

	getNewPartner() {
		if(this.state.appState === "ready") {
			fetchJSONPost(SERVER_URL + "/api/getNewPartner", {partnerId: this.state.partnerId, userId: this.state.userId})
			.then(res => {
				this.getNewPartnerSuccess(res.data)
			})
			.catch(err => {
				this.getNewPartnerFailure(err)
			})
		} else {
			this.hangup()
		}
	}
	
	listen() {
		this.setState({
			displayInfo: "listening...",
			appState: "searching"
		})
		this.state.peer.on('call', (call) => {
			console.log("I answered the call!")
			call.answer(this.state.stream)
			call.on('stream', (remoteStream) => {
				console.log("I got the remote stream!")
				var remoteScreen = document.getElementById("remote-video")
				remoteScreen.srcObject = remoteStream
			})
			call.on('close', () => {
				var remoteScreen = document.getElementById("remote-video")
				remoteScreen.srcObject = null
				this.setState({
					conn: null,
					displayInfo: "Disconnected",
					appState: "ready"
				})	
			})
			this.setState({
				conn: call,
				displayInfo: "Got new partner",
				appState: "connected"
			})
		})
	}

	call(partnerId) {
		this.setState({
			displayInfo: "calling " + partnerId,
			appState: "searching",
		})
		console.log("calling " + partnerId)
		console.log(this.state.peer)
		var call = this.state.peer.call(partnerId, this.state.stream)
		call.on('stream', (remoteStream) => {
			console.log("I got the remote stream!")
			var remoteScreen = document.getElementById("remote-video")
			console.log(remoteScreen)
			remoteScreen.srcObject = remoteStream
			this.setState({
				displayInfo: "Got new partner",
				appState: "connected"
			})
		})
		call.on('close', (remoteStream) => {
			var remoteScreen = document.getElementById("remote-video")
			remoteScreen.srcObject = null
			this.setState({
				conn: null,
				displayInfo: "Disconnected",
				appState: "ready"
			})
		})
		this.setState({
			conn: call
		})
	}

	callFriend() {
		var partnerId = document.getElementById("partner_entry").value
		this.call(partnerId)
	}

	isConnected() {
		return this.state.conn != null && this.state.conn.open
	}

	constructor(props) {
		super(props)
		this.state = {
			stream: null,
			peer: null,
			conn: null,
			partnerId: null,
			userId: null,
			userCount: 0,
			info: "",
			appState: "constructed",
		}

		this.getNewPartner = this.getNewPartner.bind(this)
		this.getNewPartnerSuccess = this.getNewPartnerSuccess.bind(this)
		this.getNewPartnerFailure = this.getNewPartnerFailure.bind(this)
		this.setup = this.setup.bind(this)
		this.setupSuccess = this.setupSuccess.bind(this)
		this.setupFailure = this.setupFailure.bind(this)
		this.hangup = this.hangup.bind(this)
		this.isConnected = this.isConnected.bind(this)
		this.pingSuccess = this.pingSuccess.bind(this)
		this.pingID = setInterval(ping(this.pingSuccess), USER_COUNT_TIME_MS)
	}
	
	componentDidMount() {
		this.setState({
			stream: null,
			displayInfo: "Disconnected"
		})
		if(this.state.peer == null) {
			this.setup()
		}
	}

	componentWillUnmount() {
		clearInterval(this.pingID)
		if(this.state.peer != null) {
			this.state.peer.destroy()
		}
		this.hangup()
	}

	componentDidUpdate() {
	}
}

const ping = (onSuccess) => () => {
	fetchJSONPost(SERVER_URL + "/api/ping", {} )
	.then(res => {
		if(res.success) {
			onSuccess(res.userCount)
		}
	}).catch(err => {console.log(err)})
}

export default withRouter(App);
