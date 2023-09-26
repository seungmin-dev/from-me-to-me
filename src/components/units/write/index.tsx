import styled from "@emotion/styled";
import { addDoc, collection } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { db } from "../../../../firestore";

const Wrapper = styled.div`
  padding: 30px 10px;
`;
const Title = styled.h2`
  margin-bottom: 20px;
`;
const Textarea = styled.textarea`
  border: 2px solid #db2a0b;
  padding: 20px 15px;
  font-size: 16px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  width: 100%;
  resize: none;
  border-radius: 20px;
  margin-bottom: 10px;
  &::placeholder {
    font-size: 16px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }
  &:focus {
    outline: none;
    border-color: #db2a0b;
  }
`;
const Button = styled.button`
  width: 100%;
  background-color: #db2a0b;
  border: none;
  color: white;
  padding: 15px 0;
  border-radius: 15px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  &:focus,
  &:hover {
    opacity: 0.9;
  }
`;

export const Write = () => {
  const { data } = useSession();
  const [loading, setLoading] = useState(false);
  const [contents, setContents] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setContents(e.target.value);
  };
  const onClickSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      setLoading(true);
      if (!contents.length) {
        alert("편지를 작성해야 보낼 수 있어요 🤨");
        return;
      }
      await addDoc(collection(db, "letters"), {
        contents,
        createdAt: Date.now(),
        username: data?.user?.name,
      });
      setContents("");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Wrapper>
      <Title>💌 편지 쓰기</Title>
      <Textarea
        onChange={onChange}
        value={contents}
        rows={10}
        placeholder={`미래의 ${data?.user?.name}에게...`}
      />
      <Button onClick={onClickSubmit}>
        {loading ? "미래로 보내는 중..." : "발송 !"}
      </Button>
    </Wrapper>
  );
};
