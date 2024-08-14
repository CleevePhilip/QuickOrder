import React, { createContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("isLoggedIn")
  );

  const [attemptCount, setAttemptCount] = useState(
    parseInt(localStorage.getItem("attemptCount")) || 0
  );

  const [countdown, setCountdown] = useState(0);
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const handleLoginAttempt = () => {
    const newCount = attemptCount + 1;
    localStorage.setItem("attemptCount", newCount);
    setAttemptCount(newCount);

    if (newCount >= 3) {
      setCountdown(10);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            localStorage.removeItem("attemptCount");
            setAttemptCount(0);

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        { username, password },
        { withCredentials: true }
      );
      if (response.data.success) {
        setIsLoggedIn(true);
        setProfile(response.data.user);

        localStorage.setItem("isLoggedIn", "true");
        navigate(response.data.redirectUrl);
      } else {
        handleLoginAttempt();
        setError(response.data.message);
      }
    } catch (error) {
      handleLoginAttempt();
      setError(error.response?.data?.message || error.message);
    }
  };

  const logout = async () => {
    try {
      if (window.confirm("Are you sure you want to logout?")) {
        const response = await axios.post("http://localhost:8080/auth/logout");
        if (response.data.success) {
          setIsLoggedIn(false);
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("profile");
          setProfile({});
          navigate(response.data.redirectUrl);
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://localhost:8080/auth/profile");
      if (response.data.success) {
        setProfile(response.data.user);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isLoggedIn,
        error,
        profile,
        attemptCount,
        countdown,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
