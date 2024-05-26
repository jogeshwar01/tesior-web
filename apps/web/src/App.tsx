import "./App.css";
import { AppBar } from "./components/AppBar.tsx";
import { ConnectWalletProvider } from "./components/ConnectWalletProvider.tsx";
import { CreateTask } from "./components/CreateTask.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

function App() {
  return (
    <BrowserRouter>
      <ConnectWalletProvider>
        <AppBar />
        <Routes>
          <Route path="/" element={<CreateTask />} />
        </Routes>
      </ConnectWalletProvider>
    </BrowserRouter>
  );
}

export default App;
