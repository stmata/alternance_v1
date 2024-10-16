import styles from './ErrorPage.module.css'; 


const ErrorPage = () => {
  return (
    <div className={styles.errorContainer}>
      <h1 className={styles.msgError}>404 - Page not found</h1>
    </div>
  );
};

export default ErrorPage;
