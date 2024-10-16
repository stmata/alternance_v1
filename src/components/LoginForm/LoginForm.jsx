import React, { useState, useEffect, useContext } from 'react';
import { FaUser, FaArrowLeft, FaHourglassHalf, FaLock, FaSyncAlt } from 'react-icons/fa';
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
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_APP_BASE_URL; 
  const fullText = "Welcome to the SKEMA Application Alternance.\n Discover job opportunities that match your skills with the power of AI. \n Enhance your CV with personalized recommendations and create tailored cover letters for your desired positions. \n Start your journey towards the perfect job! ";
  
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const textToDisplay = isSmallScreen ? fullText : fullText;
  
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
      
      return true;
    } catch (error) {
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

      return data.statut === true;
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
        setIsAuthenticated(true);
        setIsConfirmed(true);
        setWrongCode(false);
        navigate('/PlatformPage');
      } else {
        setWrongCode(true);
        setError('Wrong code. Please try again.');
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
    setWrongCode(false);  // Reset the wrong code error state
    setError('');  // Reset the general error state
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.animatedText}>
        {displayedText}
      </div>
      <div className={styles.loginFormBox}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>Login :</h2>
        </div>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {/* Email input visible if code is NOT sent */}
          {!isCodeSent && (
            <div className={styles.inputGroup}>
              <input
                type="email"
                id="email"
                className={styles.inputField}
                placeholder="Enter your SKEMA mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FaUser className={styles.inputIcon} size={20} />
            </div>
          )}

          {/* Code input visible if code IS sent */}
          {isCodeSent && (
            <div className={styles.inputContainer}>
            <FaArrowLeft 
              onClick={handleReset} 
              className={styles.outsideIcon} 
              size={20} 
              style={{
                position: 'relative',
                top: '-10px',       // Adjust this value to position the arrow above the input field
                left: '0px',          // Position it to the left
                cursor: 'pointer',  // Make it clickable
                marginBottom: '10px' // Adjust the space between the arrow and input
              }} 
            />
            <div className={styles.inputGroup}>
              <input
                type="text"
                id="code"
                className={styles.inputField}
                placeholder="Enter the code received via email"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <FaLock className={styles.inputIcon} size={20} />
            </div>
            </div>
          )}

          
          {/* {error && <p className={styles.errorText}>{error}</p>} */}

          <button type="submit" className={styles.submitBtn}>
            {isCodeSent ? 'Confirm' : 'Login'}
          </button>
        </form>
        {isCodeSent && wrongCode && (
            <div className={styles.errorText}>Wrong code. Please try again!</div>
          )}

        {/* Timer for code resend */}
        {isCodeSent && !isConfirmed && (
          <div className={styles.actionGroup} style={{ marginTop: '1rem' }}>
            {canResend ? (
              <button
                onClick={handleResendCode}
                className={styles.resendCodeBtn}
              >
                Resend code
                <FaSyncAlt className={styles.resendIcon} size={14} style={{ marginLeft: '5px' }} />
                
              </button>
            ) : (
              <div className={styles.timerContainer}> {/* Added container div */}
                <FaHourglassHalf 
                  className={styles.timeIcon} 
                  size={20} 
                />
                <p className={styles.countdownText}>{countdown} seconds remaining</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default LoginForm;
