import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/all';
gsap.registerPlugin(TextPlugin);

const Hero = () => {
  useGSAP(() => {
    gsap.fromTo('#header', { text: '' }, { text: 'Redefining the Syllabus Experience', duration: 2, delay: 0.5, ease: 'power4.out'});
  }, [])

  return(
    <div className="text-center mt-16">
    <h2 id='header' className="text-5xl font-bold text-primary_color mb-6">
      Redefining the Syllabus Experience
    </h2>
    <p className="text-xl text-tertiary_color mb-8 max-w-2xl mx-auto">
      Say goodbye to endless scrolling. Access all your course information with a single click.
    </p>
    <Link to='/signup' className='center'>
      <div className="center card-wrapper h-[50px] w-[150px]">
        <div className="center card-content text-sm hover:text-secondary_color">
          Get Started
          <FontAwesomeIcon icon={faArrowRight} className='ml-2' />
        </div>
      </div>
    </Link>
  </div>
  )
};
  
  export default Hero;
  