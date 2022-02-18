import { FC } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

export const Container: FC = ({ children }) => (
  <Wrapper>
    <GlobalStyle />
    {children}
  </Wrapper>
);

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-size: 18px;
    font-family: "NeoTech", sans-serif;
    font-weight: 250;
  }
`;

const Wrapper = styled.div`
  background: #202028;
  height: 100vh;
  color: #e8e8f0;
  display: flex;
  flex-direction: column;
`;
