import Header from '../components/LandingComp/Header'
import Hero from '../components/LandingComp/Hero'
import Footer from '../components/LandingComp/Footer'

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
