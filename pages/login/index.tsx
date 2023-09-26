import { useSession, signIn } from "next-auth/react";
import { createUserInfo, getUserFromKakao } from "../api/user";

export default function LoginPage() {
  const { data: session } = useSession();
  if (session) {
    const result = getUserFromKakao(session.accessToken!).then((response) => {
      createUserInfo(response);
    });
  }
  return (
    <>
      <h1>login</h1>
      <button onClick={() => signIn()}>카카오로 시작하기</button>
    </>
  );
}
