
export type RendererConfig = {
    width: number;
    height: number;
};

/**
 * FishiesRenderer...
 * TODO: docs
*/
class FishiesRenderer {
    public context: CanvasRenderingContext2D | null;
    constructor(public canvas: HTMLCanvasElement, config: RendererConfig) {
        canvas.width  = config.width;
        canvas.height = config.height;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
    }
    render() {
        console.log("TODO: implement the Renderer onto the canvas: ", this.canvas);
    }
}

export default FishiesRenderer;
