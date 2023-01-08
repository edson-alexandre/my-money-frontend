import { Box, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import IAutocompleteItem from '../../interfaces/IAutocompleteItem';
import { Input } from '../my-input/Input.styled';

interface ICustomSelectProps {
  isError?: boolean;
  errorMessage?: string;
  label: string;
  placeholder: string;
  items: IAutocompleteItem[];
  value: any;
  onChange?(item: number | string): void;
}

const MenuFilter = styled.input`
  background-color: transparent;
  width: 100%;
  height: 100%;
  padding: 5px;
  border-bottom: 1px solid gray;
  position: relative;
  padding-left: 30px;
  &:focus {
    outline: none;
    border-bottom: solid 2px #1867c0;
  }
`;

const FilterIcon = styled.div`
  position: absolute;
  top: 18px;
  left: 10px;
  z-index: 100;
`;

const AutoCompleteSingle = (props: ICustomSelectProps) => {
  const filterFocusRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState('');
  const [filteredItems, setFilteredItems] = useState<IAutocompleteItem[]>([]);

  useEffect(() => {
    setFilteredItems(
      props.items.filter(item => {
        return item?.text?.toUpperCase().includes(filter?.toUpperCase());
      }),
    );
    setTimeout(() => {
      filterFocusRef.current?.focus();
    }, 500);
  }, [filter, props.items]);
  return (
    <Menu matchWidth closeOnSelect={false} autoSelect={false} initialFocusRef={filterFocusRef}>
      {menu => {
        filterFocusRef.current?.focus();
        return (
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
              <Box padding={2} display="flex">
                <FilterIcon className="bi bi-search" />
                <MenuFilter
                  placeholder="Filtrar"
                  value={filter}
                  onChange={e => {
                    setFilter(e.target.value);
                  }}
                  autoFocus={true}
                  ref={filterFocusRef}
                />
              </Box>

              {filteredItems.map(item => (
                <MenuItem
                  key={item.value}
                  onClick={() => {
                    props.onChange?.(item.value);
                    setFilter('');
                    menu.onClose();
                  }}
                >
                  {item.text}
                </MenuItem>
              ))}
            </MenuList>
          </>
        );
      }}
    </Menu>
  );
};

export default AutoCompleteSingle;
