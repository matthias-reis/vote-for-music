import styled from 'styled-components';

export const Entry = () => (
  <Wrapper>
    <Number>24.</Number>
    <Song>
      <Band>We Lost The Sea</Band>
      <Title>Challenger, Pt. 2 Challenger, Pt. 2 Challenger, Pt. 2</Title>
    </Song>
    <Value>128.2 %</Value>
  </Wrapper>
);

const Wrapper = styled.li`
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #fff2;
  margin-bottom: 8px;
`;

const Number = styled.div`
  width: 36px;
  font-size: 14px;
  flex: 0 0 auto;
`;
const Song = styled.div`
  flex: 1 1 auto;
  overflow: hidden;
`;
const Band = styled.div`
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const Title = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const Value = styled.div`
  font-size: 14px;
  width: 52px;
  flex: 0 0 auto;
  text-align: right;
`;
