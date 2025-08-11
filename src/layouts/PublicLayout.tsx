import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

const PublicLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      <Navbar showFullNav={!isAuthPage} />
      <Outlet />
      <Footer />
    </>
  );
};

export default PublicLayout;
