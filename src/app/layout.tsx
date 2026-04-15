import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'Verbos by muxp',
  description: 'Un quiz interactivo para q te aprendas los verbos en inglés.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Unbounded:wght@800&display=swap" rel="stylesheet" />

        {/* Preload sounds */}
        <link rel="preload" href="/sounds/select.wav" as="audio" type="audio/wav" />
        <link rel="preload" href="/sounds/start.wav" as="audio" type="audio/wav" />
        <link rel="preload" href="/sounds/countdown.wav" as="audio" type="audio/wav" />
        <link rel="preload" href="/sounds/desafio.wav" as="audio" type="audio/wav" />
        <link rel="preload" href="/sounds/repaso.wav" as="audio" type="audio/wav" />
        <link rel="preload" href="/sounds/confirm.wav" as="audio" type="audio/wav" />
        <link rel="preload" href="/sounds/score_perfect.wav" as="audio" type="audio/wav" />
        <link rel="preload" href="/sounds/score_good.wav" as="audio" type="audio/wav" />
        <link rel="preload" href="/sounds/score_bad.wav" as="audio" type="audio/wav" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
