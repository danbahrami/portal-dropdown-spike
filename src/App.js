import { useState } from "react";
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

  return (
    <div className="App">
      <SidePanel>
        <label htmlFor="colour">Pick a colour</label>
        <Dropdown
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
