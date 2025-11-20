import React, { useState, useMemo, useCallback } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    FlatList,
    RefreshControl,
    ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Song } from "../../types";
import { usePlayer } from "../../context/PlayerContext";
import SoundWaveVisualization from "../../components/SoundWaveVisualization";

const SongItem: React.FC<{
    song: Song;
    onSelect: () => void;
    isPlaying: boolean;
}> = ({ song, onSelect, isPlaying }) => {
    const albumArtSource = {
        uri:
            song.albumArtUrl ??
            `https://picsum.photos/seed/rnmusic-${song.id}/200`,
    };
    return (
        <TouchableOpacity onPress={onSelect} style={styles.songItem}>
            <Image source={albumArtSource} style={styles.albumArt} />
            <View style={styles.songInfo}>
                <Text style={[styles.title, isPlaying && styles.playingTitle]}>
                    {song.title}
                </Text>
                <Text style={styles.artist}>
                    {song.artist ?? "Unknown Artist"}
                </Text>
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
};

const LibraryScreen: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const {
        currentSong,
        isPlaying,
        handleSelectSong,
        librarySongs,
        isLibraryLoading,
        libraryError,
        refreshLibrary,
    } = usePlayer();
    const router = useRouter();
    const handleRefresh = useCallback(() => {
        refreshLibrary();
    }, [refreshLibrary]);

    const filteredSongs = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        return librarySongs.filter((song) => {
            const titleMatch = song.title.toLowerCase().includes(lowerSearch);
            const artistMatch = (song.artist ?? "unknown")
                .toLowerCase()
                .includes(lowerSearch);
            return titleMatch || artistMatch;
        });
    }, [librarySongs, searchTerm]);

    const onSongPress = (song: Song) => {
        handleSelectSong(song);
        router.push("/player");
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
                    <MaterialIcons
                        name="search"
                        size={20}
                        color="#9CA3AF"
                        style={styles.searchIcon}
                    />
                    <TextInput
                        placeholder="Find your music..."
                        placeholderTextColor="#9CA3AF"
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        style={styles.searchInput}
                    />
                </View>
            </View>
            {isLibraryLoading && librarySongs.length === 0 ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#10B981" />
                    <Text style={styles.loaderText}>
                        Scanning your device for music...
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredSongs}
                    renderItem={({ item }) => (
                        <SongItem
                            song={item}
                            onSelect={() => onSongPress(item)}
                            isPlaying={Boolean(
                                isPlaying && currentSong?.id === item.id
                            )}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.songList}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLibraryLoading}
                            onRefresh={handleRefresh}
                            tintColor="#10B981"
                            colors={["#10B981"]}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <MaterialIcons
                                name="music-off"
                                size={48}
                                color="#6B7280"
                            />
                            <Text style={styles.emptyTitle}>
                                No music found
                            </Text>
                            <Text style={styles.emptyBody}>
                                {libraryError ??
                                    "Add audio files to your device and pull down to refresh."}
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
    },
    header: {
        padding: 16,
        paddingTop: 24,
    },
    headerTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    menuButton: {
        padding: 4,
    },
    headerTitle: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
    },
    searchContainer: {
        position: "relative",
    },
    searchIcon: {
        position: "absolute",
        left: 12,
        top: 14,
        zIndex: 1,
    },
    searchInput: {
        width: "100%",
        backgroundColor: "#282828",
        borderWidth: 1,
        borderColor: "#383838",
        borderRadius: 8,
        paddingVertical: 12,
        paddingLeft: 40,
        paddingRight: 16,
        color: "white",
    },
    songList: {
        paddingHorizontal: 8,
        paddingBottom: 16,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },
    loaderText: {
        color: "#B2B2B2",
    },
    songItem: {
        flexDirection: "row",
        alignItems: "center",
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
        color: "white",
        fontWeight: "600",
    },
    playingTitle: {
        color: "#10B981",
    },
    artist: {
        color: "#B2B2B2",
        fontSize: 14,
    },
    moreButton: {
        marginLeft: 16,
    },
    emptyState: {
        flex: 1,
        minHeight: 240,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 32,
    },
    emptyTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },
    emptyBody: {
        color: "#9CA3AF",
        textAlign: "center",
    },
});

export default LibraryScreen;
