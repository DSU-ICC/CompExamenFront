import { forwardRef } from "react";

const Input = forwardRef(({ className, ...props}, ref) => {
    const defaultClassName = 'input'
    const classNames = className ? className + ` ${defaultClassName}` : defaultClassName

    return (
        <input className={classNames} ref={ref} {...props}/>
    );
});

export default Input;
