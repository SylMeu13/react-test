import { Navigate } from "react-router-dom";
import { getToken } from "../utils/token";

export default function HomePage() {
  return getToken() != null ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
}
