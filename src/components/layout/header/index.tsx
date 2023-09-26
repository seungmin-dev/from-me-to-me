import { signOut, useSession } from "next-auth/react";

export const HeaderLayout = () => {
  const session = useSession();
  return (
    <div>
      {session.data ? (
        <>
          <span>{session.data?.user?.name}</span>
          <button onClick={() => signOut()}>로그아웃</button>
        </>
      ) : null}
    </div>
  );
};
