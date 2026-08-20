"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, SearchX, UserRoundPlus } from "lucide-react";
import { useDeferredValue, useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import LoadingState from "@/components/ui/LoadingState";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/components/ui/Pagination";
import { getApiErrorMessage } from "@/lib/api";
import { departmentKeys, getDepartments } from "../departments/services/department.service";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeFilters from "./components/EmployeeFilters";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeModal from "./components/EmployeeModal";
import {
  createEmployee,
  deleteEmployee,
  employeeKeys,
  getEmployees,
  updateEmployee,
} from "./services/employee.service";
import type { Employee, EmployeeFilters as Filters, EmployeeInput } from "./types/employee.types";

const initialFilters: Filters = {
  search: "",
  department: "",
  status: "",
  sort: "name-asc",
};

const EmployeesPage = () => {
  const queryClient = useQueryClient();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(filters.search.trim());
  const queryFilters = { ...filters, search: deferredSearch, page, limit: 5 };

  const employeeQuery = useQuery({
    queryKey: employeeKeys.list(queryFilters),
    queryFn: () => getEmployees(queryFilters),
    placeholderData: keepPreviousData,
  });
  const departmentQuery = useQuery({
    queryKey: departmentKeys.list(),
    queryFn: getDepartments,
  });

  const invalidateWorkforceQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: employeeKeys.all }),
      queryClient.invalidateQueries({ queryKey: departmentKeys.all }),
      queryClient.invalidateQueries({ queryKey: ["reports"] }),
      queryClient.invalidateQueries({ queryKey: ["attendance"] }),
    ]);
  };

  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: async () => {
      setIsAdding(false);
      toast.success("Employee added successfully.");
      await invalidateWorkforceQueries();
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Unable to add employee.")),
  });

  const updateMutation = useMutation({
    mutationFn: updateEmployee,
    onSuccess: async () => {
      setSelectedEmployee(null);
      toast.success("Employee updated successfully.");
      await invalidateWorkforceQueries();
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Unable to update employee.")),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: async () => {
      if ((employeeQuery.data?.data.length ?? 0) === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      }
      setEmployeeToDelete(null);
      toast.success("Employee deleted successfully.");
      await invalidateWorkforceQueries();
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Unable to delete employee.")),
  });

  const handleFilterChange = <Key extends keyof Filters>(key: Key, value: Filters[Key]) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };

  const handleEditSave = (input: EmployeeInput) => {
    if (selectedEmployee) updateMutation.mutate({ id: selectedEmployee.id, input });
  };

  const employees = employeeQuery.data?.data ?? [];
  const departments = departmentQuery.data ?? [];
  const hasFilters = Boolean(filters.search || filters.department || filters.status);

  return (
    <section>
      <PageHeader
        title="Employees"
        description="View, search, and manage everyone in your organization."
        action={<button
          type="button"
          onClick={() => setIsAdding(true)}
          disabled={departmentQuery.isPending || departments.length === 0}
          title={departments.length === 0 ? "Create a department before adding employees" : undefined}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Add employee
        </button>}
      />

      <EmployeeFilters
        filters={filters}
        departments={departments}
        onChange={handleFilterChange}
      />

      <div className="mt-4 min-h-4 text-right text-xs text-slate-500" aria-live="polite">
        {employeeQuery.isFetching && !employeeQuery.isPending ? "Updating results…" : ""}
      </div>

      <div className="mt-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {employeeQuery.isPending ? (
          <LoadingState message="Loading employees…" />
        ) : employeeQuery.isError ? (
          <div className="p-5">
            <ErrorState
              message={getApiErrorMessage(employeeQuery.error, "Unable to load employees.")}
              onRetry={() => employeeQuery.refetch()}
            />
          </div>
        ) : employees.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={hasFilters ? SearchX : UserRoundPlus}
              title={hasFilters ? "No employees match your filters" : "No employees yet"}
              description={
                hasFilters
                  ? "Try changing your search, department, or status filters."
                  : "Add your first employee to begin building your team directory."
              }
              actionLabel={hasFilters ? undefined : "Add first employee"}
              onAction={hasFilters ? undefined : () => setIsAdding(true)}
            />
          </div>
        ) : (
          <>
            <EmployeeTable
              employees={employees}
              onDelete={setEmployeeToDelete}
              onEdit={setSelectedEmployee}
            />
            <Pagination
              page={employeeQuery.data.pagination.page}
              pages={employeeQuery.data.pagination.pages}
              total={employeeQuery.data.pagination.total}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {selectedEmployee && (
        <EmployeeModal
          title="Edit employee"
          description={`Update ${selectedEmployee.name}'s employee record.`}
          onClose={() => setSelectedEmployee(null)}
        >
          <EmployeeForm
            mode="edit"
            employee={selectedEmployee}
            departments={departments}
            isPending={updateMutation.isPending}
            onSave={handleEditSave}
            onCancel={() => setSelectedEmployee(null)}
          />
        </EmployeeModal>
      )}
      {isAdding && (
        <EmployeeModal
          title="Add employee"
          description="Create a new record for a member of your team."
          onClose={() => setIsAdding(false)}
        >
          <EmployeeForm
            mode="add"
            departments={departments}
            isPending={createMutation.isPending}
            onSave={(input) => createMutation.mutate(input)}
            onCancel={() => setIsAdding(false)}
          />
        </EmployeeModal>
      )}

      {employeeToDelete && (
        <ConfirmDialog
          title="Delete employee?"
          description={`Are you sure you want to delete ${employeeToDelete.name}? This action cannot be undone.`}
          isPending={deleteMutation.isPending}
          onCancel={() => setEmployeeToDelete(null)}
          onConfirm={() => deleteMutation.mutate(employeeToDelete.id)}
        />
      )}
    </section>
  );
};

export default EmployeesPage;
