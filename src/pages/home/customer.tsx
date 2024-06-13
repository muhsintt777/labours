import { Button, Chip, CircularProgress } from "@mui/material";
import styles from "./customerStyle.module.css";
import { useEffect, useState } from "react";
import { ContractorPost, RequestType } from "../../utils/types";
import {
  REQUEST_STATUS,
  createRequest,
  getAllContractorPost,
  getSendedrequests,
} from "../../configs/firebase";
import { useAppSelector } from "../../store/store";
import { selectUser } from "../../store/userSlice";
import { ERROR_MESSAGES } from "utils/constants";

const API_STATUS = {
  IDLE: 1,
  LOADING: 2,
  FAILED: 3,
  SUCCESS: 4,
  NO_DATA: 5,
};

interface ContractorPostWithRequestStatus extends ContractorPost {
  requestStatus: 1 | 2 | 3 | undefined;
}

export const Customer = () => {
  const user = useAppSelector(selectUser);
  const [allPost, setAllPost] = useState<ContractorPostWithRequestStatus[]>([]);
  const [allPostApiStatus, setAllPostApiStatus] = useState(API_STATUS.LOADING);

  function addRequestStatus(posts: ContractorPost[], requests: RequestType[]) {
    const updatedPosts = posts.map((item) => {
      const currPostReq = requests.find((itm) => item.id === itm.receiverId);
      const newPost = { ...item, requestStatus: currPostReq?.status };
      return newPost;
    });
    return updatedPosts;
  }

  async function handleRequestSend(postId: string) {
    if (!user) return;
    try {
      await createRequest(user.id, postId, user.name);
      const updatedPosts = allPost.map((item) => {
        if (item.id === postId) {
          item.requestStatus = 1;
        }
        return item;
      });
      setAllPost(updatedPosts);
    } catch (error) {
      //
    }
  }

  function renderDescriptionChips(description: string) {
    const splitArr = description.split(",");
    return (
      <>
        {splitArr.map((item, i) => (
          <Chip key={i} label={item} variant="outlined" />
        ))}
      </>
    );
  }

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const [posts, requests] = await Promise.all([
          getAllContractorPost(),
          getSendedrequests(user.id),
        ]);
        if (!posts.length) throw new Error(ERROR_MESSAGES.EMPTY_RESPONSE);

        const statusUpdatedPosts = addRequestStatus(posts, requests);
        setAllPost(statusUpdatedPosts);
        setAllPostApiStatus(API_STATUS.SUCCESS);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === ERROR_MESSAGES.EMPTY_RESPONSE
        ) {
          setAllPostApiStatus(API_STATUS.NO_DATA);
        } else {
          setAllPostApiStatus(API_STATUS.FAILED);
        }
      }
    })();
  }, [user]);
  return (
    <>
      {allPostApiStatus === API_STATUS.LOADING && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </div>
      )}

      {allPostApiStatus === API_STATUS.SUCCESS &&
        allPost.map((item) => (
          <div
            key={item.id}
            className={styles.box1}
            style={{ marginBottom: "10px" }}
          >
            <h3>{item.title}</h3>
            <div className={styles.chips}>
              {renderDescriptionChips(item.description)}
            </div>
            <p>Labours: {item.labourCount}</p>
            {item.requestStatus === REQUEST_STATUS.ACCEPTED ? (
              <p>Contact: {item.phone}</p>
            ) : (
              <p>Contact: + ## #### ### ###</p>
            )}
            <div className={styles.btnwrapper}>
              <Button
                sx={{
                  color: "black",
                  backgroundColor: "#48cae4",
                  ":hover": { backgroundColor: "#00b4d8" },
                }}
                onClick={() => {
                  if (!item.requestStatus) {
                    handleRequestSend(item.id);
                  }
                }}
              >
                {item.requestStatus === REQUEST_STATUS.PENDING && "Pending"}
                {item.requestStatus === REQUEST_STATUS.ACCEPTED && "Accepted"}
                {item.requestStatus === REQUEST_STATUS.REJECTED && "Rejected"}
                {!item.requestStatus && "Request"}
              </Button>
            </div>
          </div>
        ))}

      {allPostApiStatus === API_STATUS.NO_DATA && <p>No active posts</p>}
    </>
  );
};
