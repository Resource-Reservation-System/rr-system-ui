import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import './Trends.css';

const Trends = () => {
    const [componentBarChartData, setComponentBarChartData] = useState({});
    const [componentBarChartOptions, setComponentBarChartOptions] = useState({});
    const [statusBarChartData, setStatusBarChartData] = useState({});
    const [statusBarChartOptions, setStatusBarChartOptions] = useState({});
    const [trendsData, setTrendsData] = useState({
        returnPercentage: 0,
        rejectedPercentage: 0,
        studentsReturnedCount: 0,
        penalizedPercentage: 0,
    });

    useEffect(() => {
        const fetchTrendsData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/trends/headerInfo`);
                if (!response.ok) {
                    throw new Error('Failed to fetch trends data');
                }
                const data = await response.json();
                setTrendsData(data);
            } catch (error) {
                console.error('Error fetching trends data:', error);
            }
        };

        fetchTrendsData();
    }, []);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/trends/chartInfo`);
                if (!response.ok) {
                    throw new Error('Failed to fetch chart data');
                }
                const data = await response.json();

                // Bar Chart for Component Requests
                const componentLabels = data.components.map((item) => item.component);
                const componentCounts = data.components.map((item) => item.count);

                setComponentBarChartData({
                    labels: componentLabels,
                    datasets: [
                        {
                            label: 'Number of Requests',
                            data: componentCounts,
                            backgroundColor: 'rgba(24, 24, 27, 1)',
                            borderWidth: 1,
                        },
                    ],
                });

                setComponentBarChartOptions({
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Component Requests',
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Request Count',
                            },
                            ticks: {
                                stepSize: 1,
                            },
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Components',
                            },
                        },
                    },
                });

                // Bar Chart for Request Status Distribution
                const statusLabels = data.statusCounts.map((item) => item.status);
                const statusCounts = data.statusCounts.map((item) => item.count);

                setStatusBarChartData({
                    labels: statusLabels,
                    datasets: [
                        {
                            label: 'Request Status Distribution',
                            data: statusCounts,
                            backgroundColor: 'rgba(24, 24, 27, 1)',
                            borderWidth: 1,
                        },
                    ],
                });

                setStatusBarChartOptions({
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Request Status Distribution',
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Request Count',
                            },
                            ticks: {
                                stepSize: 1, 
                            },
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Statuses',
                            },
                        },
                    },
                });

            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };

        fetchChartData();
    }, []);

    return (
        <div>
            <h1>Current Component Trends</h1>
            <p className="rrs-table-label">All the components usage trends will be shown here!</p>


            {/* Statistics Section */}
            <div className="grid-container">
                <div className="grid-item">
                    <h1>{trendsData.returnPercentage}%</h1>
                    <p>of components returned by the students</p>
                </div>
                <div className="grid-item">
                    <h1>{trendsData.rejectedPercentage}%</h1>
                    <p>of components returned without any issues</p>
                </div>
                <div className="grid-item">
                    <h1>{trendsData.studentsReturnedCount}%</h1>
                    <p>of students came back for other components</p>
                </div>
                <div className="grid-item">
                    <h1>{trendsData.penalizedPercentage}%</h1>
                    <p>of components were penalized credits</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-container">
                {/* Bar Chart for Component Requests */}
                <div className="chart-item">
                    <h2>Component Requests</h2>
                    <Chart type="bar" data={componentBarChartData} options={componentBarChartOptions} />
                </div>
                {/* Bar Chart for Request Status */}
                <div className="chart-item">
                    <h2>Request Status Distribution</h2>
                    <Chart type="bar" data={statusBarChartData} options={statusBarChartOptions} />
                </div>
            </div>
        </div>
    );
};

export default Trends;
