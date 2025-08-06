// src/Pagination.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Pagination.css"
const Pagination = () => {
    const [employees, setEmployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(10);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
                setEmployees(response.data);
            } catch (err) {
                setError('failed to fetch data',err);
                alert('failed to fetch data');
                console.error('Fetch error occurred at line X: ', err); // You’ll know which line caused the issue
            }
        };

        fetchEmployees();
    }, []);

    // Calculate the current employees to display
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    // Change page
    const nextPage = () => {
        if (currentPage < Math.ceil(employees.length / employeesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
       <div className="container">
            {error && <p>{error}</p>}
            <table  border="1" cellPadding="20" cellSpacing="0">
                <thead >
                    <tr>
                        <th>IO</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {currentEmployees.map((employee, index) => (
                        <tr key={employee.id}>
                         <td>{(currentPage - 1) * 10 + index + 1}</td>
                            <td>{employee.name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='pagination' >
                <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                <span> Page {currentPage} of {Math.ceil(employees.length / employeesPerPage)} </span>
                <button onClick={nextPage} disabled={currentPage === Math.ceil(employees.length / employeesPerPage)}>Next</button>
            </div>
        </div>
    );
};

export default Pagination;
