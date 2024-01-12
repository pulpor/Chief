import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
}

function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default PublicLayout;
