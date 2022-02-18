import styled from 'styled-components';
import { FC } from 'react';
import { Entry, Ellipsis } from './entry';
import type { EntryList, ListItem } from '.';

export const List: FC<{
  entries: EntryList;
  onEntryClick: (trackId: string) => void;
}> = ({ entries, onEntryClick }) => (
  <Wrapper>
    <Entries>
      {entries.map((item: ListItem, i: number) => {
        if (item.type === 'ellipsis') {
          return <Ellipsis key={i} />;
        } else {
          return (
            <Entry
              onClick={() => onEntryClick(item.trackId)}
              entry={item}
              key={i}
            />
          );
        }
      })}
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
