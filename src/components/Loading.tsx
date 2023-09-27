import styled from "@emotion/styled";

const Wrapper = styled.div`
  width: 100%;
  max-width: 600px;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Text = styled.h1``;

export const Loading = () => {
  return (
    <Wrapper>
      <Text>Loading</Text>
    </Wrapper>
  );
};
