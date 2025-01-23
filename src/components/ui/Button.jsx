import React, { forwardRef } from 'react';

const Button = forwardRef(({ className, children, ...props}, ref) => {
    const defaultClassName = 'btn'
    const classNames = className ? className + ` ${defaultClassName}` : defaultClassName

    return (
        <button ref={ref} className={classNames} {...props}>
            {children}
        </button>
    );
});

export default Button;
