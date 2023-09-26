import styled from "@emotion/styled";
import Link from "next/link";
import { useRouter } from "next/router";
import { HeaderLayout } from "./header";

interface ILayoutProps {
  children: JSX.Element;
}

const MENU = [
  { name: "우체통", page: "/" },
  { name: "새 편지", page: "/write" },
  { name: "프로필", page: "/profile" },
];

const Wrapper = styled.div`
  width: 100%;
  max-width: 600px;
  height: 100vh;
  margin: 0 auto;
  display: grid;
  grid-template-rows: 0.3fr 5fr 0.3fr;
`;
const Menu = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #db2a0b;
  border-top-right-radius: 30px;
  border-top-left-radius: 30px;
`;
const MenuItem = styled.div<IMenuProps>`
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  padding: 30px;
  color: ${(props: IMenuProps) => (props.isActive ? "white" : "#961a05")};
`;
type IMenuProps = {
  isActive: boolean;
};
export const Layout = (props: ILayoutProps) => {
  const router = useRouter();
  return (
    <Wrapper>
      <HeaderLayout />
      {props.children}
      {router.pathname !== "/login" ? (
        <Menu>
          {MENU.map((el, i) => (
            <Link href={el.page} key={i}>
              <MenuItem isActive={router.pathname === el.page}>
                {el.name}
              </MenuItem>
            </Link>
          ))}
        </Menu>
      ) : null}
    </Wrapper>
  );
};
