import React from 'react';
import Headbar from 'module/common/headbar';

export default () => (
    <div className="app">
        <Headbar />
        <div style={styles.index}></div>
    </div>
);

const styles = {
    index: {
        width: 1100,
        margin: '100px auto 30px auto',
        height: 510,
        background: `url(${require('assets/img/index.jpg')}) no-repeat top center`,
    }
};
