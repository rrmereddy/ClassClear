import Header from '../components/Header'
import Hero from '../components/Hero'
import Footer from '../components/Footer'

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
