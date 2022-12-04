import axios from 'axios';
import getToken from './getToken.js';
import { readFileSync, writeFileSync } from "fs";

let token = readFileSync("token.txt", "utf-8");
let time = Date.now() + 1000 * 60 * 30;

async function getCurrentPlaying() {
    if (!token) {
        token = await getToken();
        writeFileSync("token.txt", token);
    }
    //catch error
    try {
        if (Date.now() > time) {
            token = await getToken();
            writeFileSync("token.txt", token);
            time = Date.now() + 1000 * 60 * 30;
        }
        const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const artist = response.data.item.artists[0].name;
        const song = response.data.item.name;
        const album = response.data.item.album.name;
        const albumArt = response.data.item.album.images[0].url;
        const duration = response.data.item.duration_ms;
        const progress = response.data.progress_ms;
    
        return {
            artist,
            song,
            album,
            albumArt,
            duration,
            progress,
        };
    } catch(e) {
        token = await getToken();
        writeFileSync("token.txt", token);
        return getCurrentPlaying();
    }
}

export default class Playing {
    constructor() {
        this.update();
        setInterval(() => {
            this.update();
        }, 1000);
    }

    async update() {
        const { artist, song, album, albumArt, duration, progress } = await getCurrentPlaying();
        this.artist = artist;
        this.song = song;
        this.album = album;
        this.albumArt = albumArt;
        this.duration = duration;
        this.progress = progress;
    }

    async getStatus() {
        return {
            artist: this.artist,
            song: this.song,
            album: this.album,
            albumArt: this.albumArt,
            duration: this.duration,
            progress: this.progress,
        };
    }
}