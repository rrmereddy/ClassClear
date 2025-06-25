import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/all';
gsap.registerPlugin(TextPlugin);

const Hero = () => {
  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.fromTo('#header-start', { text: '' }, { text: 'Redefining the ', duration: 0.75, ease: 'power4.out' })
      .fromTo('#header-syllabus', { text: '' }, { text: 'Syllabus', duration: 1, ease: 'power4.out' })
      .fromTo('#header-end', { text: '' }, { text: ' Experience', duration: 0.75, ease: 'power4.out' })
      .from('.card-wrapper', { y: 50, opacity: 0, duration: 1, delay: 0.5, ease: 'power4.out'})
      .from('#text', { opacity: 0, duration: 0.5, ease: 'power4.out'});
  }, []);

  return (
    <div className="text-center mt-16">
      <h2 id='header' className="text-5xl font-bold text-primary_color mb-6">
        <span id="header-start"></span>
        <span id="header-syllabus" className="text-secondary_color"></span>
        <span id="header-end"></span>
      </h2>
      <p id='text' className="text-xl text-tertiary_color mb-8 max-w-2xl mx-auto">
        Say goodbye to endless scrolling. Access all your course information with a single click.
      </p>
      <Link to='/signup' className='center'>
        <div className="center card-wrapper h-[50px] w-[150px]">
          <div className="center card-content text-sm hover:text-secondary_color">
            Get Started
            <ArrowRight size={20} className='ml-1'/>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Hero;