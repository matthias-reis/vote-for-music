import { useState, useCallback, useEffect } from 'react';

import { Container } from './container';
import { Header } from './header';
import { Search } from './search';
import { List } from './list';
import {
  sendVote,
  sendQuery,
  sendReset,
  register,
  receiveQuery,
} from './electron';

export const App = () => {
  const [search, setSearch] = useState<string>('');
  const [vote, setVote] = useState<number | null>(null);
  const [state, setState] = useState<EntryList>([]);

  useEffect(() => {
    sendReset();
  }, []);
  useEffect(() => {
    register((state: EntryList) => {
      setState(state);
    });
  }, [setState]);
  useEffect(() => {
    receiveQuery((query: string) => {
      setSearch(query);
    });
  }, [setState]);
  const handleVote = useCallback(() => {
    sendVote(vote);
    //reset the inputs
    setVote(null);
    setSearch('');
  }, [setVote, setSearch, vote]);

  const handleSearchChange = useCallback(
    (query) => {
      setSearch(query);
      sendQuery(query);
    },
    [setSearch]
  );

  const handleEntryClick = useCallback(
    (trackId) => {
      setSearch(`track: ${trackId}`);
      sendQuery(`track: ${trackId}`);
    },
    [setSearch]
  );

  return (
    <Container>
      <Header onChange={setVote} onVote={handleVote} vote={vote} />
      <Search onChange={handleSearchChange} value={search} />
      <List entries={state} onEntryClick={handleEntryClick} />
    </Container>
  );
};

export type Song = {
  type: 'entry';
  trackId: string;
  rank: number;
  artist: string;
  title: string;
  value: number;
  votes: { vote: number; date: string }[];
};

export type Ellipsis = { type: 'ellipsis' };

export type ListItem = Song | Ellipsis;

export type EntryList = ListItem[];
