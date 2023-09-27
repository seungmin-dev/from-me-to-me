import { signIn } from "next-auth/react";

export default function LoginPage(): JSX.Element {
  return (
    <>
      <h1>login</h1>
      <button onClick={() => signIn("kakao")}>카카오로 시작하기</button>
    </>
  );
}
