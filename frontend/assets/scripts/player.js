export class Player {
    constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.stamina = 100;
        this.canSprint = true;
        this.isInvincible = false;
    }

    move(keys, deltaTime, canvas, staminaRates) {
        let moveSpeed = this.speed * deltaTime;

        if (keys['shift'] && this.canSprint && this.stamina > 0) {
            moveSpeed *= 2;
            this.stamina -= staminaRates.depletion * deltaTime;
            if (this.stamina <= 0) {
                this.stamina = 0;
                this.canSprint = false;
            }
        } else {
            this.stamina += staminaRates.regeneration * deltaTime;
            if (this.stamina >= 100) {
                this.stamina = 100;
                this.canSprint = true;
            }
        }

        if (keys['w'] || keys['arrowup']) this.y -= moveSpeed;
        if (keys['s'] || keys['arrowdown']) this.y += moveSpeed;
        if (keys['a'] || keys['arrowleft']) this.x -= moveSpeed;
        if (keys['d'] || keys['arrowright']) this.x += moveSpeed;

        this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));
    }

    activateIframes(duration, cooldownTime) {
        this.isInvincible = true;
        setTimeout(() => (this.isInvincible = false), duration);
        return cooldownTime;
    }
}
