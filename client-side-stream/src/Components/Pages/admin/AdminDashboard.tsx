import React, { useEffect, useRef } from 'react';
import Layout from './Layout';

function AdminDashboard() {
    return (
        <>
            <Layout>
                <div className="m-5">
                    <h2 className='text-xl font-bold'>Dashboard</h2>
                    {/* <LineChart /> */}
                </div>
            </Layout>
        </>
    )
}

export default React.memo(AdminDashboard);