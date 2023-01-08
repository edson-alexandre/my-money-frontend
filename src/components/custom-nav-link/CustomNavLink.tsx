import { NavLink, NavLinkProps } from 'react-router-dom';
import './CustomNavLink.css';

const CustomNavLink = (props: NavLinkProps) => {
  return <NavLink {...props} className={({ isActive }) => `${isActive && 'item-menu-active'}`} />;
};

export default CustomNavLink;
