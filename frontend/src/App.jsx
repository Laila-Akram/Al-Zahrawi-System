import Navbar from "./components/common/Navbar";

function App() {
  return (
    <>
      <Navbar />

      <div className="container mt-5 text-center">
        <h1 className="fw-bold">AL-ZAHRAWI</h1>

        <p className="lead">
          Inspired by history, built for modern dentistry.
        </p>

        <button className="btn btn-primary">
          Get Started
        </button>
      </div>
    </>
  );
}

export default App;