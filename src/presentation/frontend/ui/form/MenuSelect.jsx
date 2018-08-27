import React from 'react';
import Select from './Select';

function styles(baseStyles) {
  return {
    ...baseStyles,
    control: base => ({
      ...baseStyles.control(base),
      boxShadow: 'none',
      backgroundColor: 'var(--color-light-red)',
      border: '1px solid var(--color-red-10)',
      '&:hover': {borderColor: 'var(--color-red-10)'},
      borderBottom: 'none',
      outline: 'none'
    }),
    menu: base => ({
      ...baseStyles.menu(base),
      border: '1px solid var(--color-red-10)',
      borderTop: 'none'
    })
  };
}

function MenuSelect({...props}) {
  return <Select styles={styles} {...props}/>;
}

export default MenuSelect;
