import React, { useState, useEffect } from 'react';
import { RiDeleteBin6Line } from "react-icons/ri";
import './index.css'

const CsvGenerator = () => {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  let isListEmpty = employees.length===0

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
        const response = await fetch('https://csv-generator.onrender.com/employees');
        const data = await response.json();
        setEmployees(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addEmployee = async (e) => {
    e.preventDefault();

    if (!name || !email || !jobTitle) return;

    try {
        await fetch('https://csv-generator.onrender.com/employees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, jobTitle }),
        });
  
        setName('');
        setEmail('');
        setJobTitle('');
        fetchEmployees();
      } catch (error) {
        console.error(error);
      }
  };

  const deleteEmployee = async (id) => {
    try {
        await fetch(`https://csv-generator.onrender.com/employees/${id}`, {
          method: 'DELETE',
        });
        fetchEmployees();
      } catch (error) {
        console.error(error);
      }
  };

  const downloadCSV = async () => {
    try {
        const response = await fetch('https://csv-generator.onrender.com/download', {
          method: 'GET',
          responseType: 'blob',
        });
  
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'employees.csv');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch (error) {
        console.error(error);
      }
  };

  console.log(employees)

  return (
    <div className="main-container">
        <div className='form-container'>
      <h1>Employee Management</h1>
      <form onSubmit={addEmployee} >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          required
        />
        <button type="submit" className='add-employes-btn'>Add Employee</button>
      </form>
      </div>
      <div className='employees-list' >
        <h1>Employees List</h1>
        {isListEmpty ? (
            <div className='not-found'>
            <h1>No records found...</h1>
            </div>
        ) : (
            <div className='employees'>
            {employees.map((employee, index) => (
              <div key={index} className='employee' >
                <span className='details'>{employee.name}</span>
                <span className='details'>{employee.email}</span>
                <span className='details'>{employee.jobTitle}</span>
                <button type='button' className='delete-icon' onClick={() => deleteEmployee(employee._id)}><RiDeleteBin6Line/></button>
              </div>
            ))}
            </div>
        )}
        {!isListEmpty && <button onClick={downloadCSV} className='download-btn' >Download CSV</button>}
      </div>
    </div>
  );
}

export default CsvGenerator;
