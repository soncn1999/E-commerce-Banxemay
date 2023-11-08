import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { createSlug } from '../utils/helper';

Sidebar.propTypes = {

};

function Sidebar(props) {
    const [category] = useState(null);
    return (
        <div>
            {
                category?.map(item => {
                    <NavLink key={createSlug(item.title)}
                        to={createSlug(item.title)}
                        className={({ isActive }) => isActive ? 'active' : 'disable'}
                    >
                        {item.title}
                    </NavLink>
                })
            }
        </div>
    );
}

export default Sidebar;