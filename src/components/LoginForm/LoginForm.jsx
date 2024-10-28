import { useState, useEffect, useContext } from "react";
import {
  FaUser,
  FaArrowLeft,
  FaHourglassHalf,
  FaLock,
  FaSyncAlt,
} from "react-icons/fa";
import styles from "./LoginPage.module.css";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { useTranslation } from 'react-i18next';

const useTypewriterEffect = (text, duration) => {
  const [displayedText, setDisplayedText] = useState("");
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
  const { email, setEmail, isAuthenticated, setIsAuthenticated } =
    useContext(AppContext);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [wrongCode, setWrongCode] = useState(false);
  const navigate = useNavigate();
  const [isSkemaDomain, setIsSkemaDomain] = useState(true);
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const { t } = useTranslation();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return false;
    }
    return email.endsWith("@skema.edu");
  };

  // Clear email and code when the component mounts (e.g., after logout)
  useEffect(() => {
    setEmail("");
    setCode("");
  }, []);

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
      navigate("/PlatformPage");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 480);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displayedText = useTypewriterEffect(t('welcome_message'), 15000);

  const sendVerificationCode = async (email) => {
    try {
      const response = await fetch(`${baseUrl}/auth/send-verification-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send verification code");
      }

      return true;
    } catch (error) {
      setError("Failed to send verification code. Please try again.");
      return false;
    }
  };

  const verifyCode = async (email, code) => {
    try {
      const response = await fetch(`${baseUrl}/auth/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (data.statut === true && data.user_id) {
        // Store user_id in sessionStorage instead of email
        sessionStorage.setItem("user_id", data.user_id);

        return true;
      }

      return false;
    } catch (error) {
      console.error("Error verifying code:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setIsSkemaDomain(false);
      setError("Please use SKEMA email!");
      return;
    }

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

        sessionStorage.setItem("userEmail", email);
        // Naviguer vers la page platform
        navigate("/PlatformPage");
      } else {
        setWrongCode(true);
        setError("Wrong code. Please try again.");
      }
    }
  };

  const handleResendCode = async () => {
    const codeSent = await sendVerificationCode(email);
    if (codeSent) {
      setCountdown(60);
      setCanResend(false);
      setIsConfirmed(false);
      setWrongCode(false);
    }
  };

  const handleReset = () => {
    setEmail("");
    setCode("");
    setIsCodeSent(false);
    setCountdown(60);
    setCanResend(false);
    setIsConfirmed(false);
    setWrongCode(false);
    setError("");
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.animatedText}>{displayedText}</div>
      <div className={styles.loginFormBox}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>{t('login')} :</h2>
        </div>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {/* Email input visible if code is NOT sent */}
          {!isCodeSent && (
            <div className={styles.inputGroup}>
              <input
                type="email"
                id="email"
                className={styles.inputField}
                placeholder={t('input_mail')}
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())} // Convert to lowercase
                required
              />
              <FaUser className={styles.inputIcon} size={20} />
            </div>
          )}

          {/* Code input visible if code IS sent */}
          {isCodeSent && (
            <div className={styles.inputContainer}>
              <div className={styles.iconAndEmail}>
                <FaArrowLeft
                  onClick={handleReset}
                  className={styles.outsideIcon}
                  size={20}
                />
                <span className={styles.emailText}>{email.toLowerCase()}</span>
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  id="code"
                  className={styles.inputField}
                  placeholder={t('input_code')}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
                <FaLock className={styles.inputIcon} size={20} />
              </div>
            </div>
          )}

          <button type="submit" className={styles.submitBtn}>
            {isCodeSent ? t('btn_confirm') : t('login')}
          </button>
        </form>
        {!isCodeSent && !isSkemaDomain && (
          <div className={styles.errorText}>{error}</div>
        )}
        {isCodeSent && wrongCode && (
          <div className={styles.errorText}>{t('error_code')}</div>
        )}

        {/* Timer for code resend */}
        {isCodeSent && !isConfirmed && (
          <div className={styles.actionGroup} style={{ marginTop: "1rem" }}>
            {canResend ? (
              <button
                onClick={handleResendCode}
                className={styles.resendCodeBtn}
              >
                {t('resend')}
                <FaSyncAlt
                  className={styles.resendIcon}
                  size={14}
                  style={{ marginLeft: "5px" }}
                />
              </button>
            ) : (
              <div className={styles.timerContainer}>
                <FaHourglassHalf className={styles.timeIcon} size={20} />
                <p className={styles.countdownText}>
                  {countdown} {t('time')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
