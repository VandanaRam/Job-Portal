import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideNav from "../components/TempSideNav";
import Footer from "../components/Footer";

function DashboardLayout() {
  return (
    <div>
      <Header />

      <div style={{ display: "flex" }}>
        <SideNav />

        <main style={{ padding: "20px", flex: 1 }}>
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default DashboardLayout;