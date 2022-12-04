// import { createCanvas } from "canvas";
// import saveImage from "./util/saveImage.js";
// import os from "node:os";
// import tokenValidator from "./util/getToken.js";

// const session = new tokenValidator();

// const width = 1200;
// const height = 720;

// const canvas = createCanvas(width, height);
// const ctx = canvas.getContext("2d");

// // fill background white
// async function mainLoop() {
//     await session.checkTokenValidity();
//     if (!session.isAlive) {
//         await session.generate();
//         console.log("New token generated");
//         return;
//     }
//     ctx.fillStyle = "white";
//     ctx.fillRect(0, 0, width, height);
//     ctx.fillStyle = "black";
//     ctx.textAlign = "center";
//     ctx.font = "90px Arial";
//     ctx.fillText("Hey " + os.userInfo().username.toUpperCase(), width / 2, (height / 2) - 100);

//     // time
    
// }

// setInterval(mainLoop, 1000);

import getCurrentPlaying from "./util/getCurrentPlaying.js";
import { config } from "dotenv";
import { createCanvas, loadImage } from "canvas";
import saveImage from "./util/saveImage.js";
import resizeText from "./util/resizeText.js";
import dominant from "huey/dominant.js";
import imageData from "get-image-data";
config();

const width = 1200;
const height = 720;
const imageHeight = 192;
const progressBarHeight = 25;

const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

const Playing = new getCurrentPlaying();
let lastSong;
let background;
let foreground;
let image;

async function mainLoop() {
    let startTime = Date.now();
    const { artist, song, album, albumArt, duration, progress } = await Playing.getStatus();
    if (lastSong !== song) {
        console.log("New song detected");
        generateColors(albumArt);
    }
    lastSong = song;
    const image = await loadImage(albumArt);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = foreground;
    ctx.textAlign = "center";
    const fontSize = resizeText(song, width, 90, ctx);
    resizeText(song, width, 100, ctx);
    ctx.fillText(song, width / 2, (height / 2));
    ctx.font = "40px Arial";
    ctx.fillText(artist, width / 2, (height / 2) + 75);
    // progress bar
    ctx.fillRect(0, height - progressBarHeight, (progress / duration) * width, progressBarHeight);
    // album art
    ctx.drawImage(image, (width / 2) - (imageHeight / 2), 50, imageHeight, imageHeight);
    // time
    const songCurrentTime = new Date(progress).toISOString().substr(14, 5);
    const songDuration = new Date(duration).toISOString().substr(14, 5);
    ctx.font = "30px Arial";
    ctx.fillText(songCurrentTime, progressBarHeight + 25, height - (progressBarHeight + 25));
    ctx.fillText(songDuration, width - (progressBarHeight + 25), height - (progressBarHeight + 25));
    saveImage(canvas);
    console.log(`Image generated in ${Date.now() - startTime}ms`);
}

setInterval(mainLoop, 500);

function generateColors(albumArt) {
    image = loadImage(albumArt);
    imageData(albumArt, function(err, info) {
        const colorArray = dominant(info.data);
        const color = colorArray.join(", ");
        background = `rgb(${color})`;
        foreground = `rgb(${255 - colorArray[0]}, ${255 - colorArray[1]}, ${255 - colorArray[2]})`;
    })
}