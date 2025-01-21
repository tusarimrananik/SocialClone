function svgTextGenerator({
    text,
    fontSize = 20,
    color = "black",
    fontFamily = "Google Sans, Arial, sans-serif"
}) {
    const padding = 20;
    const textLength = text.length * fontSize * 0.6; // Approximate width
    const width = Math.max(150, textLength) + padding;
    const height = fontSize * 2 + padding;

    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <style>
            .text {
                font-family: ${fontFamily};
                font-size: ${fontSize}px;
                fill: ${color};
            }
        </style>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" class="text">
            ${text}
        </text>
    </svg>`;
}

export { svgTextGenerator };
