import { useContext, useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"
import PasswordStrength, { calculatePasswordStrength } from '../components/PasswordStrength';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    const loginUser = async (userInfo) => {
        const email = userInfo.email;
        const password = userInfo.password; 
        const response = await fetch('http://localhost:5001/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        });
        
        const data = await response.json();
        if (response.ok) {
            console.log('Login successful');
            setUser({accessToken: data.accessToken, refreshToken: data.refreshToken});
            navigate('/dashboard');
        } else {
            console.error('Login failed:', data.message);
            setError(data.message);
        }
    }

    const logoutUser = () => {
        //TODO: Implement logout functionality for user
    }

    const refreshToken = async () => {
        try {
            const res = await axios.post("http://localhost:5001/api/refresh", {
                token: user.refreshToken,
            });

            setUser({
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken,
            });
            return res.data;
        } catch (err) {
            console.log(err);
        }
    };

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(
        async (config) => {
            let currentDate = new Date();
            const decodedToken = jwtDecode(user.accessToken);
            //If expiration time is smaller than current time
            if (decodedToken.exp * 1000 < currentDate.getTime()) {
                const data = await refreshToken();
                config.headers["authorization"] = "Bearer " + data.accessToken;
            }
            return config;
        },
        (error) => {
            console.error(error);
            return Promise.reject(error);
        }
    );

    const signUpUser = async (userInfo) => {
        const passwordStrength = calculatePasswordStrength(userInfo.password);
        const email = userInfo.email;
        const password = userInfo.password;
        if (passwordStrength < 4) {
            setError('Please choose a stronger password.');
            return;
        }
        try {
            const response = await fetch('http://localhost:5001/signup', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Signup successful');
                setUser({accessToken: data.accessToken, refreshToken: data.refreshToken});
                navigate('/dashboard');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Signup failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred. Please try again.');
        }
    }

    const handleAuthContext = async (e) => {
        const buttonId = e.currentTarget.id;
        const authUrl = buttonId === 'discord' 
        ? 'http://localhost:5001/auth/discord' 
        : 'http://localhost:5001/auth/google';
        
        const authWindow = window.open(authUrl, '_blank', 'width=500,height=600');
        
        window.addEventListener('message', (event) => {
            if (event.origin !== 'http://localhost:5001') return;
            
            if (event.data.type === 'AUTH_SUCCESS') {
                console.log('Authentication successful');
                setUser({ accessToken: event.data.user.accessToken, refreshToken: event.data.user.refreshToken});
                authWindow.close();
                navigate("/dashboard");
            } else if (event.data.type === 'AUTH_FAILURE') {
                console.log('Authentication failed');
                authWindow.close();
            }
        }, false);
    }

    async function handleAddCourse(courseData) {
        try {
            const { courseName, universityName, courseInstructor, courseDescription } = courseData;
            const response = await axiosJWT.post("http://localhost:5001/courses", 
                { courseName, universityName, courseInstructor, courseDescription },
                {
                    headers: {
                        authorization: "Bearer " + user.accessToken,
                    },
                    withCredentials: true,
                }
            );
    
            if (response.data.error) {
                return { error: response.data.error };
            } else {
                return { success: "Course Added!" };
            }
    
        } catch (err) {
            console.error(err);
            return { error: "An error occurred while adding the course." };
        }
    }

    let contextData = {
        user,
        loginUser,
        handleAddCourse,
        handleAuthContext,
        logoutUser,
        signUpUser,
        error
    }

    return (
    <AuthContext.Provider value={contextData}>
        {children}
    </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

export default AuthContext;