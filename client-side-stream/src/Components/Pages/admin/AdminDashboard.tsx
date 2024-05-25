import React from 'react'
import { Provider } from 'react-redux'
import Layout from './Layout'

function AdminDashboard() {
    return (
        <>
            <Layout>hello i am Dashboard</Layout>
        </>
    )
}

export default React.memo(AdminDashboard)
