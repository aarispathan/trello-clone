import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BoardProvider } from './context/BoardContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BoardProvider>
      <ToastContainer
        position="bottom-left"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <App />
    </BoardProvider>
  </React.StrictMode>
);
