"use client";
 
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
 
export default function home() {
  const [token, setToken] = useState("");
  const router = useRouter();
  useEffect(() => {
    const jwtToken = localStorage.getItem("token");
    if (jwtToken) {
      setToken(jwtToken);
    } else {
      router.push("/login");
    }
  }, []);
  const getUserName = () => {
    try {
      const decoded: {
        id: string;
        name: string;
      } = jwtDecode(token);
      return decoded.name;
    } catch {
      alert("invalid token.. please login again");
      router.push("/login");
    }
  };
  let userName: string | undefined = "";
  if (token) {
    userName = getUserName();
  }
  return <>{userName ? <h1> Hi {userName}</h1> : <></>}</>;
}