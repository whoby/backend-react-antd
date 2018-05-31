import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import 'assets/style/theme.less';
import 'assets/style/style.scss';

import store from '@/store';
import Router from '@/router';

ReactDOM.render(
    (
        <Provider {...store}>
            <Router />
        </Provider>
    ),
    document.getElementById('app')
);
