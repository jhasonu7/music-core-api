// models/albumModel.js
const mongoose = require('mongoose');

// Define the schema for a single track
const trackSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    duration: { type: Number, default: 0 }, // Duration in seconds (changed from String to Number for consistency)
    src: { type: String }, // For native audio files
    img: { type: String, required: true }, // Image for the track
    iframeSrc: { type: String }, // For YouTube embeds
    spotifyUri: { type: String }, // For Spotify SDK playback (e.g., spotify:track:...)
    rawHtmlEmbed: { type: String }, // For Spotify iframe embeds in player bar
    soundcloudEmbed: { type: String } // NEW: For SoundCloud iframe embeds in player bar
});

// Define the schema for an album
const albumSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Unique ID for the album (added back as it's useful for frontend)
    title: { type: String, required: true },
    artist: { type: String, required: true },
    year: { type: Number, required: true }, // Changed from String to Number for consistency
    genre: { type: String, required: true },
    coverArt: { type: String, required: true }, // URL to album cover art
    fullHtmlEmbed: { type: String }, // For full Spotify playlist embed in overlay
    fullSoundcloudEmbed: { type: String }, // NEW: For full SoundCloud playlist embed in overlay
    tracks: [trackSchema] // Array of tracks
});

// Create and export the Album model
const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
