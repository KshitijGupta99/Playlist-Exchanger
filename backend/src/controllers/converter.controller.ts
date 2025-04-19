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
            const playlist: Playlist = req.body;

            const spotifyRawToken = req.headers["spotify-token"];
            const youtubeRawToken = req.headers["youtube-token"];

            const spotifyToken = typeof spotifyRawToken === "string" ? spotifyRawToken.replace(/^"|"$/g, '') : null;
            const youtubeToken = typeof youtubeRawToken === "string" ? youtubeRawToken.replace(/^"|"$/g, '') : null;

            if (!spotifyToken || !youtubeToken || !playlist) {
                res.status(400).json({ error: "Missing token or playlist data" });
                return;
            }

            let result;

            if (playlist.platform === "spotify") {
                // Spotify → YouTube
                result = await this.convertSpotifyToYouTube(
                    playlist.name,
                    playlist.id,
                    spotifyToken,
                    youtubeToken
                );
            } else {
                // YouTube → Spotify
                result = await this.convertYouTubeToSpotify(
                    playlist.snippet.title,
                    playlist.id,
                    youtubeToken,
                    spotifyToken
                );
            }

            res.status(200).json({ message: "Conversion complete ✅", result });
        } catch (err) {
            console.error("❌ Conversion Error:", err);
            res.status(500).json({ error: "Server error during conversion" });
        }
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

        const playlistName = `${title} (Converted from YouTube - ${Date.now()})`;
        const playlistId = await ConverterService.createSpotifyPlaylist(playlistName, spotifyToken);

        for (const video of videos) {
            await ConverterService.searchAndAddToSpotify(video.title, playlistId, spotifyToken);
        }

        return { success: true, message: "Converted to Spotify", playlistId };
    };
}

export default ConverterController;
