import { useRef, useCallback, FC } from 'react';
import styled from 'styled-components';
import { SearchIcon } from './search-icon';

const HEIGHT = 44;

type SearchProps = {
  onChange: (value: string) => void;
  value: string;
};

export const Search: FC<SearchProps> = ({ onChange, value }) => {
  const inputEl = useRef<HTMLInputElement>(null);
  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const value = inputEl.current?.value ?? '';
      onChange(value);
    },
    [inputEl, onChange]
  );
  return (
    <Wrapper>
      <Input ref={inputEl} onChange={handleChange} value={value} />
      <SearchIcon />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: ${HEIGHT}px;
  padding: 0 8px;
  border-bottom: 2px solid #fff4;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Input = styled.input`
  background: none;
  border: none;
  flex: 1;
  height: ${HEIGHT}px;
  color: #fff;
  font-size: 24px;
  font-family: 'Dosis', sans-serif;

  &:focus {
    outline: 0;
  }
`;
