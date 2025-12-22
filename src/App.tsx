import AppRoutes from './routes';
import { Toaster } from 'sonner';

function App() {
  // Added the return keyword here
  return (
    <>
      <Toaster richColors position="top-center" />
      <AppRoutes />
    </>
  );
}

export default App;