import { useState, useEffect } from 'react';

export const calculatePasswordStrength = (pwd) => {
  let score = 0;
  if (pwd.length > 6) score++;
  if (pwd.length > 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
};

const PasswordStrength = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {

    const newStrength = calculatePasswordStrength(password);
    setStrength(newStrength);

    switch (newStrength) {
      case 0:
      case 1:
        setMessage('Weak');
        break;
      case 2:
      case 3:
        setMessage('Moderate');
        break;
      case 4:
        setMessage('Strong');
        break;
      case 5:
        setMessage('Very Strong');
        break;
      default:
        setMessage('');
    }
  }, [password]);

  const getColorClass = () => {
    switch (strength) {
      case 0:
      case 1:
        return 'bg-red-500 text-red-500';
      case 2:
      case 3:
        return 'bg-yellow-500 text-yellow-500';
      case 4:
        return 'bg-green-500 text-green-500';
      case 5:
        return 'bg-emerald-500 text-emerald-500';
      default:
        return 'bg-gray-300 text-gray-300';
    }
  };

  if (password.length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <div className="flex h-2 overflow-hidden bg-gray-300 rounded">
        <div
          className={`transition-all duration-300 ${getColorClass().split(' ')[0]}`}
          style={{ width: `${(strength / 5) * 100}%` }}
        ></div>
      </div>
      <p className={`text-sm mt-1 ${getColorClass().split(' ')[1]}`}>{message}</p>
    </div>
  );
};

export default PasswordStrength;
