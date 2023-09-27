import styled from "@emotion/styled";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { db, storage } from "../../../../firestore";
import { useRecoilState } from "recoil";
import { userInfoState } from "../../../commons/stores";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useSession } from "next-auth/react";

const Wrapper = styled.div`
  padding: 30px 10px;
`;
const TypeWrapper = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  margin-bottom: 10px;
`;
const Type = styled.div`
  cursor: pointer;
  width: 50%;
  height: 100%;
  line-height: 46px;
  text-align: center;
  background-color: ${(props: ITypeProps) =>
    props.isActive ? "#db2a0b" : "white"};
  color: ${(props: ITypeProps) => (props.isActive ? "white" : "#db2a0b")};
  border: 2px solid #db2a0b;
  &:hover {
    opacity: ${(props: ITypeProps) => (props.isActive ? "0.9" : "1")};
  }
  &:first-of-type {
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
  }
  &:last-of-type {
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
  }
`;
interface ITypeProps {
  isActive: boolean;
}
const DateWrapper = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  input {
    border: 2px solid #db2a0b;
    height: 40px;
    margin-right: 10px;
    &:hover,
    &:focus,
    &:active,
    &:focus-within,
    &:focus-visible {
      border: 2px solid #db2a0b;
    }
  }
`;
const DdayInput = styled.input`
  border-radius: 15px;
  width: 60px;
  padding: 10px;
  margin: 0 10px;
`;
const DateInput = styled.input`
  cursor: pointer;
  border-radius: 15px;
  padding: 10px 20px;
`;
const Title = styled.h2`
  margin-bottom: 20px;
`;
const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
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
const Button = styled.input`
  width: 100%;
  background-color: #db2a0b;
  border: none;
  color: white;
  padding: 15px 0;
  border-radius: 15px;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;
const AttachFileButton = styled.label`
  width: 100%;
  padding: 10px 0px;
  margin-bottom: 10px;
  color: #db2a0b;
  text-align: center;
  border-radius: 15px;
  border: 2px solid #db2a0b;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;
const AttachFileInput = styled.input`
  display: none;
`;

export const Write = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(true);
  const newDate = new Date().toJSON().slice(0, 10);
  const [dday, setDday] = useState("100");
  const [date, setDate] = useState(newDate);
  const [contents, setContents] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [userinfo] = useRecoilState(userInfoState);

  const onClickType = (): void => {
    setType((prev) => !prev);
  };
  const onChangeDday = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDday(e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"));
    return (e.target.value = e.target.value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1"));
  };
  const onChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setContents(e.target.value);
  };
  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      if (files[0].size > 1024 ** 2) {
        alert("이미지 파일은 1MB까지 업로드할 수 있어요 😫");
        return;
      }
      setFile(files[0]);
    }
  };
  const onClickSubmit = async (): Promise<void> => {
    try {
      setLoading(true);
      if (!contents.length) {
        alert("편지를 작성해야 보낼 수 있어요 🤨");
        return;
      }
      let futureAt;
      const curDate = new Date();
      if (type) {
        //디데이 타입
        curDate.setDate(new Date().getDate() + Number(dday));
        futureAt = curDate.getTime();
      } else {
        //특정일 타입
        futureAt = new Date(date).getTime();
      }
      const doc = await addDoc(collection(db, "letters"), {
        contents,
        createdAt: Date.now(),
        futureAt,
        username: userinfo.name,
        useremail: userinfo.email,
        send: false,
      });
      if (file) {
        const locationRef = ref(storage, `letters/${userinfo.email}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photo: url,
        });
      }
      setContents("");
      setFile(null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Wrapper>
      <Title>💌 편지 쓰기</Title>
      <TypeWrapper>
        <Type onClick={onClickType} isActive={type}>
          디데이
        </Type>
        <Type onClick={onClickType} isActive={!type}>
          특정한 날
        </Type>
      </TypeWrapper>
      <DateWrapper>
        {type ? (
          <>
            <span>
              오늘부터
              <DdayInput
                type="text"
                defaultValue={dday}
                maxLength={4}
                onChange={onChangeDday}
              />
              일 뒤에 받기
            </span>
          </>
        ) : (
          <>
            <span>
              <DateInput
                type="date"
                defaultValue={date}
                onChange={onChangeDate}
              />
              에 받기
            </span>
          </>
        )}
      </DateWrapper>
      <Form>
        <Textarea
          onChange={onChange}
          value={contents}
          rows={10}
          placeholder={`미래의 ${session?.user?.name}에게...`}
        />
        <AttachFileButton htmlFor="file">
          {file ? "✔️" : "사진 업로드"}
        </AttachFileButton>
        <AttachFileInput
          type="file"
          onChange={onChangeFile}
          id="file"
          accept="image/*"
        />
        <Button
          onClick={onClickSubmit}
          defaultValue={loading ? "미래로 보내는 중..." : "발송 !"}
        />
      </Form>
    </Wrapper>
  );
};
