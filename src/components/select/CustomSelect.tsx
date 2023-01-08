import { Box, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { Input } from '../my-input/Input.styled';

interface IItem {
  value: number | string;
  text: string;
}

interface ICustomSelectProps {
  label: string;
  placeholder: string;
  items: IItem[];
  value: any;
  isError?: boolean;
  errorMessage?: string;
  onChange?(item: number | string): void;
}

const CustomSelect = (props: ICustomSelectProps) => {
  return (
    <Menu matchWidth>
      {menu => (
        <>
          <MenuButton as={Box} style={{ cursor: 'pointer', padding: '0px' }}>
            <Input
              p={5}
              label={props.label}
              placeholder={props.placeholder}
              rightIcon={<i className={`bi bi-caret-${menu.isOpen ? 'up' : 'down'}-fill`} />}
              value={`${props.items.find(i => i.value === props.value)?.text || ''}`}
              readonly
              isError={props.isError}
              errorMessage={props.errorMessage}
            />
          </MenuButton>
          <MenuList>
            {props.items.map(item => (
              <MenuItem key={item.value} onClick={() => props.onChange?.(item.value)}>
                {item.text}
              </MenuItem>
            ))}
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export default CustomSelect;
