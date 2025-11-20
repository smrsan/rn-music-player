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
import { Song } from "../types";
import { SONGS } from "../constants/songs";

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

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [currentSong, setCurrentSong] = useState<Song>(SONGS[1]);
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

    const queueSong = useCallback((song: Song, shouldAutoplay = true) => {
        shouldAutoplayRef.current = shouldAutoplay;
        setCurrentSong(song);
    }, []);

    const playNext = useCallback(() => {
        const currentIndex = SONGS.findIndex(
            (song) => song.id === currentSong.id
        );
        const nextIndex = (currentIndex + 1) % SONGS.length;
        queueSong(SONGS[nextIndex], true);
    }, [currentSong, queueSong]);

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
        const currentIndex = SONGS.findIndex(
            (song) => song.id === currentSong.id
        );
        const prevIndex = (currentIndex - 1 + SONGS.length) % SONGS.length;
        queueSong(SONGS[prevIndex], true);
    }, [currentSong, queueSong]);

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
