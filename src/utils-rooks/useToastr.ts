import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

export const useToastr = (timeOut: number = 5000) => {
  toastr.options = {
    positionClass: 'toast-top-right',
    hideDuration: 3000,
    timeOut,
    closeButton: true,
    progressBar: true,
  };
  return toastr;
};
