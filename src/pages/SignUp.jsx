import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faSignIn, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import PasswordStrength from '../components/PasswordStrength';
import gsap from 'gsap';
import { useAuth } from '../utils/AuthContext';
import { useGSAP } from '@gsap/react';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  let { handleAuthContext, signUpUser, error } = useAuth();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    signUpUser({ email, password});
    console.log('Form submitted');
  }

  const handleAuth = (e) => {
    e.preventDefault();
    handleAuthContext(e);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useGSAP(() => {
    gsap.from('.glass', { opacity: 0, duration: 1, y: -50, ease: 'elastic' });
  }, []);

  return (
    <div className="center h-screen">
      <div className="ls-container glass">
        <h1 className="ls-h1">Sign Up</h1>
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
                className="ls-eye"
              >
                {password.length > 0 && <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className='text-white/80'/>}
              </button>
            </div>
            <PasswordStrength password={password} />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <div className="center">
            <button type="submit" className="ls-btn">
              Sign Up
              <FontAwesomeIcon icon={faSignIn} className="ml-2" />
            </button>
          </div>
        </form>
        <div className="flex items-center mt-2">
          <div className="flex-grow border-t border-secondary_color"></div>
          <span className="mx-2 text-secondary_color">OR</span>
          <div className="flex-grow border-t border-secondary_color"></div>
        </div>
        <form>
          <div className="center flex-col p-1">
            <span className="text-white">Sign Up with</span>
            <div className="flex mt-1">
              <button
                id='discord'
                type='submit'
                className="center border border-white/80 px-2 py-1 rounded-lg hover:border-secondary_color mr-2"
                onClick={handleAuth}
              >
                <FontAwesomeIcon icon={faDiscord} style={{ fontSize: '30px' }} />
              </button>
              <button
                id='google'
                type='submit'
                className="center border border-white/80 px-3 py-1 rounded-lg hover:border-secondary_color"
                onClick={handleAuth}
              >
                <FontAwesomeIcon icon={faGoogle} style={{ fontSize: '25px' }} />
              </button>
            </div>
          </div>
        </form>
        <div className="center mt-2">
          <p className="text-white">Already have an account?</p>
          <a href="/login" className="text-secondary_color hover:text-amber-700 px-1">Login</a>
        </div>
      </div>
    </div>
  )
}

export default SignUp;
