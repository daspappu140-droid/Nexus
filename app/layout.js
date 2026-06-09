import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'NexusBank - Next Generation Digital Banking Platform',
  description: 'India\'s most advanced digital banking platform. Virtual cards, instant settlements, corporate solutions, and enterprise-grade security.',
  keywords: 'digital banking, virtual cards, settlements, corporate banking, fintech',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f172a',
              color: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              padding: '14px 20px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#f8fafc' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#f8fafc' },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
