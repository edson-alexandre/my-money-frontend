import { useToast } from '@chakra-ui/react';

export const useToastr = () => {
  const toast = useToast();

  const toastr = (status: 'success' | 'error' | 'warning', title: string, description: string): void => {
    toast({
      title,
      description,
      status,
      variant: 'solid',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
  };
  return { toastr };
};
