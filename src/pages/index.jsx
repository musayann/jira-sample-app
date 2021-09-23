import logo from '../logo.svg';
import '../App.css';


function Dashboard() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href={process.env.REACT_APP_AUTH_URI}
          target="_blank"
          rel="noopener noreferrer"
        >
          Connect to Jira
        </a>
      </header>
    </div>
  );
}

export default Dashboard;
