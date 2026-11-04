import { ConverterService } from "../services";
import { Request, Response } from "express";

// Define playlist data interfaces
interface SpotifyPlaylist {
    id: string;
    name: string;
    platform: "spotify";
}

interface YouTubePlaylist {
    id: string;
    snippet: {
        title: string;
    };
    platform: "youtube";
}

type Playlist = SpotifyPlaylist | YouTubePlaylist;

class ConverterController {
    private ConvertService: ConverterService;

    constructor() {
        this.ConvertService = new ConverterService();
    }

    convert = async (req: Request, res: Response): Promise<void> => {
        try {
            const playlist = req.body as Partial<Playlist>;

            const spotifyRawToken = req.headers["spotify-token"];
            const youtubeRawToken = req.headers["youtube-token"];

            const spotifyToken = this.normalizeToken(spotifyRawToken);
            const youtubeToken = this.normalizeToken(youtubeRawToken);

            if (!spotifyToken || !youtubeToken || !playlist) {
                res.status(400).json({ error: "Missing token or playlist data" });
                return;
            }

            if (!playlist.id || (playlist.platform !== "spotify" && playlist.platform !== "youtube")) {
                res.status(400).json({ error: "Invalid playlist data" });
                return;
            }

            let result;
            if (playlist.platform === "spotify") {
                if (!playlist.name) {
                    res.status(400).json({ error: "Spotify playlist name is missing" });
                    return;
                }
                // Spotify → YouTube
                result = await this.convertSpotifyToYouTube(
                    playlist.name,
                    playlist.id,
                    spotifyToken,
                    youtubeToken
                );
            } else {
                const youtubePlaylist = playlist as Partial<YouTubePlaylist>;
                if (!youtubePlaylist.snippet?.title) {
                    res.status(400).json({ error: "YouTube playlist title is missing" });
                    return;
                }
                // YouTube → Spotify
                result = await this.convertYouTubeToSpotify(
                    youtubePlaylist.snippet.title,
                    playlist.id,
                    youtubeToken,
                    spotifyToken
                );
            }

            res.status(200).json({ message: "Conversion complete ✅", result });
        } catch (err) {
            const error = err as {
                message?: string;
                response?: {
                    status?: number;
                    data?: {
                        error?: { message?: string; status?: string; errors?: Array<{ reason?: string; message?: string }> } | string;
                    };
                };
            };
            const upstreamError = error.response?.data?.error;
            const upstreamMessage =
                typeof upstreamError === "string"
                    ? upstreamError
                    : upstreamError?.message || upstreamError?.errors?.[0]?.message;
            const reason =
                typeof upstreamError === "string"
                    ? undefined
                    : upstreamError?.status || upstreamError?.errors?.[0]?.reason;
            const status = error.response?.status;
            console.error("❌ Conversion Error:", {
                status,
                reason,
                message: upstreamMessage || error.message || err,
            });
            const detail = reason === "quotaExceeded"
                ? "YouTube API quota is exhausted. Enable YouTube Data API quota or try again tomorrow."
                : status === 401
                    ? "One of the access tokens has expired. Sign in to Spotify and YouTube again."
                    : status === 403
                        ? "The provider rejected this action. Check the account permissions and API access."
                        : upstreamMessage || error.message || "Server error during conversion";
            res.status(error.response?.status && error.response.status >= 400 ? 502 : 500).json({
                error: detail,
                providerStatus: status,
                providerReason: reason,
            });
        }
    };

    private normalizeToken = (token: string | string[] | undefined): string | null => {
        if (typeof token !== "string") return null;
        const normalized = token.trim().replace(/^"|"$/g, "");
        return normalized || null;
    };

    private convertSpotifyToYouTube = async (
        title: string,
        spotifyPlaylistId: string,
        spotifyToken: string,
        youtubeToken: string
    ): Promise<{ success: boolean; message: string; playlistId?: string }> => {
        const tracks = await ConverterService.getSpotifyTracks(spotifyPlaylistId, spotifyToken);

        if (tracks.length === 0) {
            return { success: false, message: "No tracks found in Spotify playlist" };
        }

        const playlistTitle = `${title} (Converted from Spotify - ${Date.now()})`;
        const playlistId = await ConverterService.createYouTubePlaylist(playlistTitle, youtubeToken);

        for (const track of tracks) {
            await ConverterService.searchAndAddToYoutube(track, playlistId, youtubeToken);
        }

        return { success: true, message: "Converted to YouTube", playlistId };
    };

    private convertYouTubeToSpotify = async (
        title: string,
        youtubePlaylistId: string,
        youtubeToken: string,
        spotifyToken: string
    ): Promise<{ success: boolean; message: string; playlistId?: string }> => {
        const videos = await ConverterService.getYoutubeVideos(youtubePlaylistId, youtubeToken);

        if (!videos || videos.length === 0) {
            return { success: false, message: "No videos found in YouTube playlist" };
        }
        const playlistName = `${title} (Converted from YouTube - ${Date.now()})`;
        const playlistId = await ConverterService.createSpotifyPlaylist(playlistName, spotifyToken);

        for (const video of videos) {
            await ConverterService.searchAndAddToSpotify(video.title, playlistId, spotifyToken);
        }

        return { success: true, message: "Converted to Spotify", playlistId };
    };
}

export default ConverterController;
