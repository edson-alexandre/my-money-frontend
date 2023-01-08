import { Td } from '@chakra-ui/react';

interface ICustomTdProps {
  children: any;
  style?: React.CSSProperties;
}

const CustomTd = (props: ICustomTdProps) => {
  return (
    <Td {...props} style={{ ...props.style }}>
      {props.children}
    </Td>
  );
};

export default CustomTd;
