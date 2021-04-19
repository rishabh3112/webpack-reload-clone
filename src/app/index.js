import React from "react";
import ReactDOM from "react-dom";
import './style.css'

const classes = {
  app: "App-wrapper",
};

const App = () => {
  return (
    <div className={classes.app}>
      <h2>CHANGE ME</h2>
      <span>src/index.js (line 20)</span>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
