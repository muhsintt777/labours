import { Header } from "../components/header/header";
import styles from "./primary-layoutStyle.module.css";
import { Outlet } from "react-router-dom";
// import { Header } from "components/header/header";
// import { SideNav } from "components/side-nav/side-nav";

export const PrimaryLayout = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.middle}>
        <div className={styles.nav}>
          {/* <SideNav /> */}
        </div>
        <div className={styles.outlet}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};