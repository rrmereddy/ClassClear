import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Header = () => (
  useGSAP(() => {
    gsap.from('#navbar', 
    { 
      y: -50, 
      opacity: 0, 
      duration: 1, 
      delay: 0.5, 
      ease: 'power4.out'
    });
  }, []),

  <header id='navbar' className="container mx-auto py-6 flex justify-between items-center">
    <h1 className="text-2xl font-bold text-secondary_color pl-4">Class Clear</h1>
    <nav>
      <button className="px-4 py-2 text-primary_color hover:text-secondary_color">Features</button>
      <button className="px-4 py-2 text-primary_color hover:text-secondary_color">Pricing</button>
      <button className="px-4 py-2 text-primary_color hover:text-secondary_color">Contact</button>
    </nav>
  </header>
);

export default Header;
