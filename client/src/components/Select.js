import React from "react";

const Select = ({ children, value, onChange, className }) => {
  return (
    <>
      <select className={className} value={value} onChange={onChange}>
        {children}
      </select>
    </>
  );
};

export default Select;
