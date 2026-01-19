import { forwardRef } from 'react';
import ReactSelect from 'react-select'
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const Select = forwardRef(({ options, onChange, value, isDisabled = true, isLoading = false, isMulti = false, placeholder = '', components, ...props}, ref) => {
    return (
        <ReactSelect
            ref={ref}
            noOptionsMessage={() => 'Ничего не найдено'}              
            onChange={onChange}
            classNamePrefix={'custom-select'}
            isMulti={isMulti}
            placeholder={placeholder}
            options={options}
            
            value={value}
            maxMenuHeight={280}
            components={
              components  
            }
            isDisabled={isDisabled}
            isLoading={isLoading}
            {...props}
        />
    )
});

export default Select;
