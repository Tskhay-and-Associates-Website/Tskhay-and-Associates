import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Stakes from './components/Stakes.jsx';
import Value from './components/Value.jsx';
import Clients from './components/Clients.jsx';
import Services from './components/Services.jsx';
import About from './components/About.jsx';
import ClientWork from './components/ClientWork.jsx';
import Approach from './components/Approach.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Stakes />
        <Value />
        <Clients />
        <Services />
        <About />
        <ClientWork />
        <Approach />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
