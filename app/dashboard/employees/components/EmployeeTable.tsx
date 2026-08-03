import { Employee } from "../types/employee.types";
import StatusBadge  from "./StatusBadge";
import EmployeeActions from "./EmployeeActions";
type EmployeeTableProp = {
    employees :Employee[];
    onDelete: (id : number) => void;
}
const EmployeeTable = (({employees,
  onDelete, 
} : EmployeeTableProp)=>{
return(
     <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full text-left">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-b last:border-b-0">
              <td className="px-4 py-3">
  <EmployeeActions
    onDelete={() => onDelete(employee.id)}
  />
</td>
              <td className="px-4 py-3 font-medium">{employee.name}</td>
              <td className="px-4 py-3">{employee.email}</td>
              <td className="px-4 py-3">{employee.department}</td>
              <td className="px-4 py-3"><StatusBadge status={employee.status}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
)
})
export default EmployeeTable;