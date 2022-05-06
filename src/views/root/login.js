import React from 'react'
import { useHistory } from 'react-router-dom'
import { observer } from 'mobx-react'
import { Form, Input, Button } from 'antd'
import { formItemLayout } from '@/config/global'
import styled from 'styled-components'
import { useStore } from '@/hooks'
import { ajax, util } from '@/libs'

const Login = () => {
    const store = useStore('userStore')
    const history = useHistory()

    const onFinish = (values) => {
        const params = values
        // 加密
        params.password = util.encrypt(values.password)

        ajax.post('/doLogin', params, (res) => {
            // 保存登录信息
            store.saveUserName(values.userName)
            history.push('/index')
        })
    }

    return (
        <Wrap>
            <div className="loginPage">
                <div className="loginBox">
                    <div className="logo">通用后台管理系统</div>
                    <Form onFinish={onFinish} className="mr40">
                        <Form.Item {...formItemLayout.sg} name="userName" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
                            <Input placeholder="请输入手机号" />
                        </Form.Item>
                        <Form.Item {...formItemLayout.sg} name="password" label="密 码" rules={[{ required: true, message: '请输入密码' }]}>
                            <Input type="password" placeholder="请输入密码" />
                        </Form.Item>
                        <Form.Item style={{ textAlign: 'center' }}>
                            <Button type="primary" htmlType="submit" className="loginBtn">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </Wrap>
    )
}

export default observer(Login)

const Wrap = styled.div`
    .loginPage {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        width: 100%;
        top: 0;
        bottom: 0;
        left: 0;
        background: url(${require('@/assets/img/login-bg1.webp')}) no-repeat center;
        background-blend-mode: multiply;
        background-size: cover;
    }
    .loginBox {
        width: 360px;
        color: #c5dfe6;
    }
    .logo {
        margin: 0px auto 40px auto;
        padding-top: 115px;
        color: #fff;
        text-align: center;
        font-size: 23px;
        background: url(${require('@/assets/img/login-logo.png')}) no-repeat top center;
    }
    loginbtn: {
        padding: 5px 35px;
        margin-left: 40px;
    }
`
