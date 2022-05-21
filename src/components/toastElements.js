export const toastSuccess = ({ title, body, dispatch, id }) => (
  <div
    id="toast"
    className="space-x relative mb-4 flex w-full max-w-xs items-center justify-start rounded-lg bg-white p-6 text-slate-500 shadow dark:bg-gray-800 dark:text-slate-400"
    role="alert"
  >
    <svg
      className="h-10 w-10 text-emerald-500 dark:text-emerald-600"
      fill="none"
      ariaHidden="true"
      data-name="badge-check"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
      />
    </svg>
    <div className="flex flex-col items-start justify-start">
      <div className="pl-4 text-base font-normal">{title}</div>
      {body && <div className="block pl-4 text-xs font-normal">{body}</div>}
    </div>
    <div
      onClick={() => dispatch({ type: 'DELETE_TOAST', id })}
      className="pointer-events-auto absolute top-2 right-2 hover:cursor-pointer"
    >
      <svg
        className="h-6 w-6 text-slate-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  </div>
)

export const toastError = ({ title, body, dispatch, id }) => (
  <div
    id="toast"
    className="space-x relative mb-4 flex w-full max-w-xs items-center justify-start rounded-lg bg-white p-6 text-slate-500 shadow dark:bg-gray-800 dark:text-slate-400"
    role="alert"
  >
    <svg
      className="h-6 w-6 text-red-600 dark:text-red-500"
      ariaHidden="true"
      data-name="exclamation-circle"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <div className="flex flex-col items-start justify-start">
      <div className="pl-4 text-base font-normal">{title}</div>
      {body && <div className="block pl-4 text-xs font-normal">{body}</div>}
    </div>
    <div
      onClick={() => dispatch({ type: 'DELETE_TOAST', id })}
      className="pointer-events-auto absolute top-2 right-2 hover:cursor-pointer"
    >
      <svg
        className="h-6 w-6 text-slate-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  </div>
)

export const toastWarning = ({ title, body, dispatch, id }) => (
  <div
    id="toast"
    className="space-x relative mb-4 flex w-full max-w-xs items-center justify-start rounded-lg bg-white p-6 text-slate-500 shadow dark:bg-gray-800 dark:text-slate-400"
    role="alert"
  >
    <svg
      className="h-6 w-6 text-yellow-400 dark:text-yellow-700"
      fill="none"
      ariaHidden="true"
      data-name="exclamation-shield"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
    <div className="flex flex-col items-start justify-start">
      <div className="pl-4 text-base font-normal">{title}</div>
      {body && <div className="block pl-4 text-xs font-normal">{body}</div>}
    </div>
    <div
      onClick={() => dispatch({ type: 'DELETE_TOAST', id })}
      className="pointer-events-auto absolute top-2 right-2 hover:cursor-pointer"
    >
      <svg
        className="h-6 w-6 text-slate-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  </div>
)
