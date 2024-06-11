import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { ContractorPost, RequestType, User } from "../utils/types";

const configs = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.PROJECT_ID,
  storageBucket: import.meta.env.STORAGE_BUCKET,
  messagingSenderId: import.meta.env.MESSAGING_SENDER_ID,
  appId: import.meta.env.APP_ID,
};

const app = initializeApp(configs);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export function firebaseSignout() {
  signOut(auth);
}

export async function createAccount(
  email: string,
  password: string,
  type: number,
  name: string
) {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const userCreds = res.user;
  const docRef = doc(db, "userdetails", userCreds.uid);
  await setDoc(docRef, { type, name });
  const user: User = {
    email: res.user.email || "",
    name,
    type,
    id: userCreds.uid,
  };
  return user;
}

export async function login(email: string, password: string) {
  const userCreds = (await signInWithEmailAndPassword(auth, email, password))
    .user;
  const docRef = doc(db, "userdetails", userCreds.uid);
  const response = await getDoc(docRef);
  const userdetails = { ...response.data() } as { type: number; name: string };
  const user: User = {
    email: userCreds.email || "",
    name: userdetails.name,
    type: userdetails.type,
    id: userCreds.uid,
  };
  return user;
}

export async function createContratorPost(
  uid: string,
  title: string,
  phone: string,
  description: string,
  labourCount: number
) {
  const docRef = doc(db, "contractorposts", uid);
  await setDoc(docRef, { title, phone, description, labourCount });
}

export async function updateContractorPost(
  uid: string,
  dataToUpdate: {
    title?: string;
    phone?: string;
    description?: string;
    labourCount?: number;
  }
) {
  const docRef = doc(db, "contractorposts", uid);
  await updateDoc(docRef, dataToUpdate);
}

export async function getContractorPost(uid: string) {
  const docRef = doc(db, "contractorposts", uid);
  const response = await getDoc(docRef);
  const postDetails = { ...response.data() };
  if (Object.keys(postDetails).length === 0) {
    throw { code: "empty" };
  }
  const UserPost = { ...postDetails, id: response.id } as ContractorPost;
  return UserPost;
}

export async function getAllContractorPost() {
  const collectionRef = collection(db, "contractorposts");
  const snapShot = await getDocs(collectionRef);
  const documents = snapShot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ContractorPost[];
  return documents;
}

export const REQUEST_STATUS = {
  PENDING: 1,
  ACCEPTED: 2,
  REJECTED: 3,
};

export async function createRequest(
  uid: string,
  postId: string,
  senderName: string
) {
  await addDoc(collection(db, "requests"), {
    senderId: uid,
    receiverId: postId,
    status: REQUEST_STATUS.PENDING,
    senderName,
  });
}

type RequestStatus = 1 | 2 | 3;
export async function updateRequestStatus(id: string, status: RequestStatus) {
  const docRef = doc(db, "requests", id);
  await updateDoc(docRef, { status });
}

export async function getReceivedRequests(uid: string) {
  const receiverQuery = query(
    collection(db, "requests"),
    where("receiverId", "==", uid)
  );
  const querySnapshot = await getDocs(receiverQuery);
  const requests = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as RequestType[];

  return requests;
}

export async function getSendedrequests(uid: string) {
  const senderQuery = query(
    collection(db, "requests"),
    where("senderId", "==", uid)
  );
  const querySnapshot = await getDocs(senderQuery);
  const requests = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as RequestType[];

  return requests;
}
