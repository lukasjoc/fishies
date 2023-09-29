import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <canvas id="fishies">
        <!-- fishies will be rendered in here -->
    </canvas>
`;
const canvas = document.querySelector<HTMLCanvasElement>("#fishies");
if (canvas) {
    const FishiesRenderer = (await import("./FishiesRenderer")).default;
    const fishies = new FishiesRenderer(canvas, {
        width: 980,
        height: 720,
    });

    const stopButton = document.createElement("button");
    stopButton.innerText = "Stop";
    stopButton.addEventListener("click", () => {
        fishies.destroy();
        stopButton.disabled = true;
    });
    document.body.append(stopButton);

    fishies.render();
}

export { };

