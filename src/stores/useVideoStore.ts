import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
	resetPlaybackConfirmation,
	stopPlayback,
} from "@/shared/media/confirmedPlayback";
import { createTransportActions } from "@/shared/media/transport";
import { createIndexedDBPersistStorage } from "@/utils/indexedDBPersistStorage";
import { useStoreShallow } from "./helpers";
import { shouldUpdatePlaybackTime } from "./playbackTime";

// The video item shape now lives in the shared MediaCore library model
// (`Video` is a strict subset of the music `Track`). Re-exported here for
// compatibility with existing importers.
export type { VideoItem as Video } from "@/shared/media/library";

import type { VideoItem as Video } from "@/shared/media/library";

export const DEFAULT_VIDEOS: Video[] = [
	{
		id: "SHAQlFq6TFg",
		url: "https://www.youtube.com/watch?v=SHAQlFq6TFg",
		title: "Fastlove (Official Video)",
		artist: "George Michael",
	},
	{
		id: "T7dTZOt9PZo",
		url: "https://www.youtube.com/watch?v=T7dTZOt9PZo",
		title: "A New UK Movement | Signature Sound Cypher [Round 2]",
		artist: "Namesbliss, Paul Stephan, Pozzy, DeeRiginal & more",
	},
	{
		id: "vTfd54EO_YY",
		url: "https://www.youtube.com/watch?v=vTfd54EO_YY",
		title: "VIBES DON'T LIE | A COLORS SHOW",
		artist: "Leon Thomas",
	},
	{
		id: "fN-xq7t6pKw",
		url: "https://www.youtube.com/watch?v=fN-xq7t6pKw",
		title: "Rella",
		artist: "Odd Future",
	},
	{
		id: "H58vbez_m4E",
		url: "https://www.youtube.com/watch?v=H58vbez_m4E",
		title: "Not Like Us (Official Music Video)",
		artist: "Kendrick Lamar",
	},
	{
		id: "4m1EFMoRFvY",
		url: "https://www.youtube.com/watch?v=4m1EFMoRFvY",
		title: "Single Ladies (Put A Ring On It) [Official Music Video]",
		artist: "Beyoncé",
	},
	{
		id: "iQrjmTrVx4Q",
		url: "https://www.youtube.com/watch?v=iQrjmTrVx4Q",
		title: "Billie Jean [Live From Motown 25] [Remastered In 4K]",
		artist: "Michael Jackson",
	},
	{
		id: "uxpDa-c-4Mc",
		url: "https://www.youtube.com/watch?v=uxpDa-c-4Mc",
		title: "Hotline Bling (Official Video)",
		artist: "Drake",
	},
	{
		id: "MSRcC626prw",
		url: "https://www.youtube.com/watch?v=MSRcC626prw",
		title: "Kill Bill (Official Video)",
		artist: "SZA",
	},
	{
		id: "6ONRf7h3Mdk",
		url: "https://www.youtube.com/watch?v=6ONRf7h3Mdk",
		title: "SICKO MODE (Official Video)",
		artist: "Travis Scott",
	},
	{
		id: "cFlWi3Qe2MU",
		url: "https://www.youtube.com/watch?v=cFlWi3Qe2MU",
		title: "Yonkers (Official Music Video)",
		artist: "Tyler, The Creator",
	},
	{
		id: "VYOjWnS4cMY",
		url: "https://www.youtube.com/watch?v=VYOjWnS4cMY",
		title: "This Is America (Official Video)",
		artist: "Childish Gambino",
	},
	{
		id: "6swmTBVI83k",
		url: "https://www.youtube.com/watch?v=6swmTBVI83k",
		title: "MONTERO (Call Me By Your Name) (Official Video)",
		artist: "Lil Nas X",
	},
	{
		id: "Jg5wkZ-dJXA",
		url: "https://www.youtube.com/watch?v=Jg5wkZ-dJXA",
		title: "Runaway (Full-length Film)",
		artist: "Kanye West",
	},
	{
		id: "4NRXx6U8ABQ",
		url: "https://www.youtube.com/watch?v=4NRXx6U8ABQ",
		title: "Blinding Lights (Official Video)",
		artist: "The Weeknd",
	},
	{
		id: "na7lIb09898",
		url: "https://www.youtube.com/watch?v=na7lIb09898",
		title: "Lose Control (feat. Ciara & Fat Man Scoop) [Official Music Video]",
		artist: "Missy Elliott",
	},
	{
		id: "PWgvGjAhvIw",
		url: "https://www.youtube.com/watch?v=PWgvGjAhvIw",
		title: "Hey Ya! (Official HD Video)",
		artist: "OutKast",
	},
	{
		id: "O3pyCGnZzYA",
		url: "https://www.youtube.com/watch?v=O3pyCGnZzYA",
		title: "Can I Kick It? (Official HD Video)",
		artist: "A Tribe Called Quest",
	},
];

