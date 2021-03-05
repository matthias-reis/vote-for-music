import { useState, useCallback } from 'react';

import { Container } from './container';
import { Header } from './header';
import { Search } from './search';
import { List } from './list';

const { ipcRenderer } = require('electron');

export const App = () => {
  const [search, setSearch] = useState<string>('');
  const [vote, setVote] = useState<number | null>(null);

  const handleVote = useCallback(() => {
    console.log('submit', vote);

    ipcRenderer.invoke('vote', vote);

    //reset the inputs
    setVote(null);
    setSearch('');
  }, [setVote, setSearch, vote]);

  const handleSearchChange = useCallback(
    (query) => {
      setSearch(query);
      ipcRenderer.invoke('search', query);
    },
    [setSearch]
  );

  return (
    <Container>
      <Header onChange={setVote} onVote={handleVote} vote={vote} />
      <Search onChange={handleSearchChange} value={search} />
      <List />
    </Container>
  );
};
