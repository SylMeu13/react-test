import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../../utils/token";

export default function PrivateRoutes() {
  return getToken() != null ? <Outlet /> : <Navigate to="/login" />;
}
