import styles from "./homeStyle.module.css";
import { useAppSelector } from "../../store/store";
import { selectUser } from "../../store/userSlice";
import { Customer } from "./customer";
import { Contractor } from "./contractor";

const USER_TYPE = {
  CUSTOMER: 1,
  CONTRACTOR: 2,
};

export const Home = () => {
  const user = useAppSelector(selectUser);

  return (
    <div className={styles.home}>
      {user?.type === USER_TYPE.CUSTOMER && <Customer />}

      {user?.type === USER_TYPE.CONTRACTOR && <Contractor />}
    </div>
  );
};
