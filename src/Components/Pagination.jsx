import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Pagination.css";

const Pagination = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(10);
  const [error, setError] = useState(null);

  // Fetch employee data on mount
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
      }
    };
    fetchEmployees();
  }, []);

  // Debugging current page change
  useEffect(() => {
    console.log("CURRENT PAGE:", currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(employees.length / employeesPerPage);
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const nextPage = () => {
    setCurrentPage((prev) => {
      const next = prev + 1;
      return next <= totalPages ? next : prev;
    });
  };

  const prevPage = () => {
    setCurrentPage((prev) => {
      const previous = prev - 1;
      return previous >= 1 ? previous : prev;
    });
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
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.role}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={prevPage}
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
