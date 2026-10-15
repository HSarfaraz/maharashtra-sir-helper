import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIR Saathi | Maharashtra',
  description: 'A bilingual, privacy-first helper for organising SIR household visits and checklists.',
  applicationName: 'SIR Saathi'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
