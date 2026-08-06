type EmployeeModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};

const EmployeeModal = ({ children, onClose }: EmployeeModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg px-3 py-1 text-xl text-slate-500 hover:bg-slate-100"
          aria-label="Close modal"
        >
          ×
        </button>

        {children}
      </div>
    </div>
  );
};

export default EmployeeModal;
