import { Box, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useState } from 'react';
import styled from 'styled-components';

interface IPaginationProps {
  current: number;
  total: number;
  defaultPerPage: number;
  getCurrentPage(current: number): void;
  getPerPage(perPage: number): void;
}

const Icon = styled.i`
  margin-left: 10px;
`;

const Start = styled.span`
  margin-left: 20px;
`;
const Text = styled.span`
  margin: 0px 10px 0px 10px;
`;
const End = styled.span``;
const Total = styled.span`
  margin-right: 20px;
`;

const Previos = styled.span`
  margin-right: 20px;
  cursor: pointer;
`;
const Next = styled.span`
  margin-right: 30px;
  margin-left: 20px;
  cursor: pointer;
`;

const CustomPagination = (props: IPaginationProps) => {
  const [perPage, setPerPage] = useState<number>(props.defaultPerPage);

  const increment = () => {
    const page = perPage * (props.current + 1) - perPage + 1 > props.total ? props.current : props.current + 1;
    props.getCurrentPage(page);
  };

  const decrement = () => {
    const page = props.current === 1 ? props.current : props.current - 1;
    props.getCurrentPage(page);
  };

  const perPageChanged = (perPageLocal: number) => {
    setPerPage(perPageLocal);
    props.getPerPage(perPageLocal);
    props.getCurrentPage(1);
  };

  const perPageOptions = [5, 10, 20, 9999];

  return (
    <Box display="flex" justifyContent="flex-end" marginTop={5} marginRight={5}>
      <Menu>
        {({ isOpen }) => (
          <>
            <span style={{ marginRight: 20 }}>Linhas por página</span>
            <MenuButton paddingLeft={5} paddingRight={5}>
              {perPage === 9999 ? 'Todas' : perPage} {<Icon className={`bi bi-caret-${isOpen ? 'up' : 'down'}-fill`} />}
            </MenuButton>
            <MenuList>
              {perPageOptions.map(option => (
                <MenuItem onClick={() => perPageChanged(option)} key={option}>
                  {option === 9999 ? 'Todas' : option}
                </MenuItem>
              ))}
            </MenuList>
          </>
        )}
      </Menu>
      <div>
        <Start>{perPage * props.current - perPage + 1}</Start>
        <Text>-</Text>
        <End>{perPage * props.current > props.total ? props.total : perPage * props.current}</End>
        <Text>de</Text>
        <Total>{props.total}</Total>
        <Previos>
          <i className="bi bi-chevron-left" onClick={() => decrement()} />
        </Previos>
        <Next>
          <i className="bi bi-chevron-right" onClick={() => increment()} />
        </Next>
      </div>
    </Box>
  );
};

export default CustomPagination;
