import logo from '../logo.svg';

function Home() {

  return (
    <div className="App bg-gray-900 text-white h-screen flex items-center">
      <header className="App-header text-center w-full">
        <img src={logo} className="w-2/4 inline-block" alt="logo" />
        <p className="mb-6">
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="border border-solid border-white px-5 py-3 inline-block hover:bg-white hover:text-gray-900 rounded"
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

export default Home;
