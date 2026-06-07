import './globals.css';
import Sidebar from '../components/Sidebar';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-plus-jakarta',
});

export const metadata = {
  title: 'TerraBook — Plateforme de Réservation de Terrains de Sport',
  description: 'Réservez votre terrain de Padel, Football ou Tennis en quelques secondes. Simple, rapide et premium.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${plusJakartaSans.variable}`}>
      <body className="bg-background text-charcoal font-sans min-h-screen">
        <div className="flex">
          {/* Left Sidebar Layout */}
          <div className="print-hide w-64 flex-shrink-0">
            <Sidebar />
          </div>

          {/* Main Content Workspace */}
          <main className="flex-grow min-h-screen ml-xs md:ml-0 p-lg w-full max-w-[1440px] mx-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
