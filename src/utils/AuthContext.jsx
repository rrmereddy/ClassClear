import { useContext, useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"
import { calculatePasswordStrength } from '../components/PasswordStrength';

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
            const { course_name, university_name, instructor_name, syllabus_file, syllabus_text } = courseData;
            const response = await axiosJWT.post("http://localhost:5001/courses", 
                { course_name, university_name, instructor_name, syllabus_file, syllabus_text },
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

    async function handleDeleteCourse(courseData) {
        try {
            const { course_name, university_name, instructor_name } = courseData;
            const response = await axiosJWT.delete("http://localhost:5001/deletecourse", {
                data: { course_name, university_name, instructor_name },
                headers: {
                    authorization: "Bearer " + user.accessToken,
                },
                withCredentials: true,
            });
    
            if (response.data.error) {
                return { error: response.data.error };
            } else {
                return { success: response.data.message };
            }
    
        } catch (err) {
            console.error(err);
            return { error: "An error occurred while deleting the course." };
        }
    }

    async function handleAddDeadline(deadlineData) {
        try {
            const { courseName, category, dueDate } = deadlineData;
            const response = await axiosJWT.post("http://localhost:5001/deadlines", 
                { courseName, category, dueDate },
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
                return { success: "Deadline Added!" };
            }
    
        } catch (err) {
            console.error(err);
            return { error: "An error occurred while adding the deadline." };
        }
    }

    async function handleDeleteDeadline(deadlineData) {
        try {
            const { course_name, category, dueDate } = deadlineData;
            const response = await axiosJWT.delete("http://localhost:5001/deletedeadline", {
                data: { course_name, category, dueDate },
                headers: {
                    authorization: "Bearer " + user.accessToken,
                },
                withCredentials: true,
            });
    
            if (response.data.error) {
                return { error: response.data.error };
            } else {
                return { success: response.data.message };
            }
    
        } catch (err) {
            console.error(err);
            return { error: "An error occurred while deleting the deadline." };
        }
    }

    async function getCourses() {
        const res = await axiosJWT.post("http://localhost:5001/getcourses", 
            {accessToken: user.accessToken}, 
            {
                headers: {
                    authorization: "Bearer " + user.accessToken,
                },
                withCredentials: true,
            }
        )

        if (res.data.error) {
            alert("There was an issue fetching your courses");
            return;
        } else {
            const courses = (res.data.courses);
            return courses;
        }
    }

    async function getDeadlines() {
        const res = await axiosJWT.post("http://localhost:5001/getdeadlines", 
            {accessToken: user.accessToken}, 
            {
                headers: {
                    authorization: "Bearer " + user.accessToken,
                },
                withCredentials: true,
            }
        )

        if (res.data.error) {
            alert("There was an issue fetching your deadlines");
            return;
        } else {
            const deadlines = (res.data.deadlines);
            return deadlines;
        }
    }

    async function getUniversityNames(search) {
        const res = await axios.post("http://localhost:5001/universitynames", 
            { search },
            {
                withCredentials: true,
            }
        )

        if (res.data.error) {
            alert("Issue fetching university names");
            return;
        } else {
            const uniNames = res.data.universityNames;
            return uniNames;
        }
    }

    let contextData = {
        user,
        loginUser,
        handleAddCourse,
        handleDeleteCourse,
        handleAddDeadline,
        handleDeleteDeadline,
        handleAuthContext,
        logoutUser,
        signUpUser,
        getCourses,
        getDeadlines, 
        getUniversityNames, //function gets university names according to search parameter passed in
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