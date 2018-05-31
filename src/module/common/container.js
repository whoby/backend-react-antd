import React from 'react';
import { Route } from 'react-router-dom';

export default ({ routes }) => (
    <div>
        {
            routes.map((item, i) => {
                return (
                    <Route path={item.path} key={i} render={props =>
                        // 把子路由向下传递以达到嵌套
                        <item.component {...props} routes={item.children} path={item.path} />
                    }
                    />
                );
            })
        }
    </div>
);
