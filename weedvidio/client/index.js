import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes'
import './index.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
		<BrowserRouter>
			<Routes/>
		</BrowserRouter>
, document.getElementById('root'));

