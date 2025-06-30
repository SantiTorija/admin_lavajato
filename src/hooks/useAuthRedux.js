import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  loginUser,
  logoutUser,
  verifyToken,
  clearError,
} from "../redux/authSlice";

export const useAuthRedux = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, token, loading, error } = useSelector(
    (state) => state.auth
  );

  const login = useCallback(
    (email, password) => dispatch(loginUser({ email, password })),
    [dispatch]
  );
  const logout = useCallback(() => dispatch(logoutUser()), [dispatch]);
  const verify = useCallback(() => dispatch(verifyToken()), [dispatch]);
  const clear = useCallback(() => dispatch(clearError()), [dispatch]);

  // Filtrar errores iniciales para no mostrar en UI
  const filteredError =
    error === "No hay token" || error === "Token inválido" ? null : error;

  return {
    isAuthenticated,
    user,
    token,
    loading,
    error: filteredError,
    login,
    logout,
    verifyToken: verify,
    clearError: clear,
  };
};
