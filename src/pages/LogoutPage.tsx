import { Navigate } from "react-router-dom";
import { clearToken } from "../utils/token";

export default function HomePage() {
  clearToken();
  return <Navigate to="/" />;
}
