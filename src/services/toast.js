// A tiny notification store read by <Toaster /> through useSyncExternalStore,
// so any module (including non-component code) can raise a toast.
let toasts = [];
let nextId = 1;
const listeners = new Set();

const emit = () => listeners.forEach((listener) => listener());

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getToasts = () => toasts;

export const dismissToast = (id) => {
  toasts = toasts.filter((item) => item.id !== id);
  emit();
};

export const clearToasts = () => {
  toasts = [];
  emit();
};

const push = (kind, message, title, timeout = 4000) => {
  const id = nextId++;
  toasts = [...toasts, { id, kind, title, message }];
  emit();
  if (timeout) setTimeout(() => dismissToast(id), timeout);
  return id;
};

export const toast = {
  success: (message, title = "Success", timeout) =>
    push("success", message, title, timeout),
  error: (message, title = "Error", timeout) =>
    push("error", message, title, timeout),
};
