'use client';

import React from 'react';
import { ToastContainer } from 'react-toastify';

export function ToasterContainer() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      closeButton
      draggableDirection="x"
    />
  );
}
