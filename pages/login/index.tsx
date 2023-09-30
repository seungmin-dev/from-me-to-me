import styled from "@emotion/styled";
import { signIn } from "next-auth/react";
import kakaoBtn from "../../public/kakao_login_large_narrow.png";
import Image from "next/image";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;
const Emoji = styled.h1`
  font-size: 50px;
`;
const Title = styled.h2``;
const Button = styled.button`
  cursor: pointer;
  width: 180px;
  height: 40px;
  border: none;
  border-radius: 10px;
  img {
    width: 180px;
    height: auto;
  }
`;
export default function LoginPage(): JSX.Element {
  return (
    <>
      <div></div>
      <Wrapper>
        <Emoji>📬</Emoji>
        <Title>From Me To Me ...</Title>
        <Button onClick={() => signIn("kakao")}>
          <Image src={kakaoBtn} alt="카카오 로그인 버튼" />
        </Button>
      </Wrapper>
      <div></div>
    </>
  );
}
