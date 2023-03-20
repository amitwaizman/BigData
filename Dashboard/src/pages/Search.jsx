import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://localhost:3001/redis-data';

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

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleBranchChange = (event) => {
        setSelectedBranch(event.target.value);
    };

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