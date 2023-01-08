import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Button,
} from '@chakra-ui/react';
import { ICustomAlertRef } from '../../interfaces/ICustomAlertRef';

interface ICustomAlertProps {
  title?: string;
  message?: string;
  confirm(obj?: any): void;
}

export const CustomAlertDialog = forwardRef<ICustomAlertRef, ICustomAlertProps>((props: ICustomAlertProps, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);
  const [obj, setObj] = useState();

  useImperativeHandle(ref, () => ({
    open(obj?: any) {
      setObj({ ...obj });
      onOpen();
    },
  }));
  return (
    <>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {props.title}
            </AlertDialogHeader>
            <hr />

            <AlertDialogBody mt={5}>{props.message}</AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>Cancelar</Button>
              <Button
                colorScheme="whatsapp"
                onClick={() => {
                  onClose();
                  props.confirm(obj);
                }}
                ml={3}
              >
                Confirmar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
});
