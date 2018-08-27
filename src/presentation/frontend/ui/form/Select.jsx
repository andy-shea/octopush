import React from 'react';
import BaseSelect from 'react-select';

const baseStyles = {
  input: base => ({...base, padding: '10px 0'}),
  control: base => ({
    ...base,
    borderRadius: 0,
    border: 'none',
    fontSize: '1.1em'
  }),
  menu: base => ({
    ...base,
    borderRadius: 0,
    border: 'none',
    marginBottom: 0,
    marginTop: 0,
    boxShadow: '0 -1px 0 0 hsla(0, 0%, 0%, 0.1)'
  }),
  multiValue: base => ({
    ...base,
    backgroundColor: 'var(--color-white)',
    border: '1px solid #c2e0ff',
    color: '#08c'
  }),
  multiValueLabel: base => ({...base, color: 'inherit'}),
  multiValueRemove: base => ({
    ...base,
    marginTop: '1px',
    '&:hover': {backgroundColor: 'transparent'}
  }),
  clearIndicator: base => ({...base, paddingRight: 0}),
  valueContainer: base => ({...base, padding: '1px 15px'}),
  indicatorSeparator: base => ({...base, backgroundColor: 'transparent'})
};


function Select({styles, ...props}) {
  return <BaseSelect styles={styles ? styles(baseStyles) : baseStyles} {...props}/>;
}

export default Select;
