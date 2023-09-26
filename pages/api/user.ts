import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firestore";

interface ISession {
  id: number;
  kakao_account: {
    email: string;
    profile: {
      nickname: string;
      profile_image_url: string;
      thumbnail_image_url: string;
    };
  };
}
export async function getUserFromKakao(accessToken: string) {
  const kakaoUrl = "https://kapi.kakao.com/v2/user/me";
  const response = await fetch(kakaoUrl, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.json());

  return response;
}

export async function createUserInfo(response: ISession) {
  const userQuery = query(
    collection(db, "users"),
    where("userId", "==", response.id)
  );
  const snapshot = await getDocs(userQuery);
  if (!snapshot.docs.length) {
    await setDoc(doc(db, "users", response.id.toString()), {
      userId: response.id,
      name: response.kakao_account.profile.nickname,
      profile_image: response.kakao_account.profile.profile_image_url,
    });
  }
}
