import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

export const authService = 'http://localhost:5000';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    
<GoogleOAuthProvider clientId="628735397067-4ropvojk9aq3ebnn533pu4hdkam47iub.apps.googleusercontent.com">
  <App />
  </GoogleOAuthProvider>;
    
  </StrictMode>,
)
