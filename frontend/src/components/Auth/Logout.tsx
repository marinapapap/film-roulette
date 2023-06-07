import React from "react";
import "../../App.css";

interface LogoutProps {
  navigate: Function;
  inSession: boolean;
  setInSession: Function;
}

export const Logout: React.FC<LogoutProps> = ({
  navigate,
  inSession,
  setInSession,
}) => {
  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      await fetch("/tokens/logout");

      setInSession(false);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const redirectToLogin = () => {
    navigate("/login");
  };

  if (inSession) {
    return (
      <div className="auth-button">
        <button type="submit" onClick={handleSubmit} data-cy="logout-button">
          Logout
        </button>
      </div>
    );
  } else {
    return (
      <div className="auth-button">
        <button type="submit" onClick={redirectToLogin} data-cy="login-button">
          Login
        </button>
      </div>
    );
  }
};
