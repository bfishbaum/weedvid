import React from 'react';
import { Route, Switch } from 'react-router';

/**
 * Import all page components here
 */
import App from './components/App.jsx';
import AboutApp from './components/About.jsx';

/**
 * All routes go here.
 * Don't forget to import the components above after adding new route.
 */
function Routes () {
	return (
	<div>
		<Switch>
		<Route exact path="/" component={App} />
		<Route path="/about" component={AboutApp} />
		</Switch>
	</div>
	);
} 
export default Routes