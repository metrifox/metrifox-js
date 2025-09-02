import '../../styles/components.css';

export const FormGroup = ({ children, className = '' }) => (
    <div className={`form-group ${className}`}>{children}</div>
);

export const FormRow = ({ children, className = '' }) => (
    <div className={`form-row ${className}`}>{children}</div>
);

export const FormInput = ({
                              label,
                              id,
                              type = 'text',
                              value,
                              onChange,
                              placeholder,
                              required = false,
                              disabled = false,
                              help,
                              ...props
                          }) => (
    <FormGroup>
        <label htmlFor={id}>{label} {required && '*'}</label>
        <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className="form-input"
            {...props}
        />
        {help && <small className="form-help">{help}</small>}
    </FormGroup>
);

export const FormSelect = ({
                               label,
                               id,
                               value,
                               onChange,
                               options,
                               required = false,
                               disabled = false,
                               help,
                               ...props
                           }) => (
    <FormGroup>
        <label htmlFor={id}>{label} {required && '*'}</label>
        <select
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className="form-select"
            {...props}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        {help && <small className="form-help">{help}</small>}
    </FormGroup>
);

export default { FormGroup, FormRow, FormInput, FormSelect };