import Modal from "@/components/ui/Modal";

type EmployeeModalProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose: () => void;
};

const EmployeeModal = ({
  title,
  description,
  children,
  onClose,
}: EmployeeModalProps) => {
  return (
    <Modal title={title} description={description} onClose={onClose} maxWidth="lg">
      {children}
    </Modal>
  );
};

export default EmployeeModal;
