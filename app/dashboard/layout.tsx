type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="min-h-screen flex-1 bg-slate-100 p-8">
      {children}
    </main>
  );
};

export default DashboardLayout;