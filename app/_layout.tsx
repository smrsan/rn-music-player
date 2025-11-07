import { Slot } from 'expo-router';
import { PlayerProvider } from '../context/PlayerContext';

export default function RootLayout() {
  return (
    <PlayerProvider>
      <Slot />
    </PlayerProvider>
  );
}
