import React from 'react';

const Button = ({ className, children, ...props}) => {
    const defaultClassName = 'btn'
    const classNames = className ? className + ` ${defaultClassName}` : defaultClassName

    return (
        <button className={classNames} {...props}>
            {children}
        </button>
    );
};

export default Button;
