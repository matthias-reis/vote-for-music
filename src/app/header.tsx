import { useRef, useCallback, FC } from 'react';
import styled from 'styled-components';
import { Logo as UnstyledLogo } from './logo';

const HEIGHT = 72;

type HeaderProps = {
  onChange: (value: number) => void;
  onVote: () => void;
  vote: number | null;
};

export const Header: FC<HeaderProps> = ({ vote, onChange, onVote }) => {
  const inputEl = useRef<HTMLInputElement>(null);
  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(inputEl.current?.value ?? '') ?? null;
      onChange(value);
    },
    [inputEl, onChange]
  );
  const handleSubmit = useCallback(
    (ev: React.FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      onVote();
    },
    [onVote]
  );
  return (
    <Wrapper>
      <Logo />
      <form onSubmit={handleSubmit}>
        <Input ref={inputEl} onChange={handleChange} value={`${vote || ''}`} />
      </form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: ${HEIGHT}px;
  border-bottom: 2px solid #fff4;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(UnstyledLogo)`
  margin-left: 8px;
`;

const Input = styled.input`
  margin-right: 8px;
  border-radius: 8px;
  border: 1px solid #fff4;
  background: #fff1;
  height: ${HEIGHT - 2 * 8}px;
  width: ${HEIGHT}px;
  color: #fff;
  font-size: 36px;
  font-family: 'Dosis', sans-serif;
  text-align: center;

  &:focus {
    outline: 0;
  }
`;
