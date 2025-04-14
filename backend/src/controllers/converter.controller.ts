import { ConverterService } from "../services";


class ConverterController {
    convertService: ConverterService;
    constructor() {
        this.ConvertService = new ConverterService();
    }

    convert = async (req: Request, res: Response) => {
        try {
            const playlist = req.body;
            const spotifyToken = req.headers["spotify-token"];
            const youtubeToken = req.headers["youtube-token"];

            if (!youtubeToken || !spotifyToken || !playlist) {
                return res
                    .status(400)
                    .json({ error: "Missing token or playlist data" });
            }

            let result;
            if (playlist.platform === "spotify") {
                // Converting from Spotify to YouTube
                console.log("first");
                result = await this.convertSpotifyToYouTube(playlist.id, spotifyToken, youtubeToken);
            } else {
                // Converting from YouTube to Spotify

                result = await this.convertYouTubeToSpotify(playlist.id, youtubeToken, spotifyToken);
            }
            res.status(200).json({ message: "Conversion complete ✅", result: result });
        } catch (err) {
            console.error("❌ Conversion Error:", err);
            res.status(500).json({ error: "Server error during conversion" });
        }
    };

    convertSpotifyToYouTube = async (spotifyPlaylistId, spotifyToken, youtubeToken) => {
        const tracks = await ConverterService.getSpotifyTracks(spotifyPlaylistId, spotifyToken);
        console.log("tracks aquired success")
        const playlistTitle = `Converted from Spotify - ${Date.now()}`;
        const playlistId = await ConverterService.createYouTubePlaylist(playlistTitle, youtubeToken);

        for (const track of tracks) {
            const query = `${track.name} ${track.artists.join(' ')}`;
            await ConverterService.searchAndAddToYoutube(query, playlistId, youtubeToken);
        }

        return { success: true, message: 'Converted to YouTube', playlistId };
    };


    convertYouTubeToSpotify = async (youtubePlaylistId, youtubeToken, spotifyToken) => {
        return { success: true, message: 'Converted to Spotify' };
        // const videos = await ConverterService.getYoutubeVideos(youtubePlaylistId, youtubeToken);

        // const playlistName = `Converted from YouTube - ${Date.now()}`;
        // const playlistId = await ConverterService.createSpotifyPlaylist(playlistName, spotifyToken);

        // for (const video of videos) {
        //     const query = video.title;
        //     await ConverterService.searchAndAddToSpotify(query, playlistId, spotifyToken);
        // }

        // return { success: true, message: 'Converted to Spotify', playlistId };
    };
}

export default ConverterController;
