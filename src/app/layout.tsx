import '../styles/global.scss';

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
          {children}
      </body>
    </html>
  );
}
