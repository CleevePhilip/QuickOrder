import React from "react";

const Table = ({ children }) => {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table">{children}</table>
      </div>
    </>
  );
};

export default Table;
