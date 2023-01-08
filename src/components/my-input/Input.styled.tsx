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
  disabled?: boolean;
  readonly?: boolean;
  rightIcon?: any;
  leftIcon?: any;
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
  ${(props: InputProps) => (props.leftIcon ? `padding-left: 30px` : null)};
  ${(props: InputProps) => (props.rightIcon ? `padding-right: 30px` : null)};
  &:focus {
    outline: none;
    border-bottom: solid 2px #1867c0;
  }
`;

const Div = styled.div`
  padding-top: ${(props: InputProps) => props.pt || props.py || 0}px;
  padding-bottom: ${(props: InputProps) => props.pb || props.py || 0}px;
  padding-right: ${(props: InputProps) => props.pr || props.px || 0}px;
  padding-left: ${(props: InputProps) => props.pl || props.px || 0}px;
  padding: ${(props: InputProps) => props.p || null}px;
  width: 100%;
  border-radius: 3px;
  margin-top: ${(props: InputProps) => props.mt || props.my || 0}px;
  margin-bottom: ${(props: InputProps) => props.mb || props.my || 0}px;
  margin-right: ${(props: InputProps) => props.mr || props.mx || 0}px;
  margin-left: ${(props: InputProps) => props.ml || props.mx || 0}px;
  margin: ${(props: InputProps) => props.m || null}px;
  box-sizing: content-box;
  &:focus {
    outline: none;
    border-bottom: solid 2px #1867c0;
  }
`;

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const RightIcon = styled.div`
  font-size: 1.2em;
  margin-left: -25px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LeftIcon = styled.div`
  font-size: 1.2em;
  height: 100%;
  position: absolute;
  left: 5px;
  top: 5px;
`;

const Input = forwardRef<any, InputProps>((props: InputProps, ref) => {
  return (
    <Div {...props}>
      <label>{props.label}</label>
      <Container>
        {props.leftIcon && <LeftIcon>{props.leftIcon}</LeftIcon>}
        <StyledInput readOnly={props.readonly} {...props} ref={ref} className="input" />
        {props.rightIcon && <RightIcon>{props.rightIcon}</RightIcon>}
      </Container>
      {}
      {props.isLoading && <Progress size="xs" isIndeterminate style={{ marginTop: '-1px', padding: '0px' }} />}
      {props.isError && <ErrorMessage>{props.errorMessage}</ErrorMessage>}
    </Div>
  );
});

const InputMask: ComponentType<IMaskProps & InputProps> = IMaskMixin(({ inputRef, ...props }) => (
  <>
    <Input {...(props as any)} ref={inputRef} />
  </>
));
export { InputMask, Input };
