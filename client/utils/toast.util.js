import { toast } from "react-toastify";

toast.configure();

export const notify = (type, msg, option = {}) => {
  toast(msg, { position: toast.POSITION.TOP_RIGHT, ...option, type: type });
};
