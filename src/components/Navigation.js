import React from 'react';
import PropTypes from 'prop-types';
import { navigation } from '../utils';
import { NavLink } from 'react-router-dom';

Navigation.propTypes = {

};

function Navigation(props) {
    return (
        <div>
            {
                navigation.map(item => (
                    <NavLink to={item.path} key={item.id}>item.value</NavLink>
                ))
            }
        </div>
    );
}

export default Navigation;