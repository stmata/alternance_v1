import React, { useState, useEffect, useContext } from 'react';
import { FaUser, FaLock, FaArrowLeft } from 'react-icons/fa';
import styles from './LoginPage.module.css';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../AppContext';

const useTypewriterEffect = (text, duration) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    const totalChars = text.length;
    const timePerChar = duration / totalChars;
    let index = 0;

    const intervalId = setInterval(() => {
      index++;
      setDisplayedText(text.slice(0, index));
      if (index === totalChars) clearInterval(intervalId);
    }, timePerChar);
    
    return () => clearInterval(intervalId);
  }, [text, duration]);

  return displayedText;
};


const LoginForm = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [wrongCode, setWrongCode] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  //const fullText = "Welcome to the SKEMA Application Alternance. Discover job opportunities that match your skills with the power of AI. Enhance your CV with personalized recommendations and create tailored cover letters for your desired positions. Start your journey towards the perfect job! ";
  const fullText = "Welcome to the SKEMA Application Alternance.";
  const smallScreenText = "Welcome to the SKEMA Application Alternance";
  const navigate = useNavigate()
  const textToDisplay = isSmallScreen ? smallScreenText : fullText;
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  
  useEffect(() => {
    let timer;
    if (isCodeSent && !isConfirmed && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
    }
    if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [isCodeSent, countdown, isConfirmed]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/PlatformPage');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 480);
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const displayedText = useTypewriterEffect(textToDisplay, 15000);

  const sendVerificationCode = async (email) => {
    try {
      const response = await fetch(`${baseUrl}/send-verification-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send verification code');
      }
      
      const data = await response.json();
      //console.log('Verification code sent successfully:', data);
      return true;
    } catch (error) {
      //console.error('Error sending verification code:', error);
      setError('Failed to send verification code. Please try again.');
      return false;
    }
  };
  
  const verifyCode = async (email, code) => {
    try {
      const response = await fetch(`${baseUrl}/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });
      
      const data = await response.json();


      if (data.statut === true) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      return false;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    
    if (!isCodeSent) {
      const codeSent = await sendVerificationCode(email);
      if (codeSent) {
        setIsCodeSent(true);
        setCountdown(60);
        setCanResend(false);
      }
    } else {
      const isValidCode = await verifyCode(email, code);
      if (isValidCode) {
        setIsAuthenticated(true)
        setIsConfirmed(true);
        setWrongCode(false);
        navigate('/PlatformPage');
      } else {
        setWrongCode(true);
        setError('');
      }
    }
  };
  

  const handleResendCode = () => {
    setCountdown(60);
    setCanResend(false);
    setIsConfirmed(false);
    setWrongCode(false);
  };

  const handleReset = () => {
    setEmail('');
    setCode('');
    setIsCodeSent(false);
    setCountdown(60);
    setCanResend(false);
    setIsConfirmed(false);
    setWrongCode(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.animatedText}>
        {displayedText}
      </div>
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <h2 className={styles.title}>Login</h2>
          <div style={{ width: '24px' }}></div>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              id="email"
              className={styles.input}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isCodeSent}
              required
            />
            <FaUser className={styles.inputIcon} size={20} />
          </div>
          {isCodeSent && (
            <div className={styles.inputGroup}>
              <input
                type="text"
                id="code"
                className={styles.input}
                placeholder="Enter the code received via email"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <FaLock className={styles.inputIcon} size={20} />
            </div>
          )}
          {isCodeSent && (
            <div className={styles.flexBetween}>
              <button
                type="button"
                onClick={handleReset}
                className={styles.modifyEmailButton}
              >
                Modify email
              </button>
              {wrongCode && (
                <span className={styles.errorMessage}>Wrong code. Please try again </span>
              )}
            </div>
          )}
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit" className={styles.button}>
            {isCodeSent ? 'Confirm' : 'Login'}
          </button>
        </form>
        {isCodeSent && !isConfirmed && (
          <div className={styles.flexBetween} style={{ marginTop: '1rem' }}>
            {canResend ? (
              <button
                onClick={handleResendCode}
                className={styles.resendCodeButton}
              >
                Resend code
              </button>
            ) : (
              <p className={styles.countdownText}>{countdown} seconds remaining</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;