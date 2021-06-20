import React from 'react';
import ReactDOM from 'react-dom';
import Peer from 'peerjs';
import { withRouter } from 'react-router-dom'
import './index.css'

const CADDY_BACKEND = "https://localhost:3001"

class Main extends React.Component{
    constructor(props) {
		super(props)
		this.state = { }
        // this lets us use the `this` keyword in fun setup
        // this.setup = this.setup.bind(this)
    }

    ping() {
        fetch(CADDY_BACKEND + "/ping", {method: "POST"})
        .then(res => {
            console.log(res.ok)
        })
        .catch(e => console.log(e))
    }

    render(){
        return(
            <div>
                <div>
                    <h1>Blank Project</h1>
                    <p>This is a blank node project with webpack, caddy, react, babel, and routing</p>
                    <button onClick={() => this.ping()}>Test Backend</button>
                </div>
            </div>
        )
    }
}

export default withRouter(Main)