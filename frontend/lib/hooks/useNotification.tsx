import React from "react";
import { toast } from "react-hot-toast";

const success = (message: string, title = "Success") => {
  toast.custom((t) => (
    <div className="flex w-full max-w-sm  overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
      <div className="flex w-12 items-center justify-center bg-green-500">
        <svg
          className="h-6 w-6 fill-current text-white"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
        </svg>
      </div>

      <div className="-mx-3 px-4 py-2">
        <div className="mx-3">
          <span className="font-semibold text-emerald-500 dark:text-emerald-400">
            {title}
          </span>
          <p className="text-sm text-gray-600 dark:text-gray-200">{message}</p>
        </div>
      </div>
    </div>
  ), {
    duration: 2000
  });
};

const info = (message: string, title = "Info") => {
  toast.custom((t) => (
    <div className="flex w-full max-w-sm  overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
      <div className="flex w-12 items-center justify-center bg-cyan-500">
        <svg
          className="h-6 w-6 fill-current text-white"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z" />
        </svg>
      </div>

      <div className="-mx-3 px-4 py-2">
        <div className="mx-3">
          <span className="font-semibold text-cyan-500 dark:text-cyan-400">
            {title}
          </span>
          <p className="text-sm text-gray-600 dark:text-gray-200">{message}</p>
        </div>
      </div>
    </div>
  ), {
    duration: 2000
  });
};

const warning = (message: string, title = "Warning") => {
  toast.custom((t) => (
    <div className="flex w-full max-w-sm  overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
      <div className="flex w-12 items-center justify-center bg-yellow-400">
        <svg
          className="h-6 w-6 fill-current text-white"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z" />
        </svg>
      </div>

      <div className="-mx-3 px-4 py-2">
        <div className="mx-3">
          <span className="font-semibold text-yellow-400 dark:text-yellow-300">
            {title}
          </span>
          <p className="text-sm text-gray-600 dark:text-gray-200">{message}</p>
        </div>
      </div>
    </div>
  ), {
    duration: 2000
  });
};

const error = (message: string, title = "Error") => {
  toast.custom((t) => (
    <div className="flex w-full max-w-sm  overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
      <div className="flex w-12 items-center justify-center bg-red-500">
        <svg
          className="h-6 w-6 fill-current text-white"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
        </svg>
      </div>

      <div className="-mx-3 px-4 py-2">
        <div className="mx-3">
          <span className="font-semibold text-red-500 dark:text-red-400">
            {title}
          </span>
          <p className="text-sm text-gray-600 dark:text-gray-200">{message}</p>
        </div>
      </div>
    </div>
  ),
    {
      duration: 2000
    });
};


export const useNotification = () => {
  const onSuccess = (message: string) => success(message);
  const onInfo = (message: string) => info(message);
  const onWarning = (message: string) => warning(message);
  const onError = (message: string) => error(message);

  return { onSuccess, onInfo, onWarning, onError };
};