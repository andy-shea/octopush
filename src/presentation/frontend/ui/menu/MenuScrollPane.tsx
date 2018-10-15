import React, {ReactNode, SFC} from 'react';
import Scrollbars from 'react-custom-scrollbars';

interface MenuScrollPaneProps {
  children: ReactNode;
  width?: number;
}

const MenuScrollPane: SFC<MenuScrollPaneProps> = ({children, width = 530}) => {
  return (
    <Scrollbars style={{width, height: 'calc(100% - 106px)'}}>
      {children}
    </Scrollbars>
  );
};

export default MenuScrollPane;
