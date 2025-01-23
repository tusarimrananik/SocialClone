function svgTextGenerator({
    text,
    fontSize = 20,
    color = "black",
    fontFamily = "Google Sans, Arial, sans-serif",
    textAlign = "middle", // "left", "middle", or "right"
    padding = 0
}) {
    const textLength = text.length * fontSize * 0.6; // Approximate width
    const width = Math.max(150, textLength) + padding * 2;
    const height = fontSize * 2 + padding * 2;

    let textAnchor;
    let xPosition;

    switch (textAlign) {
        case "left":
            textAnchor = "start";
            xPosition = padding;
            break;
        case "right":
            textAnchor = "end";
            xPosition = width - padding;
            break;
        case "middle":
        default:
            textAnchor = "middle";
            xPosition = width / 2;
            break;
    }

    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <style>
            .text {
                font-family: ${fontFamily};
                font-size: ${fontSize}px;
                fill: ${color};
            }
        </style>
        <text x="${xPosition}" y="50%" dominant-baseline="middle" text-anchor="${textAnchor}" class="text">
            ${text}
        </text>
    </svg>`;
}

export { svgTextGenerator };
