import React, {CSSProperties, SFC} from 'react';
import BaseSelect from 'react-select';
import {withHandlers} from 'recompose';

type styleFn = (base: CSSProperties, state?: any) => CSSProperties;

interface SelectProps {
  name: string;
  styles?: (styles: object) => object;
  onSelect?: (value: any) => void;
  onChange?: (value: any) => void; // TODO: should be one of property
  updateValue?: (name: string, value: any) => void; // TODO: should be one of property
}

export interface StylesProps {
  control: styleFn;
  menu: styleFn;
  multiValueLabel: styleFn;
  multiValueRemove: styleFn;
  clearIndicator: styleFn;
  valueContainer: styleFn;
  indicatorSeparator: styleFn;
}

const baseStyles: StylesProps = {
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

const enhance = withHandlers<SelectProps, {}>({
  onChange: ({onChange, updateValue, name, onSelect}) => (value: any) => {
    if (onChange) onChange(value);
    else {
      if (updateValue) updateValue(name, value); // TODO: if not required if one of property
      if (onSelect) onSelect(value);
    }
  }
});

const Select: SFC<SelectProps> = ({styles, ...props}) => {
  return <BaseSelect styles={styles ? styles(baseStyles) : baseStyles} {...props}/>;
};

export default enhance(Select);
