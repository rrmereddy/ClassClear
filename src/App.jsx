import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Landing from './pages/Landing';

function App() {

  return (
    <main >
      <Router>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/auth/google' element={<h1>Implement Google Auth</h1>} />
          <Route path='/auth/apple' element={<h1>Implement Apple Auth</h1>} />
          <Route path='/login/forgot-password' element={<h1>Implement Forgot Password</h1>} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
