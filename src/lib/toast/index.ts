import { toast } from "sonner";

export type NotifyType = "success" | "error" | "info" | "warning" | "loading";

export interface NotifyOptions {
  type?: NotifyType;
  message: string;
}

export const notify = ({ type = "info", message }: NotifyOptions) => {
  switch (type) {
    case "success":
      return toast.success(message);
    case "error":
      return toast.error(message);
    case "warning":
      return toast.warning(message);
    case "loading":
      return toast.loading(message);
    default:
      return toast(message);
  }
};

export const showSuccess = (message: string) => notify({ type: "success", message });
export const showError = (message: string) => notify({ type: "error", message });
export const showInfo = (message: string) => notify({ type: "info", message });
export const showWarning = (message: string) => notify({ type: "warning", message });
export const showLoading = (message: string) => notify({ type: "loading", message });

export const dismissToast = (toastId?: string | number) => {
  toast.dismiss(toastId);
};
