
// eslint-disable-next-line
import Peer from 'peerjs'
import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCannabis, faBong } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Button, Jumbotron } from 'react-bootstrap'
import {fetchJSONPost} from '../helpers/fetchAPI'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

const aboutStyle = {
    'display': 'block',
	'fontSize': '24px',
	'textAlign': 'center'
}

const titleStyle = {
	'display': 'block',
	'margin': '20px auto',
	'textAlign': 'center'
}

const friendButtonStyle = {
	'display': 'block',
    'margin': '20px auto',
}

const friendButtonDivStyle = {
	'display': 'block',
	'margin': '20px auto',
}


class App extends Component {
	render () {
		return (
		<div>
			<div>
				<h1 style={titleStyle}><FontAwesomeIcon icon={faBong}/>&nbsp;&nbsp;Weedvid.io&nbsp;&nbsp;<FontAwesomeIcon icon={faCannabis}/></h1>
			</div>
			<div>
				<h2 style={titleStyle}>About</h2>
				<p style={aboutStyle}>This site helps weedsmokers meet and video chat with eachother in quarantine</p>
				<p style={aboutStyle}>Reach out to benji@weedvid.io with any inquiries</p>
				<Button variant="primary" size="med" style={friendButtonStyle} onClick={() => this.props.history.push('/')}>Back</Button>
			</div>
			<div></div>
		</div>
		)
	}
}


export default withRouter(App);
