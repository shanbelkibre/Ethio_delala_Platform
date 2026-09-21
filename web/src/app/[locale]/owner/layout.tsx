import DashboardSidebar from '@/components/layout/DashboardSidebar';

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar role="OWNER" className="hidden lg:block" />
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-2 overflow-x-auto">
          <DashboardSidebar role="OWNER" className="flex flex-row space-y-0 space-x-2 border-r-0 p-0 min-h-0 w-auto" />
        </div>
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
