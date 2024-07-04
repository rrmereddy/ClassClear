import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple, faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faSignIn } from '@fortawesome/free-solid-svg-icons';
import PasswordStrengthIndicator from './PasswordStrength';

const SignUp = () => {
  const [password, setPassword] = useState('');

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96 p-6 glass rounded-lg shadow-xl">
        <h1 className="text-2xl font-semibold text-white text-center">Sign Up</h1>
        <form className="mt-4 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
            <input type="email" id="email" name="email" placeholder='Enter Email...' className="ls-info" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder='Enter Password...' 
              className="ls-info"
              onChange={handlePasswordChange}
              value={password}
            />
            <PasswordStrengthIndicator password={password} />
          </div>
          <div className="flex justify-center items-center">
            <button type="submit" className="ls-btn">
              Sign Up
              <FontAwesomeIcon icon={faSignIn} className="ml-2" />
            </button>
          </div>
        </form>
        <div className="flex items-center justify-center border-amber-500 border-b h-0 p-2" />
        <div className="flex flex-col justify-center items-center p-1">
          <p className="text-white">Or signup with</p>
          <div className="flex space-x-4 mt-2">
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
        <div className="flex justify-center items-center mt-2">
          <p className="text-white">Already have an account?</p>
          <a href="/login" className="text-amber-500 hover:text-amber-700 px-1">Log in</a>
        </div>
      </div>
    </div>
  )
}

export default SignUp


