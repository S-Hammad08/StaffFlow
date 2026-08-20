"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import LoadingState from "@/components/ui/LoadingState";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";
import { getApiErrorMessage } from "@/lib/api";
import { employeeKeys } from "../employees/services/employee.service";
import DepartmentForm from "./components/DepartmentForm";
import DepartmentTable from "./components/DepartmentTable";
import {
  createDepartment,
  deleteDepartment,
  departmentKeys,
  getDepartments,
  updateDepartment,
} from "./services/department.service";
import type { Department, DepartmentInput } from "./types/department.types";

export default function DepartmentPage() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
  const departmentQuery = useQuery({
    queryKey: departmentKeys.list(),
    queryFn: getDepartments,
  });

  const invalidateDepartmentData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: departmentKeys.all }),
      queryClient.invalidateQueries({ queryKey: employeeKeys.all }),
      queryClient.invalidateQueries({ queryKey: ["reports"] }),
    ]);
  };

  const createMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: async () => {
      setIsAdding(false);
      toast.success("Department added successfully.");
      await invalidateDepartmentData();
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Unable to add department.")),
  });
  const updateMutation = useMutation({
    mutationFn: updateDepartment,
    onSuccess: async () => {
      setSelectedDepartment(null);
      toast.success("Department updated successfully.");
      await invalidateDepartmentData();
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Unable to update department.")),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: async () => {
      setDepartmentToDelete(null);
      toast.success("Department deleted successfully.");
      await invalidateDepartmentData();
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Unable to delete department.")),
  });

  const handleEditSave = (input: DepartmentInput) => {
    if (selectedDepartment) updateMutation.mutate({ id: selectedDepartment.id, input });
  };

  return (
    <section>
      <PageHeader
        title="Departments"
        description="Organize teams and see where every employee belongs."
        action={
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" aria-hidden="true" /> Add department
          </button>
        }
      />

      <div className="mt-7">
        {departmentQuery.isPending ? (
          <LoadingState message="Loading departments…" />
        ) : departmentQuery.isError ? (
          <ErrorState
            message={getApiErrorMessage(departmentQuery.error, "Unable to load departments.")}
            onRetry={() => departmentQuery.refetch()}
          />
        ) : departmentQuery.data.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No departments yet"
            description="Create your first department before adding employees."
            actionLabel="Add first department"
            onAction={() => setIsAdding(true)}
          />
        ) : (
          <>
            <DepartmentTable
              departments={departmentQuery.data}
              onEdit={setSelectedDepartment}
              onDelete={setDepartmentToDelete}
            />
            <p className="mt-3 text-xs text-slate-500">
              Departments with employees cannot be deleted until those employees are moved or removed.
            </p>
          </>
        )}
      </div>

      {isAdding && (
        <Modal title="Add department" description="Create a team employees can be assigned to." onClose={() => setIsAdding(false)}>
          <DepartmentForm
            mode="add"
            isPending={createMutation.isPending}
            onSave={(input) => createMutation.mutate(input)}
            onCancel={() => setIsAdding(false)}
          />
        </Modal>
      )}

      {selectedDepartment && (
        <Modal title="Edit department" description={`Update ${selectedDepartment.name}.`} onClose={() => setSelectedDepartment(null)}>
          <DepartmentForm
            mode="edit"
            department={selectedDepartment}
            isPending={updateMutation.isPending}
            onSave={handleEditSave}
            onCancel={() => setSelectedDepartment(null)}
          />
        </Modal>
      )}

      {departmentToDelete && (
        <ConfirmDialog
          title="Delete department?"
          description={`Are you sure you want to delete ${departmentToDelete.name}? This action cannot be undone.`}
          isPending={deleteMutation.isPending}
          onCancel={() => setDepartmentToDelete(null)}
          onConfirm={() => deleteMutation.mutate(departmentToDelete.id)}
        />
      )}
    </section>
  );
}
