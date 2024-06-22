import styles from "./auth-layoutStyle.module.css";
import { Outlet } from "react-router-dom";
import { Header } from "components/header/header";

export const AuthLayout = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.outlet}>
        <Outlet />
      </div>
    </div>
  );
};
