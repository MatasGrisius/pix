import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import FetchData from './components/FetchData';

import './custom.css'
import Photo from './components/Photo';
import Login from './components/Login';
import EditPhoto from './components/EditPhoto';

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/photo/:id' component={Photo} />
        <Route exact path='/login' component={Login} />
        <Route path='/editphoto/:id?' component={EditPhoto} />
        <Route path='/fetch-data/:startDateIndex?' component={FetchData} />
    </Layout>
);
