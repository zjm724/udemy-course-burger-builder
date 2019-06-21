import React from 'react';
import classes from './Logo.css';
import BurgerLogo from '../../assets/Images/burger-logo.png';

const Logo = (props) => (
    <div className={classes.Logo}>
        <img src={BurgerLogo} alt="MyBurger" />
    </div>
);

export default Logo;