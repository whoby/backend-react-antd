import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const renderSelect = (data = {}, args) => {
    let options = null;

    args = Object.assign({
        keyName: 'id',
        valueName: 'name',
        disabled: false,
        className: '',
        style: {},
        onChange() {}
    }, args);

    // 兼容数组or对象
    if (typeof data === 'object' && data instanceof Array) {
        options = data.map(item => <Option key={item[args.keyName]} value={item[args.keyName]}>{item[args.valueName]}</Option>);
    } else {
        options = Object.keys(data).map(key => <Option key={key} value={key}>{data[key]}</Option>);
    }

    return (
        <Select placeholder="请选择" allowClear disabled={args.disabled} className={args.className} style={args.style} onChange={args.onChange}>
            {options}
        </Select>
    );
};

export default renderSelect;
