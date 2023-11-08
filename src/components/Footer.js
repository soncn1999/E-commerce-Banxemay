import React from 'react';
import PropTypes from 'prop-types';
import './Content-style/style.css';

Footer.propTypes = {

};

function Footer(props) {
    return (
        <footer class="py-5 bg-dark">
            <div class="container"><p class="m-0 text-center text-white">Copyright &copy; Your Website 2023</p></div>
        </footer>
    );
}

export default Footer;