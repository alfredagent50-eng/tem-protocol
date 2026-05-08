/**
 * Entry point. Imports the Meridian token + base layers first, then the
 * component sheet, then mounts <App />. Order matters: tokens.css defines
 * the variables base.css and components.css consume.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(<App />);
