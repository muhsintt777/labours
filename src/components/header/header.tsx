import { Avatar, Menu, MenuItem } from "@mui/material";
import styles from "./style.module.css";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { logout, selectUser, selectUserApiStatus } from "../../store/userSlice";
import AnoProfileImg from "assets/images/ano_profile.png";
import { MouseEvent, useState } from "react";

export const Header = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const userApiStatus = useAppSelector(selectUserApiStatus);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleLogout() {
    dispatch(logout());
    handleClose();
  }

  return (
    <header className={styles.container}>
      <div className={styles.company}>
        <h1>Labor Link Connect</h1>
      </div>
      {userApiStatus === "successfull" && user && (
        <>
          <div className={styles.profile} onClick={(e) => handleClick(e)}>
            <Avatar alt="Remy Sharp" src={AnoProfileImg} />
            <h3>{user.name}</h3>
          </div>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem sx={{ color: "red" }} onClick={handleLogout}>
              Logout
            </MenuItem>
          </Menu>
        </>
      )}
    </header>
  );
};
