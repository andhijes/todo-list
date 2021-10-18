import React from 'react';

const Button = (props) => {
    const { 
        title = '', 
        func = '',
        type = 'submit', 
        color = 'yellow',
        classStyle = ''
    } = props;

    let buttonColor = '';
    switch (color) {
        case 'green':
            buttonColor = 'green-label';
            break;
        case 'red':
            buttonColor = 'red-label';
            break;
        default:
            break;
    }

    const buttonClick = () => {
        return (
            <button type={type} className={`${classStyle} ${buttonColor}`} onClick={func}>
                <span> {title}</span>
            </button>
        );
    };

    const buttonReg = () => {
        return (
            <button type={type} className={`${classStyle} ${buttonColor}`}>
                <span> {title}</span>
            </button>
        );
    };

    return (
        <>
            {func ? buttonClick() : buttonReg()}
        </>
    );
};

export default Button;
