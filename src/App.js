import React from 'react'
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import Headbar from 'module/common/headbar'
import Sidebar from 'module/common/sidebar'
import Breadcrumb from 'module/common/breadcrumb'

const App = (route) => (
    <LocaleProvider locale={zhCN}>
        <div style={styles.app}>
            <Headbar />
            <div style={styles.content}>
                {
                    route.location.pathname === '/index' ? route.children : (
                        <div>
                            <aside style={styles.aside}>
                                <Sidebar />
                            </aside>
                            <div style={styles.main}>
                                <div style={styles.breadcrumb}>
                                    <Breadcrumb />
                                </div>
                                <div style={styles.mainContent}>
                                    {route.children}
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    </LocaleProvider>
)

export default App

const styles = {
    app: {
        backgroundColor: '#fff'
    },
    content: {
        marginTop: 60,
        padding: 0,
        width: '100%',
    },
    aside: {
        position: 'fixed',
        display: 'block',
        top: 60,
        bottom: 0,
        left: 0,
        width: '12%',
        overflowX: 'hidden',
        color: '#333',
        zIndex: '999',
        borderRight: '1px solid #ddd',
    },
    main: {
        padding: 20,
        backgroundColor: '#fff',
        width: '88%',
        marginLeft: '12%',
    },
    breadcrumb: {
        padding: '8px 15px',
        marginBottom: 20,
        listStyle: 'none',
        backgroundColor: '#f5f5f5',
        borderRadius: 4,
        fontSize: 14,
    },
    mainContent: {
        padding: '0 20px 20px'
    }
}
