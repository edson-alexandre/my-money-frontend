import { Box } from '@chakra-ui/react';
import { useState } from 'react';
import './Nav.css';
import { Collapse } from 'react-bootstrap';

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
          <div className="item-menu">Clientes</div>
          <div className="item-menu">Fornecedores</div>
        </div>
      </Collapse>
      <div onClick={() => setToggleMovements(!toggleMovements)} className="main-menu">
        Movimentos
        <i className={`bi bi-chevron-${toggleMovements ? 'up' : 'down'}`}></i>
      </div>
      <Collapse in={toggleMovements}>
        <div>
          <div className="item-menu">Contas a Pagar</div>
          <div className="item-menu">Contas a Receber</div>
        </div>
      </Collapse>
    </Box>
  );
};

export default Nav;