interface VideoStoreState {
	videos: Video[];
	currentVideoId: string | null;
	loopAll: boolean;
	loopCurrent: boolean;
	isShuffled: boolean;
	/** Desired player state, including an in-flight play attempt. */
	playbackRequested: boolean;
	/** True only after ReactPlayer emits `onPlay`. */
	isPlaying: boolean;
	/**
	 * Transient playback clock reported by ReactPlayer's `onProgress`. NOT
	 * persisted. `playedSeconds` is the fine-grained value (drives the seek
	 * bar); `elapsedTime` is the floored-second value (drives the LCD readout)
	 * and only changes ~1x/sec. Living here — rather than in `useVideosLogic`
	 * reducer state — keeps the ~1Hz tick from re-rendering the whole Videos
	 * tree; only the leaf subscribers re-render. Mirrors the iPod pattern.
	 */
	playedSeconds: number;
	elapsedTime: number;
	// actions
	setVideos: (videos: Video[] | ((prev: Video[]) => Video[])) => void;
	setCurrentVideoId: (videoId: string | null) => void;
	setLoopAll: (val: boolean) => void;
	setLoopCurrent: (val: boolean) => void;
	setIsShuffled: (val: boolean) => void;
	togglePlay: () => void;
	/** Request play or stop; `true` remains pending until `confirmPlayback`. */
	setIsPlaying: (val: boolean) => void;
	confirmPlayback: () => void;
	/** Update the playback clock from a progress tick (fine + floored). */
	setPlaybackTime: (seconds: number) => void;
	/** Reset the playback clock to zero (e.g. on track change). */
	resetPlaybackTime: () => void;
	// derived state helpers
	getCurrentIndex: () => number;
	getCurrentVideo: () => Video | null;
}

const CURRENT_VIDEO_STORE_VERSION = 8; // Clean ID-based version

const getInitialState = () => ({
	videos: DEFAULT_VIDEOS,
	currentVideoId: DEFAULT_VIDEOS.length > 0 ? DEFAULT_VIDEOS[0].id : null,
	loopAll: true,
	loopCurrent: false,
	isShuffled: false,
	...stopPlayback(),
	playedSeconds: 0,
	elapsedTime: 0,
});

export const useVideoStore = create<VideoStoreState>()(
	persist(
		(set, get) => ({
			...getInitialState(),

			setVideos: (videosOrUpdater) => {
				set((state) => {
					const newVideos =
						typeof videosOrUpdater === "function"
							? (videosOrUpdater as (prev: Video[]) => Video[])(state.videos)
							: videosOrUpdater;

					// Validate currentVideoId when videos change
					let currentVideoId = state.currentVideoId;
					if (
						currentVideoId &&
						!newVideos.find((v) => v.id === currentVideoId)
					) {
						currentVideoId = newVideos.length > 0 ? newVideos[0].id : null;
					}

					return {
						videos: newVideos,
						currentVideoId,
						...(currentVideoId !== state.currentVideoId
							? resetPlaybackConfirmation(state)
							: {}),
					};
				});
			},
			setCurrentVideoId: (videoId) =>
				set((state) => {
					// Ensure videoId exists in videos array
					const validVideoId =
						videoId && state.videos.find((v) => v.id === videoId)
							? videoId
							: null;
					return {
						currentVideoId: validVideoId,
						...(validVideoId !== state.currentVideoId
							? resetPlaybackConfirmation(state)
							: {}),
					};
				}),
			setLoopAll: (val) => set({ loopAll: val }),
			setLoopCurrent: (val) => set({ loopCurrent: val }),
			setIsShuffled: (val) => set({ isShuffled: val }),
			...createTransportActions<VideoStoreState>(set),
			setPlaybackTime: (seconds) =>
				set((state) => {
					const flooredSeconds = Math.floor(seconds);
					const nextPlayed = shouldUpdatePlaybackTime(
						state.playedSeconds,
						seconds,
					)
						? seconds
						: state.playedSeconds;
					// `elapsedTime` only flips on whole-second boundaries, so it
					// re-renders the LCD readout subscriber at most ~1x/sec.
					if (
						nextPlayed === state.playedSeconds &&
						flooredSeconds === state.elapsedTime
					) {
						return {};
					}
					return { playedSeconds: nextPlayed, elapsedTime: flooredSeconds };
				}),
			resetPlaybackTime: () => set({ playedSeconds: 0, elapsedTime: 0 }),

			// Derived state helpers
			getCurrentIndex: () => {
				const state = get();
				return state.currentVideoId
					? state.videos.findIndex((v) => v.id === state.currentVideoId)
					: -1;
			},
			getCurrentVideo: () => {
				const state = get();
				return state.currentVideoId
					? state.videos.find((v) => v.id === state.currentVideoId) || null
					: null;
			},
		}),
		{
			name: "ryos:videos",
			version: CURRENT_VIDEO_STORE_VERSION,
			storage: createIndexedDBPersistStorage(),
			// Persist videos array to prevent ID-based errors
			partialize: (state) => ({
				videos: state.videos,
				currentVideoId: state.currentVideoId,
				loopAll: state.loopAll,
				loopCurrent: state.loopCurrent,
				isShuffled: state.isShuffled,
			}),
		},
	),
);

/**
 * Shallow-equality selector hook for this store. Co-located with the store
 * (rather than a central helpers barrel) so importing it doesn't pull other
 * stores into the bundle.
 */
export function useVideoStoreShallow<T>(
	selector: (state: ReturnType<typeof useVideoStore.getState>) => T,
): T {
	return useStoreShallow(useVideoStore, selector);
}
