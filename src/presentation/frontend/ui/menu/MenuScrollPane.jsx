import React, {PropTypes} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';

function MenuScrollPane({children, width = 530}) {
  return (
    <Scrollbars style={{width, height: 'calc(100% - 106px)'}}>
      {children}
    </Scrollbars>
  );
}

MenuScrollPane.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.number
};

export default MenuScrollPane;
