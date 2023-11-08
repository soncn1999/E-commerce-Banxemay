import React from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';

Public.propTypes = {

};

function Public(props) {
    return (
        <div>
            <Outlet />
        </div>
    );
}

export default Public;