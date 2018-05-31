/*
 * 用例： ajax.post(url, params, callback, { dataType: 'form' })
 * dataType: json: 默认，不用传，form: 普通form类型，multi: 二进制文件form类型
 */

import axios from 'axios';
import qs from 'qs';
import { message } from 'antd';

// 跨域允许传cookie
axios.defaults.credentials = true;

const doAction = (type, url, params, callback, opts) => {
    // 默认选项(dataType: 'multi' 时，可进行二进制form提交)
    opts = Object.assign({ dataType: 'json', isNeedDiy: false, error: '数据返回错误！' }, opts);

    // 参数处理，get包一层
    if (type === 'get') {
        params = { params };
    } else {
        // 只有form类型需要qs序列化（multipart/form-data除外）
        params = opts.dataType === 'form' ? qs.stringify(params) : params;
    }

    // 本地代理时需要（为区别history模式的路由），先加上前缀，再config/index.js代理时去掉
    url = `/api${url}`;

    // 请求主体
    return axios[type](url, params).then((response) => {
        // 拦截未登录状态
        const res = response.data.ret || response.data;
        if (res.code && res.code === '-1999') {
            message.warning(res.error || '请先登录！');
            window.location.href = `${window.location.origin}/login`;
            return false;
        }

        // 回调函数里报错会上升到Promise，触发错误catch，所以用try处理
        try {
            // 自定义处理结果
            if (opts.isNeedDiy) {
                callback(res);
            } else if (res.success) {
                callback(res.data);
            } else {
                message.warning(res.error || opts.error);
            }
        } catch (e) {
            message.error(String(e));
        }
        return Promise.resolve(response);
    }).catch((error) => {
        message.error(`Code：[${error.response.status}]，接口错误，请检查！`);
        return Promise.reject(error);
    });
};

export default {
    get(...args) {
        return doAction('get', ...args);
    },
    post(...args) {
        return doAction('post', ...args);
    },
    all(...args) {
        return axios.all([...args]).then(axios.spread((...res) => Promise.resolve(res)))
            .catch((error) => Promise.reject(error));
    }
};
