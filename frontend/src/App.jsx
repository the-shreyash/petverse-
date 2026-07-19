import AppRoutes from "./routes/AppRoutes";
import { AIContextProvider } from "./contexts/AIContext";
import ErrorBoundary from "./components/ui/ErrorBoundary/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <AIContextProvider>
        <AppRoutes />
      </AIContextProvider>
    </ErrorBoundary>
  );
}

export default App;
