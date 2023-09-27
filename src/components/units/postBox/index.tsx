import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { db } from "../../../../firestore";
import styled from "@emotion/styled";

interface ILetter {
  id: string;
  username: string;
  contents: string;
  createdAt: number;
  futureAt: number;
  photo: string;
}

const toDate = (date: number) => {
  return new Date(date).toJSON().slice(0, 10);
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Letter = styled.div`
  width: 100%;
  padding: 20px;
  border: 2px solid #db2a0b;
  border-radius: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 30px 2fr 30px;
  gap: 10px;
`;
const Title = styled.h3`
  &:last-child {
    text-align: right;
  }
`;
const RDate = styled.span`
  text-align: right;
`;
const Contents = styled.div`
  width: 100%;
  height: 100%;
  grid-column-start: 1;
  grid-column-end: -1;
  padding: 20px 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 130px;
  gap: 15px;
  align-items: center;
`;
const Text = styled.span`
  word-wrap: break-word;
`;
const Image = styled.img`
  width: 130px;
  height: 130px;
  border-radius: 15px;
`;

const SDate = styled.span``;

export const PostBox = () => {
  const { data: session } = useSession();
  const [letterList, setLetterList] = useState<ILetter[]>([]);

  const fetchLetters = async () => {
    const letterQuery = query(
      collection(db, "letters"),
      where("useremail", "==", session?.user?.email),
      where("send", "==", true),
      orderBy("futureAt", "desc")
    );
    const snapshot = await getDocs(letterQuery);
    const letters = snapshot.docs.map((doc) => {
      const { username, contents, createdAt, futureAt, photo } = doc.data();
      return {
        id: doc.id,
        username,
        contents,
        createdAt,
        futureAt,
        photo,
      };
    });
    setLetterList(letters);
  };
  useEffect(() => {
    if (session) fetchLetters();
  }, [session]);
  return (
    <>
      <Wrapper>
        {letterList.map((letter) => (
          <Letter key={letter.id}>
            <Title>To Me...</Title>
            <RDate>보낸 날짜 : {toDate(letter.createdAt)}</RDate>
            <Contents>
              <Text>{letter.contents}</Text>
              {letter.photo ? <Image src={letter.photo} /> : null}
            </Contents>
            <SDate>받은 날짜 : {toDate(letter.futureAt)}</SDate>
            <Title>From Me...</Title>
          </Letter>
        ))}
      </Wrapper>
    </>
  );
};
