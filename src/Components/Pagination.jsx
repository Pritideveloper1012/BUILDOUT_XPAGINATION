import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Pagination.css";

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
        setError(`Failed to fetch data: ${err.message}`);
        alert('Failed to fetch data');
        console.error('Fetch error:', err);
      }
    };
    fetchEmployees();
  }, []);

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const totalPages = Math.ceil(employees.length / employeesPerPage); // Calculate total pages

  const nextPage = () => {
    if (currentPage < totalPages) { // Ensure this condition is correct
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
      <table border="1" cellPadding="20" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.length === 0 ? (
            <tr><td colSpan="4">No data</td></tr>
          ) : (
            currentEmployees.map((employee) => (
              <tr key={employee.id} data-testid="employee-row">
                <td>{employee.id}</td> {/* Ensure employee.id exists */}
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.role}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className='pagination'>
        <button
          onClick={prevPage}
          disabled={currentPage === 1} // Disable if on the first page
          data-testid="pagination-previous"
        >
          Previous
        </button>
        <span data-testid="current-page">Page {currentPage} of {totalPages}</span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages} // Disable if on the last page
          data-testid="pagination-next"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
