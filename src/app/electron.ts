import type { EntryList } from '.';

type ElectronGlobal = {
  send: (name: string, value?: string | number | null) => {};
  receive: (name: string, data: any) => {};
};
declare global {
  var electron: ElectronGlobal;
}

const electron = globalThis.electron;

export const register = (callback: (state: EntryList) => void) => {
  electron.receive('state', (_: any, state: EntryList) => callback(state));
};
export const receiveQuery = (callback: (query: string) => void) => {
  electron.receive('query', (_: any, query: string) => callback(query));
};

export const sendVote = (value: number | null) => electron.send('vote', value);
export const sendQuery = (query: string) => electron.send('query', query);
export const sendReset = () => electron.send('reset');
