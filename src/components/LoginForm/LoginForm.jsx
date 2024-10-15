import React from 'react';
import './LoginForm.css';
import { FaUser } from 'react-icons/fa';

const LoginForm = () => {
  return (
    <div className='login-body'> {/* Full-page wrapper */}
      <div className='wrapper'>
        <form action=''>
          <h1>Login</h1>
          <div className="input-box">
            <input type='email' placeholder='Skema Email' />
            <FaUser className='icon' />
          </div>
          <button type='submit'>Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
