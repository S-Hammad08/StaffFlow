import DashboardShell from "@/components/layout/DashboardShell";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return <DashboardShell>{children}</DashboardShell>;
};

export default DashboardLayout;
