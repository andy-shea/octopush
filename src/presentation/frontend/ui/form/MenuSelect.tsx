import React, {CSSProperties} from 'react';
import Select, {StylesProps} from './Select';

function styles(baseStyles: StylesProps) {
  return {
    ...baseStyles,
    multiValue: (base: CSSProperties) => ({
      ...base,
      backgroundColor: 'var(--color-white)',
      border: '1px solid #c2e0ff',
      color: '#08c'
    }),
    control: (base: CSSProperties) => ({
      ...baseStyles.control(base),
      boxShadow: 'none',
      backgroundColor: 'var(--color-light-red)',
      border: '1px solid var(--color-red-10)',
      '&:hover': {
        borderColor: 'var(--color-red-10)'
      },
      borderBottom: 'none',
      outline: 'none'
    }),
    menu: (base: CSSProperties) => ({
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
