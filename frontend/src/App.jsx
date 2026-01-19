import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { HomePage } from './pages/HomePage';
import { MethodologyPage } from './pages/MethodologyPage';

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/methodology" element={<MethodologyPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
