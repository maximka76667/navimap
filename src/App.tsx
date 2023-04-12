import { useState } from "react";
import "./App.sass";
import { Map, SearchBar, Sidebar } from "./components";

function App() {
  const [searchValue, setSearchValue] = useState("");

  function handleSearchBarChange(inputValue: string) {
    setSearchValue(inputValue);
  }

  return (
    <div className="app">
      <h1>Navimap</h1>

      <SearchBar inputValue={searchValue} onChange={handleSearchBarChange} />
      <Sidebar />
      <div className="map__container">
        <Map />
      </div>
    </div>
  );
}

export default App;
