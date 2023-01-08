import { Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useState } from 'react';
import styled from 'styled-components';
import ICustomHead from '../../interfaces/ICustomHead';
import { IOrderData } from '../../interfaces/IOrderData';
import CustomTr from './CustomTr';

interface ICustomTableProps {
  heads: ICustomHead[];
  getOrder(order: IOrderData): void;
  children?: any;
  initialOrder: IOrderData;
  isEmpty?: boolean;
  style?: React.CSSProperties;
}

const Div = styled.div`
  overflow: auto;
  width: 100%;
  height: 100%;
`;

const CustomTable = (props: ICustomTableProps) => {
  const [orderData, setOrderData] = useState<IOrderData>({ ...props.initialOrder });

  const getOrderIcon = (name: string) => {
    return (
      <i
        style={{ marginLeft: '10px' }}
        className={`bi bi-arrow-${name === orderData.field && orderData.order === 'ASC' ? 'down' : 'up'}-short`}
      ></i>
    );
  };

  const setOrder = (head: ICustomHead): void => {
    setOrderData(state => {
      const order = {
        field: head.field,
        order: state.order === 'ASC' ? 'DESC' : 'ASC',
      };
      props.getOrder({ ...order });
      return order;
    });
  };

  return (
    <Div>
      <Table size="sm">
        <Thead>
          <CustomTr>
            {props.heads.map(head => (
              <Th
                key={head.field}
                style={{ whiteSpace: 'nowrap', ...(head.orderAble && { cursor: 'pointer' }) }}
                onClick={() => head.orderAble && setOrder(head)}
              >
                {head.label} {head.orderAble && getOrderIcon(head.field)}
              </Th>
            ))}
          </CustomTr>
          {props.isEmpty && (
            <CustomTr>
              <td colSpan={props.heads.length}>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    fontSize: '1.2em',
                  }}
                >
                  <i className="bi bi-search" />
                  <span style={{ marginLeft: '20px' }}>Não há conteúdo para listar</span>
                </div>
              </td>
            </CustomTr>
          )}
        </Thead>
        <Tbody>{props.children}</Tbody>
      </Table>
    </Div>
  );
};

export default CustomTable;
