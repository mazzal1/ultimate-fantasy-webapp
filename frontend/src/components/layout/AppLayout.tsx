import type { ReactNode } from 'react';
import { tokens } from '../../design-system';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: tokens.colors.background, color: tokens.colors.text }}>
      <Navbar />
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 73px)' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: tokens.spacing.xl }}>{children}</main>
      </div>
    </div>
  );
}
