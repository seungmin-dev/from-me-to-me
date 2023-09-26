import { useSession } from "next-auth/react";

export const PostBox = () => {
  const session = useSession();
  return (
    <>
      <div>post box</div>
    </>
  );
};
