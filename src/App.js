import { useState, useRef, useCallback } from "react";
import { useDebounce } from "rooks";
import SidePanel from "./SidePanel";
import Dropdown from "./Dropdown";
import "./App.css";

const COLOURS = [
  "red",
  "green",
  "blue",
  "orange",
  "purple",
  "silver",
  "black",
  "white",
  "maroon",
  "violet",
  "indigo",
];

function App() {
  const [colour, setColour] = useState("green");
  const dropdownRef = useRef(null);

  const handleScroll = useCallback(() => {
    dropdownRef.current.close();
  }, []);

  const debouncedHandleScroll = useDebounce(handleScroll, 500, {
    leading: true,
    trailing: false,
  });

  return (
    <div className="App">
      <SidePanel onScroll={debouncedHandleScroll}>
        <label htmlFor="colour">Pick a colour</label>
        <Dropdown
          ref={dropdownRef}
          options={COLOURS}
          value={colour}
          id="colour"
          name="colour"
          onChange={setColour}
        />
      </SidePanel>
    </div>
  );
}

export default App;
