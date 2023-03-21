/*
Written by: Eldad Tsemach
The code is a React component for an analytics dashboard that allows users to search for relationships
between data and display the results in a table. It uses Axios to make HTTP requests to an API and
displays the resulting data in a table using the Table component. The date range for the search is
selected through two date input fields and the search is executed through a button click event.
*/

// import necessary libraries
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

// Table component which displays data as a table
const Table = ({ tableData }) => {
  // Convert the object into table rows and columns
  const tableRows = Object.keys(tableData).map((key) => (
    <tr key={key}>
      {Object.keys(tableData[key]).map((innerKey) => (
        <td key={innerKey}>{tableData[key][innerKey]}</td>
      ))}
    </tr>
  ));

  return (
    // Render the table
    <table className="table">
      <thead>
        <tr>
          {Object.keys(tableData).length > 0 &&
            Object.keys(tableData[Object.keys(tableData)[0]]).map((header) => (
              <th key={header}>{header}</th>
            ))}
        </tr>
      </thead>
      <tbody>{tableRows}</tbody>
    </table>
  );
};

// Analytics component which displays the search form and the result table
const Analytics = () => {
  // Declare state variables
  const [selectedDate1, setSelectedDate1] = useState('');
  const [selectedDate2, setSelectedDate2] = useState('');
  const [isDisabled, setIsDisabled] = useState(false); // disables search button while searching
  const [tableData, setTableData] = useState({
    '0': {
      Antecedent: '',
      Consequent: '',
      'Support (%)': '',
      'Confidence (%)': ''
    }
  });

// Handle changes to the "from" date input field
  const handleDateChange1 = (event) => {
    setSelectedDate1(event.target.value);
  };

// Handle changes to the "to" date input field
  const handleDateChange2 = (event) => {
    const selectedDate = new Date(event.target.value);
    selectedDate.setHours(23, 59, 59, 999); // Set the time to the end of the day
    setSelectedDate2(selectedDate.toISOString());
  };

 // Handle the search button click event
  const handleSearch = async (event) => {
    setTableData({'0': {
      Antecedent: 'Loading',
      Consequent: 'Loading',
      'Support (%)': 'Loading',
      'Confidence (%)': 'Loading'
    }})
    setIsDisabled(true); // Disable the search button while searching
    // Call the API and get the response data
    const isoDate1 = new Date(selectedDate1).toISOString();
    const isoDate2 = new Date(selectedDate2).toISOString();
    const response = (await axios.get(`http://localhost:3001/getdatafrombigml?startdate=${isoDate1}&enddate=${isoDate2}`)).data;

    // Update the table data with the response data and enable the search button
    setTableData(response);
    setIsDisabled(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <h1>מציאת חוקי קשר</h1>
      <div className="cardSearch" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '30px' }}>
        <button disabled={isDisabled} onClick={handleSearch} 
         style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '10px', backgroundColor: 'white', color: 'black', border: 'none', borderRadius: '5px', padding: '5px 10px' }}>
          <FaSearch style={{ marginRight: '5px' }} />
          צור מודל
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 10px 0 30px' }}>
          <input type="date" id="date-selector1" onChange={handleDateChange2} />
          <label htmlFor="date-selector1" style={{ marginLeft: '10px' }}>לתאריך</label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 10px' }}>
          <input type="date" id="date-selector2" onChange={handleDateChange1} />
          <label htmlFor="date-selector2" style={{ marginLeft: '10px' }}>מתאריך</label>
        </div>

      </div>
      <div className="cardSearch">
        <Table tableData={tableData} />
      </div>
    </div>
  );
};

export default Analytics;
