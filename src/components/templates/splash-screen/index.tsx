import styles from '@/shared/styles/components/splash-screen.module.css';

export const SplashScreen = () => {
  return (
    <div className={styles['splash-screen']}>
      <div className={styles['splash-screen-logo']} />
      <p className={styles['splash-screen-copyright']}>
        All rights reserved
        <br />
        Copyright &copy; {new Date().getFullYear()} PT Dharma Polimetal Tbk
      </p>
    </div>
  );
};
