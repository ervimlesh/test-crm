import { useEffect, useState } from "react";
import Spinner from "./Spinner.jsx";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/Auth.jsx";

export default function SuperAdminRoute() {
  const [ok, setOk] = useState(false);
  const {auth, setAuth} = useAuth();
  useEffect(() => {
    const authCheck = async () => {
      const res = await axios.get("/api/v1/auth/superadmin-dashboard");
      if (res.data.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner />;
}
