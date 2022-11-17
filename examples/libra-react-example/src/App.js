import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Libra } from 'libra-sdk';
import routes from './routes';
import { Button, Dialog } from 'evergreen-ui';
import { useEffect, useState } from 'react';
import ConnectWalletDialog from './components/ConnectWalletDialog';

function App() {
  const [account, setAccount] = useState(null);
  const [libra, setLibra] = useState(null);

  useEffect(() => {
    const instance = new Libra({
      appName: 'Libra Example',
      rpc: 'ws://127.0.0.1:9944',
    });
    setLibra(instance);
  }, []);

  const handleAccountSelected = (account) => {
    setAccount(account);
  };

  return (
    <div className="App">
      <header className="navbar">
        <img src={logo} className="logo" height={120} width="auto" alt="logo" />
        {/* <div className="navbar-items">
          <a className="navbar-item">Payments</a>
          <a className="navbar-item">Disputes</a>
        </div> */}
      </header>

      <div className="content">
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              element={<route.element libra={libra} account={account} />}
            />
          ))}
        </Routes>
      </div>

      <ConnectWalletDialog libra={libra} isShown={!account} onAccountSelected={handleAccountSelected} />
    </div>
  );
}

export default App;
