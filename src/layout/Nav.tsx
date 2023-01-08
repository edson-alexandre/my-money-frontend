import { Box } from '@chakra-ui/react';
import { useState } from 'react';
import './Nav.css';
import { Collapse } from 'react-bootstrap';
import CustomNavLink from '../components/custom-nav-link/CustomNavLink';

const Nav = () => {
  const [toggleRegistration, setToggleRegistration] = useState(false);
  const [toggleMovements, setToggleMovements] = useState(false);

  return (
    <Box
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#555',
        padding: '01px 20px 20px 20px',
      }}
    >
      <div onClick={() => setToggleRegistration(!toggleRegistration)} className="main-menu">
        Cadastro
        <i className={`bi bi-chevron-${toggleRegistration ? 'up' : 'down'}`}></i>
      </div>
      <Collapse in={toggleRegistration}>
        <div>
          <div className="item-menu">
            <CustomNavLink to={'/account'}>Plano de Contas </CustomNavLink>
          </div>
          <div className="item-menu">
            <CustomNavLink to={'/customer'}>Clientes</CustomNavLink>
          </div>
          <div className="item-menu">
            <CustomNavLink to={'/supplier'}>Fornecedores</CustomNavLink>
          </div>
        </div>
      </Collapse>
      <div onClick={() => setToggleMovements(!toggleMovements)} className="main-menu">
        Movimentos
        <i className={`bi bi-chevron-${toggleMovements ? 'up' : 'down'}`}></i>
      </div>
      <Collapse in={toggleMovements}>
        <div>
          <div className="item-menu">
            <CustomNavLink to={'/accounts-payable'}>Contas a Pagar</CustomNavLink>
          </div>
          <div className="item-menu">
            <CustomNavLink to={'/accounts-receivable'}>Contas a Receber</CustomNavLink>
          </div>
        </div>
      </Collapse>
    </Box>
  );
};

export default Nav;
