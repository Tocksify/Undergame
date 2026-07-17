import { createRoot } from 'react-dom/client';

import App from './App';
import { initGlobalStores } from './initGlobalStores';

import './index.css';

initGlobalStores().then(() => {
  createRoot(document.getElementById('root')!).render(<App />);
});
