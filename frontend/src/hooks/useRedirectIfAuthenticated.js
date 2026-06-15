import { useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const useRedirectIfAuthenticated = (redirectTo = "/") => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, loading, navigate, redirectTo]);

  return { isLoading: loading, isAuthenticated: !!user };
};

export default useRedirectIfAuthenticated;