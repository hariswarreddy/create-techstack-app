import './globals.css';

export const metadata = {
  title: '{{projectName}}',
  description: 'Generated with create-fullstack-app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
