import { IMaskMixin } from 'react-imask';
import styled from 'styled-components';

import { AnyMaskedOptions, MaskElement } from 'imask';
import { IMaskInputProps } from 'react-imask/dist/mixin';
import { ComponentType, forwardRef } from 'react';
import { Progress } from '@chakra-ui/react';
import { ErrorMessage } from './ErrorMessage.styled';

type IMaskProps = IMaskInputProps<
  AnyMaskedOptions,
  false,
  string,
  MaskElement | HTMLTextAreaElement | HTMLInputElement
>;

type InputProps = {
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
  type?: string;
  onChange?(e: React.ChangeEvent<HTMLInputElement>): void;
  value?: any;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  label?: string;
  placeholder?: string;
};

const StyledInput = styled.input`
  padding-top: ${(props: InputProps) => props.pt || props.py || 0}px;
  padding-bottom: ${(props: InputProps) => props.pb || props.py || 0}px;
  padding-right: ${(props: InputProps) => props.pr || props.px || 0}px;
  padding-left: ${(props: InputProps) => props.pl || props.px || 0}px;
  padding: ${(props: InputProps) => props.p || null}px;
  width: 100%;
  border-radius: 3px;
  border-bottom: ${(props: InputProps) => (!props.isLoading ? 'solid 0.5px rgba(0, 0, 0, 0.42)' : null)};
  border: ${(props: InputProps) => (props.isError ? 'solid 0.5px red' : null)};
  margin-top: ${(props: InputProps) => props.mt || props.my || 0}px;
  margin-bottom: ${(props: InputProps) => props.mb || props.my || 0}px;
  margin-right: ${(props: InputProps) => props.mr || props.mx || 0}px;
  margin-left: ${(props: InputProps) => props.ml || props.mx || 0}px;
  margin: ${(props: InputProps) => props.m || null}px;
  &:focus {
    outline: none;
    border-bottom: solid 2px #1867c0;
  }
`;

const Input = forwardRef<any, InputProps>((props: InputProps, ref) => {
  return (
    <>
      <label style={{ marginTop: '10px' }}>{props.label}</label>
      <StyledInput {...props} ref={ref} className="input" />
      {props.isLoading && <Progress size="xs" isIndeterminate style={{ marginTop: '-1px' }} />}
      {props.isError && <ErrorMessage>{props.errorMessage}</ErrorMessage>}
    </>
  );
});

const InputMask: ComponentType<IMaskProps & InputProps> = IMaskMixin(({ inputRef, ...props }) => (
  <>
    <Input {...(props as any)} ref={inputRef} />
  </>
));
export { InputMask, Input };
