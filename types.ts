
export interface Song {
  id: number;
  title: string;
  artist: string;
  albumArtUrl: string;
  duration: number; // in seconds
  audioUrl: string;
}

export enum Screen {
  LIBRARY = 'LIBRARY',
  PLAYER = 'PLAYER',
  SETTINGS = 'SETTINGS',
}