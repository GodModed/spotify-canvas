export default function resizeText(txt, maxWidth, fontSize, ctx) {
    // canvas created in constructor
    // this.canvas = document.createElement("canvas").getContext("2d");
    ctx.font = `${fontSize}px Arial`;
    var minFontSize = 10;
    var width = ctx.measureText(txt).width;
    if (width > maxWidth) {
        var newfontSize = fontSize;
        var decrement = 1;
        var newWidth;
        while (width > maxWidth) {
            newfontSize -= decrement;
            if (newfontSize < minFontSize) {
                return { fontSize: `${minFontSize}px` };
            }
            ctx.font = `${newfontSize}px Arial`;
            newWidth = ctx.measureText(txt).width;
            if (newWidth < maxWidth && decrement === 1) {
                decrement = 0.1;
                newfontSize += 1;
            } else {
                width = newWidth;
            }
        }
        return { fontSize: `${newfontSize}px` };
    } else {
        return { fontSize: `${fontSize}px` };
    }
}