import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

function App() {
  return (
    <>
      <Navbar />

      <main className="container mt-5 text-center">
        <h1 className="fw-bold">AL-ZAHRAWI</h1>

        <p className="lead">
          Inspired by history, built for modern dentistry.
        </p>

        <button className="btn btn-primary">
          Get Started
        </button>
      </main>

      <Footer />
    </>
  );
}

export default App;