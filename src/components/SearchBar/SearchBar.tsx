import React, { ChangeEventHandler } from "react";
import SearchBarProps from "./SearchBarProps";

function SearchBar({ onChange, inputValue }: SearchBarProps) {
  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search your route"
        value={inputValue}
        onChange={handleInputChange}
      />
    </div>
  );
}

export default SearchBar;
