export class LineManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.lines = [];
    }

    spawnLine(speedMultiplier) {
        const side = Math.floor(Math.random() * 4); // 0 = top, 1 = right, 2 = bottom, 3 = left
        const speed = (Math.random() * 50 + 150) * speedMultiplier;

        let line = { x: 0, y: 0, width: 0, height: 0, dx: 0, dy: 0 };
        switch (side) {
            case 0: // Top
                line = {
                    x: Math.random() * this.canvas.width,
                    y: 0,
                    width: Math.random() * this.canvas.width,
                    height: 20,
                    dx: 0,
                    dy: speed,
                };
                break;
            case 1: // Right
                line = {
                    x: this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    width: 20,
                    height: Math.random() * this.canvas.height,
                    dx: -speed,
                    dy: 0,
                };
                break;
            case 2: // Bottom
                line = {
                    x: Math.random() * this.canvas.width,
                    y: this.canvas.height,
                    width: Math.random() * this.canvas.width,
                    height: 20,
                    dx: 0,
                    dy: -speed,
                };
                break;
            case 3: // Left
                line = {
                    x: 0,
                    y: Math.random() * this.canvas.height,
                    width: 20,
                    height: Math.random() * this.canvas.height,
                    dx: speed,
                    dy: 0,
                };
                break;
        }
        this.lines.push(line);
    }

    updateLines(deltaTime) {
        this.lines.forEach((line) => {
            line.x += line.dx * deltaTime;
            line.y += line.dy * deltaTime;
        });

        // Filter out lines that go off screen
        this.lines = this.lines.filter(
            (line) =>
                line.x + line.width > 0 &&
                line.x < this.canvas.width &&
                line.y + line.height > 0 &&
                line.y < this.canvas.height
        );
    }

    drawLines(ctx, color) {
        ctx.fillStyle = color;
        this.lines.forEach((line) => {
            ctx.fillRect(line.x, line.y, line.width, line.height);
        });
    }
}
