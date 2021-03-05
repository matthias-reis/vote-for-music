import styled from 'styled-components';
import { Entry } from './entry';

export const List = () => (
  <Wrapper>
    <Entries>
      <Entry />
      <Entry />
      <Entry />
      <Entry />
      <Entry />
      <Entry />
      <Entry />
      <Entry />
      <Entry />
      <Entry />
    </Entries>
  </Wrapper>
);

const Wrapper = styled.div`
  flex: 1;
  overflow-y: scroll;
  padding: 8px;
`;

const Entries = styled.ul`
  padding: 0;
  list-style: none;
`;
