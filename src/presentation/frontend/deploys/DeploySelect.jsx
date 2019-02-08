import React from 'react';
import Select from '../ui/form/Select';

function styles({name}) {
  return baseStyles => {
    return {
      ...baseStyles,
      container: base => ({
        ...base,
        ...(name === 'branch' && {
          width: 200,
          marginRight: '1em'
        }),
        ...(name === 'targets' && {
          width: 460,
          marginLeft: '1em',
          marginRight: '1em'
        })
      }),
      control: base => ({
        ...baseStyles.control(base),
        backgroundColor: 'var(--color-white)',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)',
        fontWeight: 700,
        lineHeight: name === 'stack' ? '28px' : '23px',
        transform: 'translateY(-1px)',
        ...((name === 'branch' || name === 'targets') && {
          fontSize: '1em'
        })
      }),
      option: (base, {isSelected, isFocused}) => ({
        ...base,
        backgroundColor: isSelected // eslint-disable-line no-nested-ternary
          ? 'var(--color-red-highlight)'
          : isFocused
            ? '#DEEBFF'
            : 'transparent'
      }),
      multiValue: base => ({
        ...base,
        backgroundColor: '#ebf5ff',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)',
        color: '#08c',
        borderRadius: 0,
        margin: '2px 3px'
      }),
      multiValueLabel: base => ({
        ...baseStyles.multiValueLabel(base),
        padding: 0
      }),
      placeholder: base => ({
        ...base,
        ...(name === 'stack' && {
          color: 'var(--color-blue-20)'
        }),
        ...((name === 'branch' || name === 'targets') && {
          color: 'var(--color-grey-15)'
        })
      }),
      menu: base => ({
        ...baseStyles.menu(base),
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1), 0 -1px 0 0 hsla(0, 0%, 0%, 0.1)',
        marginTop: '-1px'
      })
    };
  };
}

function DeploySelect({...props}) {
  return <Select styles={styles(props)} {...props} />;
}

export default DeploySelect;
