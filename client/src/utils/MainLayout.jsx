import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>

      {/* ✅ Show footer ONLY on home */}
      {location.pathname === "/" && <Footer />}
    </>
  );
};

export default MainLayout;