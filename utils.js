const colors = [
    "#0a7029",
    "#fede00",
    "#c8df52",
    "#dbe8d8",
    "#f51720",
    "#fa26a0",
    "#f8d210",
    "#2ff3e0",
    "#fd7f20",
    "#fc2e20",
    "#fdb750",
    "#010100"
]

export function changeSpanColors(elements) {
    elements.forEach(element => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        element.style.color = randomColor;
    });

    setTimeout(() => {
        changeSpanColors(elements);
    }, 300);
}