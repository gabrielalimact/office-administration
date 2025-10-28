'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { MdOutlineSpaceDashboard } from 'react-icons/md';

export interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: ReactNode;
}

interface BreadcrumbContextType {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  addBreadcrumb: (item: BreadcrumbItem) => void;
  clearBreadcrumbs: () => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { label: 'Início', path: '/home', icon: <MdOutlineSpaceDashboard size={16} /> },
  ]);

  const addBreadcrumb = (item: BreadcrumbItem) => {
    setBreadcrumbs((prev) => {
      const exists = prev.find((b) => b.path === item.path);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const clearBreadcrumbs = () => {
    setBreadcrumbs([{ label: 'Início', path: '/home' }]);
  };

  return (
    <BreadcrumbContext.Provider
      value={{
        breadcrumbs,
        setBreadcrumbs,
        addBreadcrumb,
        clearBreadcrumbs,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  return context;
}
