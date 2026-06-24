import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("AuthContext.Provider is required.");

    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
