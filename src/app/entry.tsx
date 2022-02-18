import { FC } from 'react';
import styled from 'styled-components';
import { Song } from '.';

export const Entry: FC<{ entry: Song; onClick: () => void }> = ({
  entry,
  onClick,
}) => {
  console.log(entry);
  return (
    <Wrapper
      onClick={onClick}
      title={entry.votes.map((e) => e.vote).join(', ')}
    >
      <Number>{entry.rank}.</Number>
      <Identifier>
        <Band>{entry.artist}</Band>
        <Title>{entry.title}</Title>
      </Identifier>
      <Value>{entry.value?.toFixed(1) ?? '--'}</Value>
    </Wrapper>
  );
};

export const Ellipsis = () => (
  <Wrapper>
    <Dots>...</Dots>
  </Wrapper>
);

const Dots = styled.span`
  color: #fff8;
  font-size: 48px;
  align-self: center;
  justify-self: center;
`;

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
const Identifier = styled.div`
  flex: 1 1 auto;
  overflow: hidden;
  font-size: 16px;
  line-height: 1.25;
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
  font-size: 14px;
`;
const Value = styled.div`
  font-size: 14px;
  width: 52px;
  flex: 0 0 auto;
  text-align: right;
`;
