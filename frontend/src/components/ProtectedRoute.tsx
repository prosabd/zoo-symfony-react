import { Navigate } from "react-router-dom";
import { verifyToken } from "@/utils/userInstance";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!verifyToken()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
