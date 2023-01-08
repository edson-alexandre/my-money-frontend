import { Tr, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import './CustomTr.css';

interface ICustomTrProps {
  children?: any;
  hoverAble?: boolean;
  style?: React.CSSProperties;
}

const CustomTr = (props: ICustomTrProps) => {
  const colorMode = useColorModeValue('light', 'dark');
  const [backgrounColorClass, setBackgroundColorClass] = useState('');

  useEffect(() => {
    setBackgroundColorClass(colorMode === 'dark' ? 'dark-custom-tr' : 'light-custom-tr');
  }, [colorMode]);

  return (
    <Tr style={{ ...props.style }} className={`${props.hoverAble && backgrounColorClass}`}>
      {props.children}
    </Tr>
  );
};

export default CustomTr;
