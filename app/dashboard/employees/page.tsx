"use client";
import { useState } from "react";
import EmployeeTable from "./components/EmployeeTable";
import { employees } from "./data/employees";
import type { Employee } from "./types/employee.types";
import { employees as initialEmployee } from "./data/employees";
import EmployeeForm from "./components/EmployeeForm";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployee);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  /////////////////////// CRUD Functions ////////////////
  const handleDelete = (id: number) => {
    setEmployees((currentEmployees) =>
      currentEmployees.filter((employees) => employees.id !== id),
    );
  };
  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
  };
  const handleSave = (updatedEmployee: Employee) => {
    setEmployees((currentEmployees) =>
      currentEmployees.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee,
      ),
    );
    setSelectedEmployee(null);
  };

  return (
    <section>
      <h1 className="text-3xl font-bold">Employees</h1>

      <p className="mt-2 text-gray-600">View and manage all employees.</p>

      <div className="mt-6">
        <EmployeeTable
          employees={employees}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
      {selectedEmployee && (
        <EmployeeForm
          employee={selectedEmployee}
          onSave={handleSave}
          onCancel={() => setSelectedEmployee(null)}
        />
      )}
    </section>
  );
};

export default EmployeesPage;
