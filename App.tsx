import React, { useState, useCallback, useRef, useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { Audio } from 'expo-audio';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Screen, Song } from './types';
import { SONGS } from './constants/songs';
import LibraryScreen from './screens/LibraryScreen';
import PlayerScreen from './screens/PlayerScreen';
import SettingsScreen from './screens/SettingsScreen';
import BottomNavBar from './components/BottomNavBar';
import MiniPlayer from './components/MiniPlayer';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LIBRARY);
  const [currentSong, setCurrentSong] = useState<Song>(SONGS[1]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const soundRef = useRef<Audio.Sound | null>(null);

  const playNext = useCallback(() => {
    const currentIndex = SONGS.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % SONGS.length;
    setCurrentSong(SONGS[nextIndex]);
    setIsPlaying(true);
  }, [currentSong]);

  useEffect(() => {
    const onPlaybackStatusUpdate = (status: any) => {
      if (status.isLoaded) {
        setProgress(status.positionMillis / 1000);
        setDuration(status.durationMillis / 1000);
        if (status.didJustFinish) {
          playNext();
        }
      }
    };

    soundRef.current?.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

    return () => {
      soundRef.current?.setOnPlaybackStatusUpdate(null);
    };
  }, [playNext]);

  useEffect(() => {
    const loadSound = async () => {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      if (currentSong) {
        const sound = new Audio.Sound();
        soundRef.current = sound;
        await sound.loadAsync(
          { uri: currentSong.audioUrl },
          { shouldPlay: isPlaying }
        );
      }
    };

    loadSound();

    return () => {
      soundRef.current?.unloadAsync();
    };
  }, [currentSong]);

  useEffect(() => {
    if (soundRef.current) {
      if (isPlaying) {
        soundRef.current.playAsync();
      } else {
        soundRef.current.pauseAsync();
      }
    }
  }, [isPlaying]);


  const handleSelectSong = useCallback((song: Song) => {
    setCurrentSong(song);
setIsPlaying(true);
    setCurrentScreen(Screen.PLAYER);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!currentSong) return;
    setIsPlaying(prev => !prev);
  }, [currentSong]);

  const playPrev = useCallback(() => {
    const currentIndex = SONGS.findIndex(song => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + SONGS.length) % SONGS.length;
    setCurrentSong(SONGS[prevIndex]);
    setIsPlaying(true);
  }, [currentSong]);

  const handleSeek = (newTime: number) => {
    if (soundRef.current) {
      soundRef.current.setPositionAsync(newTime * 1000);
    }
  };


  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.LIBRARY:
        return <LibraryScreen songs={SONGS} onSelectSong={handleSelectSong} currentSong={currentSong} isPlaying={isPlaying} />;
      case Screen.PLAYER:
        return <PlayerScreen song={currentSong} isPlaying={isPlaying} onTogglePlay={togglePlayPause} onNext={playNext} onPrev={playPrev} onBack={() => setCurrentScreen(Screen.LIBRARY)} progress={progress} duration={duration} onSeek={handleSeek} />;
      case Screen.SETTINGS:
        return <SettingsScreen onBack={() => setCurrentScreen(Screen.LIBRARY)} />;
      default:
        return <LibraryScreen songs={SONGS} onSelectSong={handleSelectSong} currentSong={currentSong} isPlaying={isPlaying} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.playerContainer}>
        <View style={styles.contentContainer}>
          {renderScreen()}
        </View>
        {currentScreen !== Screen.PLAYER && (
          <>
            <MiniPlayer song={currentSong} isPlaying={isPlaying} onTogglePlay={togglePlayPause} onOpenPlayer={() => setCurrentScreen(Screen.PLAYER)} />
            <BottomNavBar currentScreen={currentScreen} setScreen={setCurrentScreen} />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  playerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    backgroundColor: '#121212',
    overflow: 'hidden',
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24,
  },
  contentContainer: {
    flex: 1,
  },
});

export default App;
