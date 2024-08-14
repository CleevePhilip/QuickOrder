import React, { useContext, useState, useEffect, useRef } from "react";
import TextInput from "../components/TextInput";
import AuthContext from "../context/AuthContext";
import Alert from "../components/Alert";

const LoginAuthentication = () => {
  const { login, error, attemptCount, countdown } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      if (username === "" && password === "") {
        alert("Username and password is empty ! Try again.");
        return;
      }
      await login(username, password);
    } catch (error) {
      console.log(error);
    }
  };

  const [disableLogin, setDisableLogin] = useState(attemptCount >= 3);

  useEffect(() => {
    if (attemptCount >= 3) {
      setDisableLogin(true);
    } else {
      setDisableLogin(false);
    }
  }, [attemptCount]);

  useEffect(() => {
    if (countdown === 0) {
      setDisableLogin(false);
    }
  }, [countdown]);

  return (
    <div className="flex flex-screen justify-center items-center min-h-screen bg-[#CEC3B1]">
      <div className="flex flex-col justify-center items-center md:gap-3 bg-white p-5 h-[15rem] w-full m-5 rounded shadow-md md:h-[30rem] md:m-10 lg:w-[30rem]">
        <h1 className="m-5 font-bold text-xl md:text-3xl md:m-10">
          LOGIN ACCOUNT
        </h1>
        <TextInput
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
        />
        <TextInput
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn btn-active btn-neutral w-full"
          onClick={handleSubmit}
          disabled={disableLogin}
        >
          Login
        </button>
        {error && (
          <Alert>
            <span>{error}</span>
          </Alert>
        )}
        {disableLogin && countdown > 0 && (
          <Alert>
            <span>Wait for {countdown} seconds</span>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default LoginAuthentication;
