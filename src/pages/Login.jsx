import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faSignIn, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../utils/AuthContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { handleAuthContext, loginUser, error } = useAuth();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = { email, password };
    await loginUser(userInfo);
  };

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
                className="ls-eye"
              >
                {password.length > 0 && <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className='text-white/80'/>}
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <div className="center">
            <button type="submit" className="ls-btn absolute mt-1">
              Login
              <FontAwesomeIcon icon={faSignIn} className="ml-2" />
            </button>
            <a href="/login/forgot-password" className="relative bottom-6 md:left-[105px] left-[70px] mt-2 mb-8 text-sm text-amber-500 hover:text-amber-700">Forgot Password?</a>
          </div>
        </form>
        <div className="flex items-center mt-1">
          <div className="flex-grow border-t border-secondary_color"></div>
          <span className="mx-2 text-secondary_color">OR</span>
          <div className="flex-grow border-t border-secondary_color"></div>
        </div>
        <form>
          <div className="center flex-col p-1">
            <span className="text-white">Login with</span>
            <div className="flex mt-1">
              <button
                id='discord'
                type='submit'
                className="center border border-white/80 px-2 py-1 rounded-lg hover:border-secondary_color mr-2"
                onClick={handleAuth}
              >
                <FontAwesomeIcon icon={faDiscord} style={{ fontSize: '28px' }} />
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
          <p className="text-white">Don&apos;t have an account?</p>
          <a href="/signup" className="text-secondary_color hover:text-amber-700 px-1">Sign Up</a>
        </div>
      </div>
    </div>
  );
}

export default Login;