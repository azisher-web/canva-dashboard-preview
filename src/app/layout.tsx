import type { Metadata } from 'next';
import Sidebar from '@/components/Sidebar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Canva Blue Ocean Dashboard',
  description: 'Template niche analysis & blue ocean finder',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Sidebar />
        <div className="app-main-wrapper">
          <main className="app-main">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
