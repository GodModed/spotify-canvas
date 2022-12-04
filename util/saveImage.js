import { writeFileSync } from "fs";

export default function saveImage(canvas) {
    const buffer = canvas.toBuffer("image/png");
    writeFileSync("image.png", buffer);
}