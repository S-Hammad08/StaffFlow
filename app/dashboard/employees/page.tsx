"use client";
import { useState } from "react";
import EmployeeTable from "./components/EmployeeTable";
import { employees } from "./data/employees";
import type { Employee } from "./types/employee.types";
import { employees as initialEmployee } from "./data/employees";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployee);
 
  const handleDelete =(id: number)=>{
    setEmployees((currentEmployees)=>
    currentEmployees.filter((employees)=>employees.id !== id));
  };
  return (
    <section>
      <h1 className="text-3xl font-bold">Employees</h1>

      <p className="mt-2 text-gray-600">
        View and manage all employees.
      </p>

      <div className="mt-6">
        <EmployeeTable employees={employees}
        onDelete={handleDelete} />
      </div>
    </section>
  );
};

export default EmployeesPage;