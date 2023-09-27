import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const userInfoState = atom({
  key: "userInfoState",
  default: {
    email: "",
    name: "",
    image: "",
  },
  effects_UNSTABLE: [persistAtom],
});
