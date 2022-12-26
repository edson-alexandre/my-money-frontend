import styled from 'styled-components';
type DivProps = {
  m?: number;
  mt?: number;
  mb?: number;
  mr?: number;
  ml?: number;
  mx?: number;
  my?: number;
  p?: number;
  pt?: number;
  pb?: number;
  pr?: number;
  pl?: number;
  px?: number;
  py?: number;
};

const Div = styled.div`
  width: 100%;
  margin-top: ${(props: DivProps) => props.mt || props.my || 0}px;
  margin-bottom: ${(props: DivProps) => props.mb || props.my || 0}px;
  margin-right: ${(props: DivProps) => props.mr || props.mx || 0}px;
  margin-left: ${(props: DivProps) => props.ml || props.mx || 0}px;
  margin: ${(props: DivProps) => props.m || null}px;
  border-radius: 3px;
  font-weight: 300;
`;

export { Div };
