import { useRecoilState } from "recoil";
import { userInfoState } from "../../../commons/stores";
import styled from "@emotion/styled";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../firestore";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const Wrapper = styled.div`
  width: 100%;
  padding: 30px 10px;
  display: grid;
  grid-template-rows: 180px 100px;
  gap: 20px;
`;
const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;
const Picture = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 100%;
`;
const Name = styled.span`
  font-size: 20px;
  text-align: center;
  font-weight: 600;
`;
const CountWrapper = styled.div`
  width: 100%;
  padding: 20px 0;
  display: grid;
  justify-content: space-between;
  grid-template-columns: 1fr 1px 1fr;
  align-items: center;
`;
const CountType = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const CountTitle = styled.span`
  font-size: 18px;
`;
const Count = styled.span``;
const Line = styled.div`
  width: 100%;
  height: 100%;
  background-color: #bdbdbd;
`;

export const Profile = () => {
  const { data: session } = useSession();
  const [letterCount, setLetterCount] = useState(0);
  const [receivedLetterCount, setReceivedLetterCount] = useState(0);
  const [userInfo] = useRecoilState(userInfoState);

  const fetchLetters = async () => {
    const letterQuery = query(
      collection(db, "letters"),
      where("useremail", "==", session?.user?.email)
    );
    const snapshot = await getDocs(letterQuery);
    setLetterCount(snapshot.docs.length);
  };

  const fetchRLetters = async () => {
    const letterQuery = query(
      collection(db, "letters"),
      where("useremail", "==", session?.user?.email),
      where("send", "==", true)
    );
    const snapshot = await getDocs(letterQuery);
    setReceivedLetterCount(snapshot.docs.length);
  };
  useEffect(() => {
    if (session) {
      fetchLetters();
      fetchRLetters();
    }
  }, [session]);

  return (
    <Wrapper>
      <ProfileWrapper>
        {userInfo.image ? <Picture src={userInfo.image} /> : null}
        <Name>{userInfo.name}</Name>
      </ProfileWrapper>
      <CountWrapper>
        <CountType>
          <CountTitle>보낸 편지</CountTitle>
          <Count>{letterCount}</Count>
        </CountType>
        <Line />
        <CountType>
          <CountTitle>받은 편지</CountTitle>
          <Count>{receivedLetterCount}</Count>
        </CountType>
      </CountWrapper>
    </Wrapper>
  );
};
