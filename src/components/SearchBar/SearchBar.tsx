import React, { ChangeEventHandler } from "react";
import { ISearchBarProps } from "../../interfaces";

function SearchBar({ onChange, inputValue }: ISearchBarProps) {
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
