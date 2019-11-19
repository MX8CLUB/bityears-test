import React from 'react';
import ReactDOM from 'react-dom';
import Index from './pages/Index';
import UrlList from "./pages/UrlList";
import './css/default.css';
import {init} from "./utils/db";
import {BrowserRouter, Route, Redirect} from "react-router-dom";
init();
// ReactDOM.render(
//     <BrowserRouter>
//         <Route exact path={'/Index'} component={Index}/>
//         <Route path={'/urlList'} component={UrlList}/>
//         <Redirect path="/" to={{ pathname: '/Index' }}/>
//         <Redirect path="/index.html" to={{ pathname: '/Index' }}/>
//     </BrowserRouter>
//     , document.getElementById('root'));
ReactDOM.render(
    <Index/>
    , document.getElementById('root'));
