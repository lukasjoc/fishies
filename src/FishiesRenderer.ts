const TIME_MS = 1000;
const TIME_S = TIME_MS * 1;

export type RendererConfig = {
    width: number;
    height: number;
};

type Figure = {
    startx: number;
    starty: number;
    movex: number;
    movey: number;
    x?: number;
    y?: number;
    maxWidth: number;
    shape: string;
    interval?: ReturnType<typeof setInterval>;
    speed: number;
    // TODO: allow multi-color
    fillStyle: `#${string}` | "white" | "black";
}

class FishiesRenderer {
    private figures: Figure[] = [];
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private fontsize: number = 24;
    private background: string = "#02172d";
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
        this.context.font = `${this.fontsize}px monospace`;
    }

    private prerender() {
        this.figures.push(<Figure>{
            startx: -50, starty: 100,
            movex: 10, movey: 0,
            maxWidth: 50,
            shape: "><>",
            fillStyle: "#fff",
            speed: Math.floor(TIME_S / 10),
        });


        this.figures.push(<Figure>{
            startx: -50, starty: 200,
            movex: 10, movey: 0,
            maxWidth: 50,
            shape: "><>",
            fillStyle: "#fff",
            speed: Math.floor(TIME_S / 10),
        });

        this.figures.push(<Figure>{
            startx: -50, starty: 400,
            movex: 10, movey: 0,
            maxWidth: 50,
            shape: "><>",
            fillStyle: "#fff",
            speed: Math.floor(TIME_S / 10),
        });


        this.figures.push(<Figure>{
            startx: -50, starty: 700,
            movex: 10, movey: 0,
            maxWidth: 50,
            shape: "><>",
            fillStyle: "#fff",
            speed: Math.floor(TIME_S / 10),
        });

        this.figures.push(<Figure>{
            startx: this.canvas.width + 50, starty: 100,
            movex: -10, movey: 0,
            maxWidth: 50,
            shape: "<><",
            fillStyle: "#fff",
            speed: Math.floor(TIME_S / 10),
        });


        this.figures.push(<Figure>{
            startx: this.canvas.width + 50, starty: 200,
            movex: -10, movey: 0,
            maxWidth: 50,
            shape: "<><",
            fillStyle: "#fff",
            speed: Math.floor(TIME_S / 10),
        });

        this.figures.push(<Figure>{
            startx: this.canvas.width + 50, starty: 400,
            movex: -10, movey: 0,
            maxWidth: 50,
            shape: "<><",
            fillStyle: "#fff",
            speed: Math.floor(TIME_S / 10),
        });


        this.figures.push(<Figure>{
            startx: this.canvas.width + 50, starty: 700,
            movex: -10, movey: 0,
            maxWidth: 50,
            shape: "<><",
            fillStyle: "#fff",
            speed: Math.floor(TIME_S / 10),
        });
    }

    private clear(figure: Figure) {
        this.context.fillStyle = this.background;
        const textWidth = this.context.measureText(figure.shape).width;
        this.context.fillRect(figure.x!, figure.y! - this.fontsize, textWidth, this.fontsize);
    }

    private move(figure: Figure) {
        const movex = figure?.movex ?? 0;
        const movey = figure?.movey ?? 0;
        const textWidth = this.context.measureText(figure.shape).width;
        if ((figure?.x === undefined || Number.isNaN(figure?.x))
            || (figure?.y === undefined || Number.isNaN(figure?.y))) {
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
            this.context.fillText(figure.shape, figure.x!, figure.y!, figure.maxWidth);
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
