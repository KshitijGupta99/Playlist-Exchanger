"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Converter {
    constructor() {
        this.convert = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { playlistData, platformFrom, platformTo } = req.body; // Assuming you're sending data in the request body
                console.log("Data received:", playlistData);
                if (!playlistData || !platformFrom || !platformTo) {
                    return res.status(400).json({ message: 'Missing required parameters' });
                }
                // Perform conversion logic here
                let convertedData;
                if (platformTo == "youtube")
                    convertedData = yield convertToYoutube(playlistData, platformFrom); // Example function to convert data
                if (platformTo == "spotify")
                    convertedData = yield convertToSpotify(playlistData, platformFrom);
                else {
                    return res.status(400).json({ error: "Invalid platform specified" });
                } // Example function to convert data
                res.status(200).json({ convertedData });
            }
            catch (error) {
                console.error("Conversion Error:", error);
                res.status(500).json({ error: "Conversion failed" });
            }
        });
        // Constructor logic here
    }
}
exports.default = Converter;
