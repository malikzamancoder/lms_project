import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router";
import { useUserRole } from "../context/UserRoleContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isLoaded, isSignedIn } = useUser();
  const { role, loadingRole } = useUserRole();

  if (!isLoaded || loadingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!role) {
    return <Navigate to="/onboarding" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={`/${role}`} replace />;
  }

  return children;
};

export default ProtectedRoute;