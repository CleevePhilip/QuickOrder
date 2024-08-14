import React from "react";

const TextInput = ({
  placeholder,
  value,
  type,
  onChange,
  defaultValue,
  name,
}) => {
  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        className="input input-bordered input-black w-full "
        name={name}
        value={value}
        onChange={onChange}
        defaultValue={defaultValue}
      />{" "}
    </>
  );
};

export default TextInput;
