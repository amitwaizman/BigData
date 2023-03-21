/*
Written by: Eldad Tsemach
The code above is a React component that creates a search functionality and displays data from an API in a table.
It uses the useState and useEffect hooks from React to manage state and perform side effects, and axios to make HTTP requests.
The Table component maps over the data received from the API to render a table, while the Search component
handles user input for the search criteria, updates the table data accordingly, and fetches data from the API based on the search criteria.
*/

import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://localhost:3001/redis-data';

// This component takes in data as a prop and renders it in a table format with the header row and all other rows.
const Table = ({ data }) => {
    const tableRows = Object.keys(data).map((key) => (
        <tr key={key} >
            {Object.keys(data[key]).map((innerKey) => (
                <td key={innerKey}>{data[key][innerKey]}</td>
            ))}
        </tr>
    ));

    return (
        <table className="table">
            <thead>
                <tr>
                    {Object.keys(data).length > 0 &&
                        Object.keys(data[Object.keys(data)[0]]).map((header) => (
                            <th key={header}>{header}</th>
                        ))}
                </tr>
            </thead>
            <tbody>{tableRows}</tbody>
        </table>
    );
};

// This component is responsible for rendering the search bar and handling the search action, fetching data from an API and displaying it in the Table component.
const Search = () => {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [tableData, setTableData] = useState({
        "1": {
            'Hour': '',
            'Time to handle': '',
            'Amount': '',
            'Olives': '',
            'Mushrooms': '',
            'Bulgarian' :'',
            'Onion': '',
            'Tomato':'',
            'corn':'',
            'eggplant':'',
            'pepper': ''
        }
    });
    const [apidata, setApiData] = useState({});

    // This function is called when the date input value changes and updates the selectedDate state with the new value.
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    // This function is called when the branch input value changes and updates the selectedBranch state with the new value.
    const handleBranchChange = (event) => {
        setSelectedBranch(event.target.value);
    };

    // This function is called when the search button is clicked and makes an API call to fetch data based on the selected date and branch.
    // It also updates the tableData state with the fetched data.
    const handleSearch = async () => {
        setTableData({
            "1": {
                'Hour': 'Loading',
                'Time to handle': 'Loading',
                'Amount': 'Loading',
                'Olives': 'Loading',
                'Mushrooms': 'Loading',
                'Bulgarian' :'Loading',
                'Onion': 'Loading',
                'Tomato':'Loading',
                'corn':'Loading',
                'eggplant':'Loading',
                'pepper': 'Loading'
            }
        });
        setIsDisabled(true);
        const response = await axios.get(`https://localhost:3001/data?date=${selectedDate}&branch=${selectedBranch}`);
        setTableData(response);
        setIsDisabled(false);
    };

    // This hook is used to fetch data from an API when the component mounts and updates the apiData state with the fetched data.
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API_URL);
                const apidata = await response.data;
                setApiData(apidata);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    // This function filters out the branch names from the apiData state and returns an array of branch names.
    const branchNames = Array.from(Object.keys(apidata).filter((key) => {
        return key.includes('Branch_') && apidata[key] == 'open';
    }).map(key => key.substring(7)))

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <h1>נתוני הזמנות לסניף בתאריך מסוים</h1>
            <div className="cardSearch" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '30px' }}>
                <button disabled={isDisabled} onClick={handleSearch} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '10px', backgroundColor: 'white', color: 'black', border: 'none', borderRadius: '5px', padding: '5px 10px' }}>
                    <FaSearch style={{ marginRight: '5px' }} />חפש
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 30px' }}>
                    <input type="date" id="date-selector" onChange={handleDateChange} />
                    <label htmlFor="date-selector" style={{ marginLeft: '10px' }}>תאריך</label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 30px' }}>
                    <select id="branch-selector" onChange={handleBranchChange}>
                        {
                            branchNames.map(name => (
                                (<option value={name}>{name}</option>)
                            ))
                        }
                    </select>
                    <label htmlFor="branch-selector" style={{ marginLeft: '10px' }}>סניף</label>
                </div>

            </div>
            <div className="cardSearch">
                <Table data={tableData} />
            </div>
        </div>
    );
};

export default Search;