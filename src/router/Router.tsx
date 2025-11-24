import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import LogoutPage from "../pages/LogoutPage";
import PrivateRoutes from "./middleswares/PrivateRoutes";
import DashboardLayout from "../layouts/DashboardLayout";
import DefaultLayout from "../layouts/DefaultLayout";
import PromotionsPage from "../pages/PromotionsPage";
import PromotionPage from "../pages/PromotionPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" index element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<PromotionsPage />}></Route>
            <Route path="promotion/:id?" element={<PromotionPage />}></Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
