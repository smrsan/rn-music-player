import React, { createContext, useState, useCallback, useRef, useEffect, useContext } from 'react';
import { Audio } from 'expo-audio';
import { Song } from '../types';
import { SONGS } from '../constants/songs';

interface PlayerContextData {
  currentSong: Song;
  isPlaying: boolean;
  progress: number;
  duration: number;
  handleSelectSong: (song: Song) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrev: () => void;
  handleSeek: (time: number) => void;
}

const PlayerContext = createContext<PlayerContextData>({} as PlayerContextData);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song>(SONGS[1]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isSoundLoaded, setIsSoundLoaded] = useState(false);

  const playNext = useCallback(() => {
    const currentIndex = SONGS.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % SONGS.length;
    setCurrentSong(SONGS[nextIndex]);
    setIsPlaying(true);
  }, [currentSong]);

  useEffect(() => {
    const onPlaybackStatusUpdate = (status: any) => {
      if (status.isLoaded) {
        setIsSoundLoaded(true);
        setProgress(status.positionMillis / 1000);
        setDuration(status.durationMillis / 1000);
        if (status.didJustFinish) {
          playNext();
        }
      } else {
        setIsSoundLoaded(false);
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
        try {
          const sound = new Audio.Sound();
          soundRef.current = sound;
          await sound.loadAsync(
            { uri: currentSong.audioUrl },
            { shouldPlay: isPlaying }
          );
        } catch (error) {
          console.error("Error loading sound:", error);
        }
      }
    };

    loadSound();

    return () => {
      soundRef.current?.unloadAsync();
    };
  }, [currentSong]);

  useEffect(() => {
    if (soundRef.current && isSoundLoaded) {
      if (isPlaying) {
        soundRef.current.playAsync();
      } else {
        soundRef.current.pauseAsync();
      }
    }
  }, [isPlaying, isSoundLoaded]);

  const handleSelectSong = useCallback((song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
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

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        progress,
        duration,
        handleSelectSong,
        togglePlayPause,
        playNext,
        playPrev,
        handleSeek,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  return context;
};
