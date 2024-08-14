import React from "react";

const Button = ({ buttonName, onClick, btnColor, btnSize }) => {
  return (
    <button onClick={onClick} className={`btn ${btnColor} ${btnSize}`}>
      {buttonName}
    </button>
  );
};

export default Button;
