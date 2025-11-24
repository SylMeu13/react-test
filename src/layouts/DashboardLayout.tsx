import { Outlet } from "react-router-dom";
import { getToken } from "../utils/token";
import { Slide, ToastContainer } from "react-toastify";
import Footer from "../components/Footer";
import "./Dashboard.css";

export default function DashboardLayout() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        newestOnTop
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
        transition={Slide}
      />
      <div className="sided-content">
        <aside>
          <Aside />
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
}

export function Aside() {
  return (
    <nav>
      <ul className="top">
        <li>
          <a
            href="/dashboard"
            className={location.pathname == "/dashboard" ? "active" : ""}
          >
            Accueil
          </a>
        </li>
        <li>
          <a
            href="/dashboard/promotion"
            className={
              location.pathname.startsWith("/dashboard/promotion")
                ? "active"
                : ""
            }
          >
            Promotion
          </a>
        </li>
      </ul>
      <ul className="bottom">
        <li>
          {getToken() ? (
            <a href="/logout">Déconnexion</a>
          ) : (
            <a href="/login">Connexion</a>
          )}
        </li>
      </ul>
    </nav>
  );
}
