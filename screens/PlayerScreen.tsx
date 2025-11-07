import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { MaterialIcons } from '@expo/vector-icons';
import { Song } from '../types';

interface PlayerScreenProps {
  song: Song;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onBack: () => void;
  progress: number;
  duration: number;
  onSeek: (time: number) => void;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const PlayerScreen: React.FC<PlayerScreenProps> = ({ song, isPlaying, onTogglePlay, onNext, onPrev, onBack, progress, duration, onSeek }) => {
  return (
    <LinearGradient
      colors={['#464646', '#121212']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Now Playing</Text>
        <TouchableOpacity style={styles.headerButton}>
          <MaterialIcons name="more-vert" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.albumArtContainer}>
          <Image source={{ uri: song.albumArtUrl }} style={styles.albumArt} />
        </View>
        <Text style={styles.title}>{song.title}</Text>
        <Text style={styles.artist}>{song.artist}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.progressContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration || 0}
            value={progress}
            onSlidingComplete={onSeek}
            minimumTrackTintColor="#10B981"
            maximumTrackTintColor="#444"
            thumbTintColor="#10B981"
          />
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(progress)}</Text>
            <Text style={styles.timeText}>{formatTime(duration || 0)}</Text>
          </View>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={onPrev} style={styles.controlButton}>
            <MaterialIcons name="skip-previous" size={40} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onTogglePlay} style={styles.playButton}>
            <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={48} color="#121212" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onNext} style={styles.controlButton}>
            <MaterialIcons name="skip-next" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#B2B2B2',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 12,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumArtContainer: {
    width: 288,
    height: 288,
    borderRadius: 144,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 45,
    elevation: 20,
    marginBottom: 48,
  },
  albumArt: {
    width: '100%',
    height: '100%',
    borderRadius: 144,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  artist: {
    color: '#B2B2B2',
    fontSize: 18,
    marginTop: 8,
  },
  footer: {
    marginTop: 'auto',
  },
  progressContainer: {
    marginBottom: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    color: '#B2B2B2',
    fontSize: 12,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    backgroundColor: '#10B981',
    borderRadius: 36,
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PlayerScreen;