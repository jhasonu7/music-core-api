//routes/albumRoutes.js
const express = require('express');
const router = express.Router();
const Album = require('../models/albumModel');

// GET all albums or search albums based on query
router.get('/', async (req, res) => {
  const searchQuery = req.query.search || ''; // Get search query from the URL (if any)

  try {
    // If there's a search query, filter albums by title, artist, genre,
    // or by track details including embeds (Spotify, YouTube, SoundCloud)
    const query = searchQuery ? {
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },          // Case-insensitive search for album title
        { artist: { $regex: searchQuery, $options: 'i' } },         // Case-insensitive search for album artist
        { genre: { $regex: searchQuery, $options: 'i' } },          // Case-insensitive search for album genre
        { 'tracks.title': { $regex: searchQuery, $options: 'i' } }, // Search within track titles
        { 'tracks.artist': { $regex: searchQuery, $options: 'i' } },// Search within track artists
        { 'tracks.iframeSrc': { $regex: searchQuery, $options: 'i' } }, // Search within YouTube embed URLs
        { 'tracks.spotifyUri': { $regex: searchQuery, $options: 'i' } }, // Search within Spotify URIs
        { 'tracks.rawHtmlEmbed': { $regex: searchQuery, $options: 'i' } }, // Search within Spotify raw HTML embeds
        { 'tracks.soundcloudEmbed': { $regex: searchQuery, $options: 'i' } }, // NEW: Search within SoundCloud track embeds
        { fullHtmlEmbed: { $regex: searchQuery, $options: 'i' } },  // Search within full album Spotify embeds
        { fullSoundcloudEmbed: { $regex: searchQuery, $options: 'i' } } // NEW: Search within full album SoundCloud embeds
      ]
    } : {}; // If no search query, return all albums

    const albums = await Album.find(query);

    res.json(albums); // Return the filtered albums as JSON
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new album
router.post('/', async (req, res) => {
  const album = new Album({
    title: req.body.title,
    artist: req.body.artist,
    year: req.body.year,
    genre: req.body.genre,
    coverArt: req.body.coverArt,
    tracks: req.body.tracks,
    fullHtmlEmbed: req.body.fullHtmlEmbed,        // Include full HTML embed for Spotify/other
    fullSoundcloudEmbed: req.body.fullSoundcloudEmbed // NEW: Include full SoundCloud embed
  });

  try {
    const newAlbum = await album.save();
    res.status(201).json(newAlbum); // Send the newly created album back to the client
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;