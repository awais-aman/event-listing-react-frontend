import { useSyncExternalStore } from "react";
import { dismissToast, getToasts, subscribe } from "../services/toast";

const Toaster = () => {
  const toasts = useSyncExternalStore(subscribe, getToasts);

  return (
    <div className="toaster" aria-live="polite">
      {toasts.map(({ id, kind, title, message }) => (
        <div
          key={id}
          className={`toast-item toast-item--${kind}`}
          role={kind === "error" ? "alert" : "status"}
        >
          <div className="toast-item__body">
            <strong>{title}</strong>
            <div>{message}</div>
          </div>
          <button
            type="button"
            className="btn-close"
            aria-label="Dismiss notification"
            onClick={() => dismissToast(id)}
          />
        </div>
      ))}
    </div>
  );
};

export default Toaster;
