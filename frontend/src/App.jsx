import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Login from "./components/auth/Login";

const App = () => {
  return (
    <>
      <Navbar />

      <main>
        <Login />
      </main>

      <Footer />
    </>
  );
};

export default App;