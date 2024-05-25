import "./App.css";
import { AppBar } from "./components/AppBar.tsx";
import { ConnectWalletProvider } from "./components/ConnectWalletProvider.tsx";
import { Task } from "./components/Task.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <ConnectWalletProvider>
        <AppBar />
        <Routes>
          <Route path="/" element={<Task />} />
        </Routes>
      </ConnectWalletProvider>
    </BrowserRouter>
  );
}

export default App;
