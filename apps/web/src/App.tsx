import "./App.css";
import { AppBar } from "./components/AppBar.tsx";
import { ConnectWalletProvider } from "./components/ConnectWalletProvider.tsx";

function App() {
  return (
    <ConnectWalletProvider>
      <AppBar />
    </ConnectWalletProvider>
  );
}

export default App;
