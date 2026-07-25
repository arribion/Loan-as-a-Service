import { useContext } from "react";
import Ctx from "../context/AuthContext";

const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export default useAuth