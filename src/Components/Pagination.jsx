import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Pagination.css";

const Pagination = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentEmployees, setCurrentEmployees] = useState([]);
  const [employeesPerPage] = useState(10);
  const [error, setError] = useState(null);

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
        );
        setEmployees(response.data);
      } catch (err) {
        setError(`Failed to fetch data: ${err.message}`);
        alert('Failed to fetch data');
        console.error('Fetch error:', err);
      }
    };
    fetchEmployees();
  }, []);

  // Update currentEmployees on page change
  useEffect(() => {
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;

    // Delay to ensure DOM is updated before Cypress acts
    const timeout = setTimeout(() => {
      const current = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);
      setCurrentEmployees(current);
    }, 0);

    return () => clearTimeout(timeout);
  }, [currentPage, employees]);

  const totalPages = Math.ceil(employees.length / employeesPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      console.log(`Navigated to next page: ${currentPage + 1}`);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      console.log(`Navigated to previous page: ${currentPage - 1}`);
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
            <tr>
              <td colSpan="4">No data</td>
            </tr>
          ) : (
            currentEmployees.map((employee) => (
              <tr key={employee.id} data-testid="employee-row">
                <td>{employee.id}</td>
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
          aria-disabled={currentPage === 1}
          disabled={currentPage === 1}
          data-testid="pagination-previous"
        >
          Previous
        </button>
        <span data-testid="current-page">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          aria-disabled={currentPage === totalPages}
          disabled={currentPage === totalPages}
          data-testid="pagination-next"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
