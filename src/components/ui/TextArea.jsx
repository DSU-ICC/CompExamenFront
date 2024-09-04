const TextArea = ({ className, ...props}) => {
    const defaultClassName = 'textarea'
    const classNames = className ? className + ` ${defaultClassName}` : defaultClassName

    return (
        <textarea className={classNames} {...props} /> 
    );
};

export default TextArea;
