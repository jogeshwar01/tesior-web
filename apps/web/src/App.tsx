import "./App.css";
import { AppBar } from "./components/AppBar.tsx";
import { ConnectWalletProvider } from "./components/ConnectWalletProvider.tsx";
import { GithubOAuth } from "./components/GithubOAuth.tsx";

function App() {
  return (
    <ConnectWalletProvider>
      <AppBar />
      <GithubOAuth />
    </ConnectWalletProvider>
  );
}

export default App;
