import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple, faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faSignIn, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted', { email, password });
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useGSAP(() => {
    gsap.from('.glass', { opacity: 0, duration: 1, y: -50, ease: 'elastic' });
  }, []);

  return (
    <div className="center h-screen">
      <div className="ls-container glass">
        <h1 className="ls-h1">Login</h1>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="ls-label">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={email}
              onChange={handleEmailChange}
              placeholder='Enter Email...' 
              className="ls-info" 
              required
            />            
          </div>
          <div>
            <label htmlFor="password" className="ls-label">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder='Enter Password...'
                className="ls-info w-full pr-10"
                onChange={handlePasswordChange}
                value={password}
                required
              />
              <button 
                type="button" 
                onClick={toggleShowPassword} 
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-sm leading-5"
              >
                {password.length > 0 && <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className='text-white/80'/>}
              </button>
            </div>
          </div>
          <div className="center">
            <button type="submit" className="ls-btn absolute mt-1">
              Login
              <FontAwesomeIcon icon={faSignIn} className="ml-2" />
            </button>
            <a href="/forgot-password" className="relative bottom-6 md:left-[105px] left-[70px] mt-2 mb-8 text-sm  text-amber-500 hover:text-amber-700">Forgot Password?</a>
          </div>
        </form>
        <div className="flex items-center mt-1">
          <div className="flex-grow border-t border-amber-500"></div>
          <span className="mx-2 text-amber-500">OR</span>
          <div className="flex-grow border-t border-amber-500"></div>
        </div>
        <div className="center flex-col p-1">
          <span className="text-white">Continue with</span>
          <div className="flex space-x-4 mt-1">
            <button className="hover:text-amber-500">
              <FontAwesomeIcon icon={faApple} style={{ fontSize: '28px' }}/>
            </button>
            <button className="hover:text-amber-500">
              <FontAwesomeIcon icon={faGoogle} style={{ fontSize: '25px' }}/>
            </button>
            <button className="hover:text-amber-500">
              <FontAwesomeIcon icon={faGithub} style={{ fontSize: '25px' }}/>
            </button>
          </div>
        </div>
        <div className="center mt-2">
          <p className="text-white">Don&apos;t have an account?</p>
          <a href="/signup" className="text-amber-500 hover:text-amber-700 px-1">Sign Up</a>
        </div>
      </div>
    </div>
  )
}

export default Login;
