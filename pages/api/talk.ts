import axios from "axios";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
  doc,
} from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import qs from "qs";
import { db } from "../../firestore";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { accessToken } = req.query;
  const { useremail } = req.query;

  // 매일 오전 9시마다 cron job(예정)
  // db에서 futureAt이 현재보다 이전인 문서들을 대상으로
  const sendQuery = query(
    collection(db, "letters"),
    where("useremail", "==", useremail),
    where("send", "==", false),
    where("futureAt", "<=", new Date().getTime())
  );
  const snapshot = await getDocs(sendQuery);

  console.log("------------------------------");
  console.log("카톡 발송 대상 문서 ", snapshot.docs.length, " 건");
  console.log("------------------------------");

  snapshot.docs.map(async (docu) => {
    const { contents, photo } = docu.data();

    // db의 내용, 이미지를 파라미터로 카톡 보내기
    const getting = (contents: string, photo: string) =>
      axios
        .post(
          "https://kapi.kakao.com/v2/api/talk/memo/default/send",
          qs.stringify({
            template_object: JSON.stringify({
              object_type: "feed",
              content: {
                title: "편지가 도착했어요",
                description: `${contents.slice(0, 30)}...`,
                image_url: photo ?? "",
                image_widht: 600,
                image_height: 600,
                link: {
                  web_url: "http://localhost:3000/",
                  mobile_web_url: "http://localhost:3000/",
                },
              },
              button_title: "우체통 확인하기",
            }),
          }),
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => res.data);

    const { result_code } = await getting(contents, photo);
    // result_code가 0으로 들어왔다면
    // db에서 send를 true로 update
    if (!result_code) {
      const docRef = doc(db, "letters", docu.id);
      await updateDoc(docRef, {
        send: true,
      });

      console.log("------------------------------");
      console.log(docu.id, " 건 카톡 발송 완료!");
      console.log("------------------------------");
    }
  });

  res.json({ status: 200 });
}

export default handler;
