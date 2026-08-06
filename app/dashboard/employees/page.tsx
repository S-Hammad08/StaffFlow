"use client";
import { useState } from "react";
import EmployeeTable from "./components/EmployeeTable";
import { employees } from "./data/employees";
import type { Employee } from "./types/employee.types";
import { employees as initialEmployee } from "./data/employees";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeModal from "./components/EmployeeModal";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployee);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [isAdding, setIsAdding] = useState(false);
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
  const handleAdd = (newEmployee: Employee) => {
    const employeeWithId = {
      ...newEmployee,
      id: Date.now(),
    };

    setEmployees((currentEmployees) => [...currentEmployees, employeeWithId]);

    setIsAdding(false);
  };
  // {
  //   isAdding && (
  //     <EmployeeModal onClose={() => setIsAdding(false)}>
  //       <EmployeeForm
  //         mode="add"
  //         onSave={handleAdd}
  //         onCancel={() => setIsAdding(false)}
  //       />
  //     </EmployeeModal>
  //   );
  // }
  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="mt-2 text-gray-600">View and manage all employees.</p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white"
        >
          Add Employee
        </button>
      </div>

      <div className="mt-6">
        <EmployeeTable
          employees={employees}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
      {selectedEmployee && (
        <EmployeeModal onClose={() => setSelectedEmployee(null)}>
          <EmployeeForm
            employee={selectedEmployee}
            onSave={handleSave}
            onCancel={() => setSelectedEmployee(null)}
          />
        </EmployeeModal>
      )}
      {isAdding && (
        <EmployeeModal onClose={() => setIsAdding(false)}>
          <EmployeeForm
            mode="add"
            onSave={handleAdd}
            onCancel={() => setIsAdding(false)}
          />
        </EmployeeModal>
      )}
    </section>
  );
};

export default EmployeesPage;
