import React, {
    createContext,
    useState,
    useCallback,
    useRef,
    useEffect,
    useContext,
} from "react";
import {
    useAudioPlayer,
    useAudioPlayerStatus,
    setAudioModeAsync,
} from "expo-audio";
import * as MediaLibrary from "expo-media-library";
import { Song } from "../types";

interface PlayerContextData {
    currentSong: Song | null;
    librarySongs: Song[];
    isLibraryLoading: boolean;
    libraryError: string | null;
    refreshLibrary: () => Promise<void>;
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

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [librarySongs, setLibrarySongs] = useState<Song[]>([]);
    const [isLibraryLoading, setIsLibraryLoading] = useState(true);
    const [libraryError, setLibraryError] = useState<string | null>(null);
    const player = useAudioPlayer(currentSong?.audioUrl ?? null, {
        updateInterval: 200,
        downloadFirst: true,
        keepAudioSessionActive: true,
    });
    const status = useAudioPlayerStatus(player);
    const shouldAutoplayRef = useRef(true);
    const didFinishRef = useRef(false);
    const isLoaded = status?.isLoaded ?? false;
    const isPlaying = status?.playing ?? false;
    const progress = status?.currentTime ?? 0;
    const duration = status?.duration ?? currentSong?.duration ?? 0;

    useEffect(() => {
        setAudioModeAsync({
            playsInSilentMode: true,
            allowsRecording: false,
            shouldPlayInBackground: true,
            shouldRouteThroughEarpiece: false,
            interruptionMode: "mixWithOthers",
            interruptionModeAndroid: "duckOthers",
        }).catch((error) => {
            console.warn("Failed to configure audio mode", error);
        });
    }, []);

    useEffect(() => {
        if (!isLoaded || !shouldAutoplayRef.current) return;
        player.play();
        shouldAutoplayRef.current = false;
    }, [isLoaded, player]);

    const queueSong = useCallback((song: Song | null, shouldAutoplay = true) => {
        if (!song) return;
        shouldAutoplayRef.current = shouldAutoplay;
        setCurrentSong(song);
    }, []);

    const refreshLibrary = useCallback(async () => {
        setIsLibraryLoading(true);
        setLibraryError(null);

        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();

            if (status !== "granted") {
                setLibrarySongs([]);
                setLibraryError(
                    "Permission to access media files was denied. Enable it in settings."
                );
                return;
            }

            const collectedAssets: MediaLibrary.Asset[] = [];
            let page = await MediaLibrary.getAssetsAsync({
                mediaType: MediaLibrary.MediaType.audio,
                sortBy: [MediaLibrary.SortBy.creationTime],
                first: 200,
            });
            collectedAssets.push(...page.assets);

            while (page.hasNextPage) {
                page = await MediaLibrary.getAssetsAsync({
                    mediaType: MediaLibrary.MediaType.audio,
                    sortBy: [MediaLibrary.SortBy.creationTime],
                    first: 200,
                    after: page.endCursor,
                });
                collectedAssets.push(...page.assets);
            }

            const discoveredSongs = collectedAssets
                .filter((asset) => asset.duration > 0 && asset.uri)
                .map((asset, index) => {
                    const baseTitle = asset.filename.replace(/\.[^/.]+$/, "");
                    return {
                        id: asset.id,
                        title: baseTitle || `Track ${index + 1}`,
                        artist: "Unknown Artist",
                        albumArtUrl: `https://picsum.photos/seed/rnmusic-${asset.id}/300`,
                        duration: Math.round(asset.duration ?? 0),
                        audioUrl: asset.uri,
                    } satisfies Song;
                });

            setLibrarySongs(discoveredSongs);

            if (discoveredSongs.length === 0) {
                setLibraryError(
                    "No audio files were found on this device. Add music and pull down to refresh."
                );
            }
        } catch (error) {
            console.warn("Failed to scan media library", error);
            setLibrarySongs([]);
            setLibraryError("Something went wrong while scanning for audio files.");
        } finally {
            setIsLibraryLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshLibrary();
    }, [refreshLibrary]);

    useEffect(() => {
        if (!currentSong && librarySongs.length > 0) {
            queueSong(librarySongs[0], false);
        }
    }, [currentSong, librarySongs, queueSong]);

    const playNext = useCallback(() => {
        if (!currentSong || librarySongs.length === 0) return;
        const currentIndex = librarySongs.findIndex(
            (song) => song.id === currentSong.id
        );
        if (currentIndex === -1) {
            queueSong(librarySongs[0], true);
            return;
        }
        const nextIndex = (currentIndex + 1) % librarySongs.length;
        queueSong(librarySongs[nextIndex], true);
    }, [currentSong, librarySongs, queueSong]);

    const handleSelectSong = useCallback(
        (song: Song) => {
            queueSong(song, true);
        },
        [queueSong]
    );

    const togglePlayPause = useCallback(() => {
        if (isPlaying) {
            shouldAutoplayRef.current = false;
            player.pause();
            return;
        }

        if (!isLoaded) {
            shouldAutoplayRef.current = true;
            return;
        }

        shouldAutoplayRef.current = false;
        player.play();
    }, [isLoaded, isPlaying, player]);

    const playPrev = useCallback(() => {
        if (!currentSong || librarySongs.length === 0) return;
        const currentIndex = librarySongs.findIndex(
            (song) => song.id === currentSong.id
        );
        if (currentIndex === -1) {
            queueSong(librarySongs[0], true);
            return;
        }
        const prevIndex =
            (currentIndex - 1 + librarySongs.length) % librarySongs.length;
        queueSong(librarySongs[prevIndex], true);
    }, [currentSong, librarySongs, queueSong]);

    const handleSeek = useCallback(
        (newTime: number) => {
            if (!isLoaded) return;
            player.seekTo(newTime).catch((error) => {
                console.warn("Failed to seek audio", error);
            });
        },
        [isLoaded, player]
    );

    useEffect(() => {
        if (status?.didJustFinish && !didFinishRef.current) {
            didFinishRef.current = true;
            shouldAutoplayRef.current = true;
            playNext();
        } else if (!status?.didJustFinish) {
            didFinishRef.current = false;
        }
    }, [status?.didJustFinish, playNext]);

    return (
        <PlayerContext.Provider
            value={{
                currentSong,
                librarySongs,
                isLibraryLoading,
                libraryError,
                refreshLibrary,
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
