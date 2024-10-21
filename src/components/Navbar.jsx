import React from 'react'

function Navbar(props) {
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-dark bg-gradient">
        <div className="container-fluid">
          <a className="navbar-brand text-white" href="/" >Code-Z</a>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" onClick={props.toggeleMode} role="switch" id="flexSwitchCheckDefault" />
            <label className="form-check-label text-light" htmlFor="flexSwitchCheckDefault">Light Mode</label>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar;
