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

    const resumeButton = document.createElement("button");
    resumeButton.innerText = "Resume";
    resumeButton.disabled = true;

    const stopButton = document.createElement("button");
    stopButton.innerText = "Stop";

    resumeButton.addEventListener("click", () => {
        fishies.start();
        resumeButton.disabled = true;
        stopButton.disabled = false;
    });
    stopButton.addEventListener("click", () => {
        fishies.stop();
        stopButton.disabled = true;
        resumeButton.disabled = false;
    });

    document.body.append(resumeButton);
    document.body.append(stopButton);
    fishies.render();

    // TODO: event to move the loop into the consumer
    // fishies.on("clear", () => {
    //     fishies.render();
    // })
}

export { };

