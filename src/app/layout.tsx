import '../styles/global.scss';
import AuthProvider from '@/components/auth/AuthProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang='en'>
      <head>
        <title>Abelohost</title>
        <link rel='icon' href='/favicon.png' />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
