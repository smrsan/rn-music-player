import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Song } from '../../types';
import { usePlayer } from '../../context/PlayerContext';
import SoundWaveVisualization from '../../components/SoundWaveVisualization';
import { SONGS } from '../../constants/songs';

const SongItem: React.FC<{ song: Song; onSelect: () => void; isPlaying: boolean; }> = ({ song, onSelect, isPlaying }) => (
  <TouchableOpacity onPress={onSelect} style={styles.songItem}>
    <Image source={{ uri: song.albumArtUrl }} style={styles.albumArt} />
    <View style={styles.songInfo}>
      <Text style={[styles.title, isPlaying && styles.playingTitle]}>{song.title}</Text>
      <Text style={styles.artist}>{song.artist}</Text>
    </View>
    {isPlaying ? (
      <SoundWaveVisualization />
    ) : (
      <TouchableOpacity style={styles.moreButton}>
        <MaterialIcons name="more-vert" size={24} color="#6B7280" />
      </TouchableOpacity>
    )}
  </TouchableOpacity>
);

const LibraryScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { currentSong, isPlaying, handleSelectSong } = usePlayer();
  const router = useRouter();

  const filteredSongs = SONGS.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSongPress = (song: Song) => {
    handleSelectSong(song);
    router.push('/player');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.menuButton}>
            <MaterialIcons name="menu" size={28} color="#D1D5DB" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Library</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            placeholder="Find your music..."
            placeholderTextColor="#9CA3AF"
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.searchInput}
          />
        </View>
      </View>
      <FlatList
        data={filteredSongs}
        renderItem={({ item }) => (
          <SongItem
            song={item}
            onSelect={() => onSongPress(item)}
            isPlaying={isPlaying && currentSong.id === item.id}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.songList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 16,
    paddingTop: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  menuButton: {
    padding: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 14,
    zIndex: 1,
  },
  searchInput: {
    width: '100%',
    backgroundColor: '#282828',
    borderWidth: 1,
    borderColor: '#383838',
    borderRadius: 8,
    paddingVertical: 12,
    paddingLeft: 40,
    paddingRight: 16,
    color: 'white',
  },
  songList: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  albumArt: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  songInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  title: {
    color: 'white',
    fontWeight: '600',
  },
  playingTitle: {
    color: '#10B981',
  },
  artist: {
    color: '#B2B2B2',
    fontSize: 14,
  },
  moreButton: {
    marginLeft: 16,
  },
});

export default LibraryScreen;