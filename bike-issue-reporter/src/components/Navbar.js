import React from 'react';
import { NavLink } from 'react-router-dom';


const Navbar = () => {
    return (
            <nav>
                <div className="nav-wrapper navbar">
                    <ul className="right">
                        <li><NavLink to='/'>Home</NavLink></li>
                        <li><NavLink to='/map'>Map</NavLink></li>
                    </ul>
                </div>
            </nav>
    )
}

export default Navbar;