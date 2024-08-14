import React from "react";

const Content = ({ children }) => {
  return (
    <>
      <div className="w-full h-full p-6">{children}</div>
    </>
  );
};

export default Content;
