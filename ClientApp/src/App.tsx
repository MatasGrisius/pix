import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import FetchData from './components/FetchData';

import './custom.css'
import Photo from './components/Photo';

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route exact path='/photo:{id}/' component={Photo} />
        <Route path='/fetch-data/:startDateIndex?' component={FetchData} />
    </Layout>
);
