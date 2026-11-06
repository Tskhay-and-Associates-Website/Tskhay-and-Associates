import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './setup.js';
import PrivacyPage from './components/PrivacyPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrivacyPage />
  </StrictMode>
);
