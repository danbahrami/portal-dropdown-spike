import { useState, useRef, useCallback } from "react";
import { useDebounce } from "rooks";
import SidePanel from "./SidePanel";
import Dropdown from "./Dropdown";
import { COLOURS, LETTERS } from "./constants";
import "./App.css";

function App() {
  const [colour, setColour] = useState("chocolate");
  const [letter, setLetter] = useState(LETTERS[0]);
  const colourDropdownRef = useRef(null);
  const letterDropdownRef = useRef(null);

  const handleScroll = useCallback(() => {
    colourDropdownRef.current.close();
    letterDropdownRef.current.close();
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
          ref={colourDropdownRef}
          options={COLOURS}
          value={colour}
          id="colour"
          name="colour"
          onChange={setColour}
        />

        <label htmlFor="letter">Pick a letter</label>
        <Dropdown
          ref={letterDropdownRef}
          options={LETTERS}
          value={letter}
          id="letter"
          name="letter"
          onChange={setLetter}
        />
      </SidePanel>
      <div className="App__result">
        <div className="App__result__letter" style={{ color: colour }}>
          {letter}
        </div>
      </div>
    </div>
  );
}

export default App;
