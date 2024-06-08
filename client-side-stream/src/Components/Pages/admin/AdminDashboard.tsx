// src/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import Layout from './Layout';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { chartType, dongnutInterface, dongnutTypeData } from '../../../Functions/interfaces';
import { getDoungnutData, getLastSubscriptions, getPostDongnutData } from '../../../Functions/streamFunctions/adminStreamFunction';
import { getAllUsers } from '../../../Functions/userFunctions/adminManagement';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, ArcElement);

function AdminDashboard() {
    const [dongnutData, setDoungnutData] = useState<dongnutTypeData[]>([])
    const [months, setMonths] = useState<string[]>([]);
    const [barData, setBarData] = useState<number[]>([]);

    useEffect(() => {
        getDoungnutData().then(({ data }) => {
            getAllUsers().then((response) => {
                getPostDongnutData(response.length).then((res) => {
                    setDoungnutData([...data, res.data])
                })
            })
        })
        getLastSubscriptions(6).then(({ data }) => {
            setMonths(data.months); setBarData(data.data);
        })
    }, [])


    return (
        <Layout>
            <div className="m-5">
                <h2 className='text-xl font-bold'>Dashboard</h2>

                {dongnutData.length > 0 && <div className="flex w-[95%] mt-5">
                    {["stream by users", "video by users", "shorts by users", "post by users"].map((item: string, idx: number) => {
                        return <SingleValueDoughnutChart headtext={item} dongnutData={dongnutData[idx]} />
                    })}
                </div>}

                <div className="m-5 mt-10 w-[90%]">
                    <MyChart heading='Subscriptions in last 6 months' months={months} data={barData} />
                </div>
            </div>
        </Layout>
    );
}

export default React.memo(AdminDashboard);




const MyChart = ({ heading, months, data }: chartType) => {
    const total = data.reduce((acc, curr) => acc + curr, 0)
    const barData = {
        labels: months,
        datasets: [
            {
                label: 'Subscriptions', data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };



    return (
        <div>
            <h2 className='font-semibold mb-6'>Total {heading} : {total}</h2>
            <Bar data={barData} options={{ responsive: true }} />
        </div>
    );
};


const SingleValueDoughnutChart = ({ headtext, dongnutData }: dongnutInterface) => {



    const data = {
        labels: [dongnutData.completeText, dongnutData.remainingText],
        datasets: [
            {
                data: [dongnutData.completedPercentage, dongnutData.remainingPercentage],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(201, 203, 207, 0.6)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(201, 203, 207, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                enabled: true,
            },
        },
        cutout: '70%',
        animation: {
            animateScale: true,
            animateRotate: true,
        },
    };

    return (
        <div className='w-[80%] ml-3'>
            <h2 className='text-center mb-2' >{headtext}</h2>
            <Doughnut data={data} width={10} options={options} />
        </div>
    );
};
