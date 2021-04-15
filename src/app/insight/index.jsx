import React from 'react'
import ReactDOM from 'react-dom'
import 'style.scss'

const classes = {
  wrapper: 'App-wrapper',
  main: 'Main-wrapper',
  contentWrapper: 'Content-wrapper',
}

const App = () => {
  return (
    <React.StrictMode>
      <div className={classes.wrapper}>
        CHANGE ME da wdwd wd IN src/app/insight/index.jsx
      </div>
    </React.StrictMode>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
