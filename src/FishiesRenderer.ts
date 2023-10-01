const TIME_MS = 1000;
const TIME_S = TIME_MS * 1;

export type RendererConfig = {
    width: number;
    height: number;
};

type Figure = {
    startx: number | null;
    starty: number | null;
    movex: number;
    movey: number;
    x?: number;
    y?: number;
    maxWidth: number;
    shape: string[];
    interval?: ReturnType<typeof setInterval>;
    speed: number;
    fillStyle: string;

}
// TODO: should have a Figure class to make it easier to extend fishies later on, and
// make the code cleaner using figure based draw, and rotate methods
// class Figure {
//     constructor() {}
//     draw() { }
//     rotate(deg: 360 | 180) { }
// }

const Simpleton: Figure = {
    startx: null, starty: null,
    movex: 10, movey: 0,
    maxWidth: 50,
    shape: ["><_>"],
    fillStyle: "red", // "#fff",
    speed: Math.floor(TIME_S / 10),
};

const Burt: Figure = {
    startx: null, starty: null,
    movex: 15, movey: 0,
    maxWidth: 100,
    shape: [
        "  _ ",
        ">|_>",
    ],
    fillStyle: "green", // "#aee",
    speed: Math.floor(TIME_S / 5),
};

function setRandStartXY(origFigure: Figure, width: number, height: number) {
    const figure = structuredClone(origFigure);
    figure.startx = -figure.maxWidth;
    // figure.startx = Math.floor(Math.random() * 100) % 2 === 0 ? width + figure.maxWidth : -figure.maxWidth;
    figure.starty = Math.min(Math.floor((Math.random() * 1000) - Math.random() * 10), height);
    return figure;
}

class FishiesRenderer {
    private figures: Figure[] = [];
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private fontsize: number = 18;
    private background: string = "white"; //  "#02172d";
    constructor(canvas: HTMLCanvasElement, config: RendererConfig) {
        canvas.width = config.width;
        canvas.height = config.height;
        this.canvas = canvas;
        if (!canvas) {
            throw new Error("could not render fishies. Canvas missing!");
        }
        const context = canvas.getContext("2d");
        if (!context) {
            throw new Error("could not render fishies. Context2D missing!");
        }
        this.context = context;
        this.context.lineWidth = 0.5;
        // this.context.lineWidth = 5;
        this.context.font = `${this.fontsize}px sans-serif`;
    }

    private prerender() {
        this.figures.push(setRandStartXY(Simpleton, this.canvas.width, this.canvas.height));
        this.figures.push(setRandStartXY(Burt, this.canvas.width, this.canvas.height));

        // this.figures.push(<Figure>{
        //     startx: -50, starty: 200,
        //     movex: 10, movey: 0,
        //     maxWidth: 50,
        //     shape: "><>",
        //     fillStyle: "#fff",
        //     speed: Math.floor(TIME_S / 10),
        // });
        //
        // this.figures.push(<Figure>{
        //     startx: -50, starty: 400,
        //     movex: 10, movey: 0,
        //     maxWidth: 50,
        //     shape: "><>",
        //     fillStyle: "#fff",
        //     speed: Math.floor(TIME_S / 10),
        // });
        //
        //
        // this.figures.push(<Figure>{
        //     startx: -50, starty: 700,
        //     movex: 10, movey: 0,
        //     maxWidth: 50,
        //     shape: "><>",
        //     fillStyle: "#fff",
        //     speed: Math.floor(TIME_S / 10),
        // });
        //
        // this.figures.push(<Figure>{
        //     startx: this.canvas.width + 50, starty: 100,
        //     movex: -10, movey: 0,
        //     maxWidth: 50,
        //     shape: "<><",
        //     fillStyle: "#fff",
        //     speed: Math.floor(TIME_S / 10),
        // });
        //
        //
        // this.figures.push(<Figure>{
        //     startx: this.canvas.width + 50, starty: 200,
        //     movex: -10, movey: 0,
        //     maxWidth: 50,
        //     shape: "<><",
        //     fillStyle: "#fff",
        //     speed: Math.floor(TIME_S / 10),
        // });
        //
        // this.figures.push(<Figure>{
        //     startx: this.canvas.width + 50, starty: 400,
        //     movex: -10, movey: 0,
        //     maxWidth: 50,
        //     shape: "<><",
        //     fillStyle: "#fff",
        //     speed: Math.floor(TIME_S / 10),
        // });
        //
        //
        // this.figures.push(<Figure>{
        //     startx: this.canvas.width + 50, starty: 700,
        //     movex: -10, movey: 0,
        //     maxWidth: 50,
        //     shape: "<><",
        //     fillStyle: "#fff",
        //     speed: Math.floor(TIME_S / 10),
        // });
    }

    private clear(figure: Figure) {
        // this.context.fillStyle = "gray";
        this.context.fillStyle = this.background;
        // INFO: we take the first one because all of them have the same width
        const text = this.context.measureText(figure.shape[0]);
        const w = Math.max(text.width, figure.maxWidth);
        const h = Math.max(text.actualBoundingBoxAscent, this.fontsize)+6;
        this.context.fillRect(figure.x!, figure.y!-h+6, w, h);
    }

    private move(figure: Figure) {
        const movex = figure?.movex ?? 0;
        const movey = figure?.movey ?? 0;
        const textWidth = this.context.measureText(figure.shape[0]).width;
        if ((figure?.x === undefined || Number.isNaN(figure?.x))
            || (figure?.y === undefined || Number.isNaN(figure?.y))) {
            if (figure.startx === null || figure.starty === null) {
                throw new Error("need at least start x and y.");
            }
            figure.x = figure.startx + movex;
            figure.y = figure.starty + movey;
            if (movex === 0 && movey === 0) {
                this.reset(figure);
            }
            return;
        }

        figure.x += movex;
        figure.y += movey;

        const leftReached = (movex < 0) && figure.x <= (0 - textWidth);
        const rightReached = (movex > 0) && figure.x >= (this.canvas.width + textWidth);
        const bottomReached = (movey > 0) && figure.y >= (this.canvas.height + this.fontsize);
        const topReached = (movey < 0) && figure.y <= (0 - this.fontsize);
        if (topReached || bottomReached || leftReached || rightReached) {
            this.reset(figure);
        }
    }

    private draw(figure: Figure) {
        figure.interval = setInterval(() => {
            this.clear(figure);
            this.move(figure);
            this.context.fillStyle = figure.fillStyle;
            for (const tile of figure.shape) {
                // console.log(tile)
                this.context.fillText(tile, figure.x!, figure.y!, figure.maxWidth);
            }
        }, figure.speed);
    }

    private reset(figure: Figure) {
        clearInterval(figure.interval);
        console.info("Cleared at x:%d, y:%d", figure.x, figure.y);
        figure.interval = undefined;
        figure.x = undefined;
        figure.y = undefined;
        // Loop it endlessly
        // this.draw(figure);
    }

    /**
     * Render all figures again. Should only be called once.
    */
    render() {
        this.prerender();
        for (const figure of this.figures) {
            this.draw(figure);
        }
    }

    /**
     * Start/Resume the drawing.
    */
    start() {
        for (const figure of this.figures) {
            this.draw(figure);
        }
    }

    /**
     * Stop the drawing.
    */
    stop() {
        for (const figure of this.figures) {
            clearInterval(figure.interval);
        }
    }
}

export default FishiesRenderer;
