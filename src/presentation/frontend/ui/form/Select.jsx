import React from 'react';
import BaseSelect from 'react-select';
import withHandlers from 'recompose/withHandlers';

const baseStyles = {
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
  multiValueLabel: base => ({...base, color: 'inherit'}),
  multiValueRemove: base => ({
    ...base,
    marginTop: '1px',
    '&:hover': {backgroundColor: 'transparent'}
  }),
  clearIndicator: base => ({...base, paddingRight: 0}),
  valueContainer: base => ({...base, padding: '10px 15px'}),
  indicatorSeparator: base => ({...base, backgroundColor: 'transparent'})
};

const enhance = withHandlers({
  onChange: ({onChange, updateValue, name, onSelect}) => value => {
    if (onChange) onChange(value);
    else {
      updateValue(name, value);
      if (onSelect) onSelect(value);
    }
  }
});

function Select({styles, ...props}) {
  return <BaseSelect styles={styles ? styles(baseStyles) : baseStyles} {...props}/>;
}

export default enhance(Select);
