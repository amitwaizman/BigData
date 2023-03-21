/*
Written by: Eldad Tsemach
This code is a React component that uses various libraries such as Chart.js and axios to fetch and display data from an API.
The component defines state variables for different data sets, fetches the data using axios, and updates the state variables
accordingly using the useState hook. The useEffect hook is used to fetch data when the component mounts.

The component also calculates various metrics based on the data, such as the number of open branches and open orders,
the average handling time, the number of orders per area and hour, and the number of orders for the day.

Finally, the component generates different charts using the fetched data and the calculated metrics,
such as a pie chart for the number of orders per area, a bar chart for the top 5 order additions,
and a line chart for the top 5 branches with the shortest handling time.
*/

import React, { useState, useEffect } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, registerables } from 'chart.js/auto';
import { FaHammer } from 'react-icons/fa';
import { MdAddTask, MdStarRate, MdRemoveRedEye } from "react-icons/md";
import '../css/style.css';

Chart.register(...registerables); // Register the "arc" element

const API_URL = 'http://localhost:3001';

const Dashboard = () => {
    // Define state variables
    const [data, setData] = useState({});
    const [top5Addings, setTop5Addings] = useState({});
    const [top5Handlers, setTop5Handlers] = useState({});
    const [avgHandleTime, setAvgHandleTime] = useState({});
    const [allOrdersOfToday, setAllOrdersOfToday] = useState({});

    // Fetch data from API on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API_URL + "/redis-data");
                const data = await response.data;
                const response2 = await axios.get(API_URL + "/getTop5Addings")
                const data2 = await response2.data
                const response3 = await axios.get(API_URL + "/getTop5FastestHandlers")
                const data3 = await response3.data
                const response4 = await axios.get(API_URL + "/getAvarageHandleTime")
                const data4 = await response4.data
                const response5 = await axios.get(API_URL + "/getAllOrdersFromToday")
                const data5 = await response5.data
                setData(data);
                setTop5Addings(data2);
                setTop5Handlers(data3);
                setAvgHandleTime(data4);
                setAllOrdersOfToday(data5);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    // Calculate various metrics based on data

    const branchCount = Object.keys(data).filter((key) => {
        return key.includes('Branch_') && data[key] == 'open';
    }).length;

    const openOrdersCount = Object.keys(data).filter((key) => {
        return key.includes('Order_') && JSON.parse(data[key])["status"] == "in process"
    }).map(key => {
    }).length

    const numberOfOrderToday = Object.keys(allOrdersOfToday).length

    const avgHandlersTime = avgHandleTime["data"]

    const numberOfOrderByArea = {}
    Object.keys(allOrdersOfToday).forEach(key => {
        const area = JSON.parse(allOrdersOfToday[key])["Area"]
        numberOfOrderByArea[area] = numberOfOrderByArea[area] == null ? 1 : numberOfOrderByArea[area] + 1
    })

    const numberOfOrderByHour = {}
    Object.keys(allOrdersOfToday).forEach(key => {
        const hour = new Date(JSON.parse(allOrdersOfToday[key])["Date"]).getHours()

        console.log(`key = ${allOrdersOfToday[key]} --- ${hour}`)
        numberOfOrderByHour[hour] = numberOfOrderByHour[hour] == null ? 1 : numberOfOrderByHour[hour] + 1
    })

    console.log(numberOfOrderByHour)

    // console.log(avgHandlersTime)

    // console.log(Array.from(Object.keys(numberOfOrderByArea).map(key => numberOfOrderByArea[key])))

    const chartData = {
        labels: Array.from(Object.keys(numberOfOrderByArea)),
        datasets: [
            {
                data: Array.from(Object.keys(numberOfOrderByArea).map(key => numberOfOrderByArea[key])),
                backgroundColor: ['#141592', '#926535', '#897932', '#846264', '#338327', '#950288'],
                hoverBackgroundColor: ['#1a75ff', '#b3725d', '#a3a352', '#a77a91', '#4db34d', '#bb3d8f'],
            },
        ],
    };

    const top5AddingsChartData = {
        labels: Array.from(Object.keys(top5Addings).map(key => top5Addings[key]["label"])),
        datasets: [
            {
                label: 'טופ 5 התוספות שהוזמנו',
                data: Array.from(Object.keys(top5Addings).map(key => top5Addings[key]["value"])),
                backgroundColor: ['#141592', '#926535', '#897932', '#338327', '#950288'],
                borderColor: ['#1a75ff', '#b3725d', '#a3a352', '#4db34d', '#bb3d8f'],
                borderWidth: 1,
            },
        ],
    };

    const top5HandlersChartData = {
        labels: Array.from(Object.keys(top5Handlers).map(key => top5Handlers[key]["label"])),
        datasets: [
            {
                label: 'טופ 5 הסניפים עם זמן טיפול הכי קצר',
                data: Array.from(Object.keys(top5Handlers).map(key => top5Handlers[key]["value"])),
                backgroundColor: ['#141592', '#926535', '#897932', '#338327', '#950288'],
                hoverBackgroundColor: ['#1a75ff', '#b3725d', '#a3a352', '#4db34d', '#bb3d8f'],
                borderWidth: 1,
            },
        ],
    };

    const orderByHourChartData = {
        labels: Array.from(Object.keys(numberOfOrderByHour)),
        datasets: [
            {
                label: "כמות הזמנות כללית במהלך היום",
                data: Array.from(Object.keys(numberOfOrderByHour).map(key => numberOfOrderByHour[key])),
                borderColor: "rgb(255, 99, 132)",
                fill: false,
            },
        ],
    };

    return (
        <div>
            <div className="container">
                <div style={{ width: '25%', display: 'inline-block', verticalAlign: "top", paddingRight: "20px" }}>
                    <div className="card">
                        <div className="card-header text-center" style={{ borderBottom: "none" }}>
                            <h3 className="text-center"> סניפים פתוחים</h3>
                        </div>
                        <h1 style={{ fontSize: "30px", margin: "0" }}>
                            <FaHammer style={{ fontSize: "40px", marginRight: "100px", color: "gold" }} />
                            <span style={{ marginLeft: "50px", color: "#1785b6" }}>{branchCount}</span>
                        </h1>
                    </div>
                </div>
                <div style={{ width: '25%', display: 'inline-block', verticalAlign: "top", paddingRight: "20px" }}>
                    <div className="card">
                        <div className="card-header text-center" style={{ borderBottom: "none" }}>
                            <h3 className="text-center"> זמן טיפול ממוצע</h3>
                        </div>
                        <h1 style={{ fontSize: "30px", margin: "0" }}>
                            <MdStarRate style={{ fontSize: "40px", marginRight: "100px", color: "#008500" }} />
                            <span style={{ marginLeft: "50px", color: "#1785b6" }}>{avgHandlersTime}</span>
                        </h1>
                    </div>
                </div>
                <div style={{ width: '25%', display: 'inline-block', verticalAlign: "top", paddingRight: "20px" }}>
                    <div className="card">
                        <div className="card-header text-center" style={{ borderBottom: "none" }}>
                            <h3 className="text-center"> סה״כ הזמנות פתוחות </h3>
                        </div>
                        <h1 style={{ fontSize: "30px", margin: "0" }}>
                            <MdAddTask style={{ fontSize: "40px", marginRight: "100px", color: "#fe3800" }} />
                            <span style={{ marginLeft: "30px", color: "#1785b6" }}>{openOrdersCount}</span>
                        </h1>
                    </div>
                </div>
                <div style={{ width: '25%', display: 'inline-block', verticalAlign: "top", paddingRight: "20px" }}>
                    <div className="card">
                        <div className="card-header text-center" style={{ borderBottom: "none" }}>
                            <h3 className="text-center"> סה״כ הזמנות היום</h3>
                        </div>
                        <h1 style={{ fontSize: "30px", margin: "0" }}>
                            <MdRemoveRedEye style={{ fontSize: "40px", marginRight: "100px", color: "#6699CC" }} />
                            <span style={{ marginLeft: "50px", color: "#1785b6" }}>{numberOfOrderToday}</span>
                        </h1>
                    </div>
                </div>
            </div>
            <div className="container">
                <div style={{ width: '33%', display: 'inline-block', verticalAlign: "top", paddingRight: "20px" }}>
                    <div className="card">
                        <div className="card-header text-center" style={{ borderBottom: "none" }}>
                            <h3 className="text-center"> טופ 5 התוספות שהוזמנו</h3>
                        </div>
                        <Bar data={top5AddingsChartData} />
                        <h1 style={{ fontSize: "15px", margin: "0" }}>
                            <span style={{ marginLeft: "50px", color: "#000000" }}>סה״כ (עשרות ק״ג)</span>
                        </h1>
                    </div>
                </div>
                <div style={{ width: '33%', display: 'inline-block', verticalAlign: "top", paddingRight: "20px" }}>
                    <div className="card">
                        <div className="card-header text-center" style={{ borderBottom: "none" }}>
                            <h3 className="text-center"> טופ 5 הסניפים עם זמן טיפול הכי קצר</h3>
                        </div>
                        <Bar data={top5HandlersChartData} />
                        <h1 style={{ fontSize: "15px", margin: "0" }}>
                            <span style={{ marginLeft: "50px", color: "#000000" }}>זמן טיפול (דקות)</span>
                        </h1>
                    </div>
                </div>
                <div style={{ width: '33%', display: 'flex', verticalAlign: "top", paddingRight: "20px" }}>
                    <div className="card">
                        <div className="card-header text-center" style={{ borderBottom: "none" }}>
                            <h3 className="text-center">התפלגות הזמנות לפי איזור</h3>
                        </div>
                        <Pie data={chartData} />
                    </div>
                </div>
            </div>
            <div className="container" style={{  alignItems: "center", justifyContent: "center"}}>
                <div style={{ width: '50%', display: 'inline-block', paddingRight: "20px" }}>
                    <div className="card" style={{ textAlign: "center" }}>
                        <Line data={orderByHourChartData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;