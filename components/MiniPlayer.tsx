import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Song } from "../types";

interface MiniPlayerProps {
    song: Song;
    isPlaying: boolean;
    onTogglePlay: () => void;
    onOpenPlayer: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({
    song,
    isPlaying,
    onTogglePlay,
    onOpenPlayer,
}) => {
    const albumArtSource = {
        uri:
            song.albumArtUrl ??
            `https://picsum.photos/seed/rnmusic-${song.id}/200`,
    };
    return (
        <TouchableOpacity onPress={onOpenPlayer}>
            <View style={styles.container}>
                <Image source={albumArtSource} style={styles.albumArt} />
                <View style={styles.songInfo}>
                    <Text style={styles.title} numberOfLines={1}>
                        {song.title}
                    </Text>
                    <Text style={styles.artist} numberOfLines={1}>
                        {song.artist ?? "Unknown Artist"}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={(e) => {
                        e.stopPropagation();
                        onTogglePlay();
                    }}
                    style={styles.playButton}
                >
                    <MaterialIcons
                        name={isPlaying ? "pause" : "play-arrow"}
                        size={32}
                        color="white"
                    />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#2a2a2a",
        padding: 8,
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#3a3a3a",
    },
    albumArt: {
        width: 48,
        height: 48,
        borderRadius: 4,
    },
    songInfo: {
        flex: 1,
        marginHorizontal: 12,
    },
    title: {
        color: "white",
        fontWeight: "600",
        fontSize: 14,
    },
    artist: {
        color: "#aaa",
        fontSize: 12,
    },
    playButton: {
        padding: 8,
    },
});

export default MiniPlayer;
