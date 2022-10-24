import React, {useState, useEffect} from "react";
import Homepage from "./Homepage.js"

function App() {
    const [display, setDisplay] = useState() 
    useEffect(() => {
        setDisplay(<Homepage setDisplay={setDisplay}/>)
    }, [])
  return (
      <div>
        {display}
      </div>
  );
}

export default App;
