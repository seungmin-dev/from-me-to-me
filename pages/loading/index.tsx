import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firestore";
import { useSetRecoilState } from "recoil";
import { userInfoState } from "../../src/commons/stores";

export default function LoadingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const setUserinfo = useSetRecoilState(userInfoState);

  const redirectUser = async () => {
    const array = [];

    const userQuery = query(
      collection(db, "users"),
      where("userEmail", "==", session?.user?.email)
    );

    const snapshot = await getDocs(userQuery);
    snapshot.forEach((doc) => array.push({ ...doc.data() }));

    const newUser = {
      userEmail: session?.user?.email,
      userName: session?.user?.name,
      userImage: session?.user?.image,
    };

    if (array.length < 1) {
      await setDoc(doc(db, "users", session!.user!.email!), newUser);
    }

    setUserinfo({
      email: newUser.userEmail!,
      name: newUser.userName!,
      image: newUser.userImage!,
    });

    router.push("/");
  };

  useEffect(() => {
    if (session) redirectUser();
  }, [session]);

  return <h1>loading...</h1>;
}
