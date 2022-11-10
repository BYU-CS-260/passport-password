import React from 'react';

import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom' //don't need to specify localhost url in axios http address

//style
import 'spectre.css/dist/spectre.min.css';
import 'spectre.css/dist/spectre-icons.css';
import './index.css';

import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
	<BrowserRouter>	
	<App />
	</BrowserRouter>
);