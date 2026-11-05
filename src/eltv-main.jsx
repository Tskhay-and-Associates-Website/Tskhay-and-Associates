import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './setup.js';
import EltvApp from './eltv/EltvApp.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EltvApp />
  </StrictMode>
);
