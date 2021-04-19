import React from "react";
import ReactDOM from "react-dom";
import "./style.scss";

const classes = {
  wrapper: "App-wrapper",
  main: "Main-wrapper",
  contentWrapper: "Content-wrapper",
};

const App = () => {
  return (
    <React.StrictMode>
      <div className={classes.wrapper}>CHANGE per ME IN src/app/index.jsx</div>
    </React.StrictMode>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
