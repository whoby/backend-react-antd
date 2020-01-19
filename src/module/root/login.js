import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Form, Input, Button } from 'antd'
import { formItemLayout } from '@/config/global'
import { ajax, util } from '@/libs'

const FormItem = Form.Item

@withRouter
@inject('userStore')
@observer
class Login extends Component {
    constructor(props) {
        super(props)
        this.store = props.userStore
    }

    onSubmit = e => {
        e.preventDefault()

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const params = values
                // 加密
                params.password = util.encrypt(values.password)

                ajax.post('/doLogin', params, res => {
                    // 保存登录信息
                    this.store.saveUserName(res.realName)
                    this.props.history.push('/index')
                })
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <div className="loginPage" style={styles.loginPage}>
                <div style={styles.loginBox}>
                    <div style={styles.logo}>通用后台管理系统</div>
                    <Form onSubmit={this.onSubmit} className="mr40">
                        <FormItem {...formItemLayout.sg} label="用户名">
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入用户名' }]
                            })(<Input placeholder="请输入手机号" />)}
                        </FormItem>
                        <FormItem {...formItemLayout.sg} label="密 码">
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码' }]
                            })(<Input type="password" placeholder="请输入密码" />)}
                        </FormItem>
                        <FormItem style={{ textAlign: 'center' }}>
                            <Button type="primary" htmlType="submit" style={styles.loginBtn}>
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(Login)

const styles = {
    loginPage: {
        position: 'fixed',
        width: '100%',
        top: 0,
        bottom: 0,
        left: 0
    },
    loginBox: {
        width: 360,
        margin: '200px auto',
        color: '#C5DFE6'
    },
    logo: {
        margin: '0px auto 40px auto',
        paddingTop: 115,
        color: '#fff',
        textAlign: 'center',
        fontSize: 23,
        background: `url(${require('@/assets/img/login-logo.png')}) no-repeat top center`
    },
    vcode: {
        position: 'absolute',
        width: 53,
        height: 22,
        top: 9,
        right: 10,
        cursor: 'pointer'
    },
    loginBtn: {
        padding: '5px 35px',
        marginLeft: 40
    }
}
