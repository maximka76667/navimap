import { useState } from "react";
import "./App.sass";
import { Map, SearchBar } from "./components";

function App() {
  const [searchValue, setSearchValue] = useState("");
  const [isMapFullScreen, setIsMapFullScreen] = useState(false);

  function handleSearchBarChange(inputValue: string) {
    setSearchValue(inputValue);
  }

  function handleFullScreenChange() {
    setIsMapFullScreen((isMapFullScreen) => !isMapFullScreen);
  }

  return (
    <div className="app">
      <h1>Navimap</h1>

      <SearchBar inputValue={searchValue} onChange={handleSearchBarChange} />
      <div
        className={`map__container ${isMapFullScreen ? "map__container_fullscreen" : ""
          }`}
      >
        <Map />
      </div>
    </div>
  );
}

export default App;
