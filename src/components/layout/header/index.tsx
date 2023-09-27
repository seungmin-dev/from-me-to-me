import styled from "@emotion/styled";
import { signOut } from "next-auth/react";
import { useRecoilState } from "recoil";
import { userInfoState } from "../../../commons/stores";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #db2a0b;
`;
const Greet = styled.span`
  font-size: 20px;
`;
const Name = styled.span`
  font-weight: 600;
`;
const Button = styled.button`
  border: 2px solid #db2a0b;
  background-color: white;
  border-radius: 30px;
  padding: 10px 20px;
  color: #db2a0b;
  font-weight: bold;
  cursor: pointer;
  &:hover,
  &:focus {
    /* background-color: #db2a0b;
    opacity: 0.8; */
  }
`;
export const HeaderLayout = () => {
  const [userinfo] = useRecoilState(userInfoState);
  return (
    <Wrapper>
      {userinfo.email !== "" ? (
        <>
          <Greet>
            <Name>{userinfo.name}</Name>님, 좋은 하루 되세요 😊
          </Greet>
          <Button onClick={() => signOut()}>로그아웃</Button>
        </>
      ) : null}
    </Wrapper>
  );
};
