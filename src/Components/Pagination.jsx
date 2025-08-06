import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Pagination.css";

const Pagination = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  const employeesPerPage = 10;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        setEmployees(response.data);
      } catch (err) {
        setError("failed to fetch data");
        console.log(`failed to fetch data ${err}`);
        
        alert("failed to fetch data");
      }
    };

    fetchEmployees();
  }, []);

  const totalPages = Math.ceil(employees.length / employeesPerPage);

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="container">
      <h1>Employee Data Tables</h1>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map((employee) => (
            <tr key={employee.id} data-testid="employee-row">
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={handlePrevious} disabled={currentPage === 1}>
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>Page {currentPage}</span>
        <button onClick={handleNext} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
