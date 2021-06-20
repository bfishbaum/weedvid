
// eslint-disable-next-line
import React, { Component } from 'react';
import { faCannabis, faBong } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Button, Jumbotron } from 'react-bootstrap'
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
				<p style={aboutStyle}>Reach out to benjifishbaum@gmail.com with any inquiries</p>
				<p style={aboutStyle}>Checkout the code <a href="https://github.com/bfishbaum/weedvid/">here</a></p>
				<Button variant="primary" size="med" style={friendButtonStyle} onClick={() => this.props.history.push('/')}>Back</Button>
			</div>
			<div></div>
		</div>
		)
	}
}


export default withRouter(App);
