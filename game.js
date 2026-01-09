// Wait for both DOM and Kaboom.js to be ready
function initGame() {
    // Check if Kaboom is loaded
    if (typeof kaboom === 'undefined') {
        // Retry after a short delay
        setTimeout(initGame, 50);
        return;
    }

    // Initialize Kaboom - simplest approach: let it append to body
    // This ensures all event listeners work correctly
    kaboom({
        width: 800,
        height: 600,
        background: [135, 206, 235], // Sky blue background
    });
    
    // Move canvas to container and make it focusable
    wait(0.1, () => {
        const container = document.getElementById("game-container");
        const canvas = document.querySelector("canvas");
        if (container && canvas && canvas.parentNode !== container) {
            canvas.remove();
            container.appendChild(canvas);
        }
        if (canvas) {
            canvas.tabIndex = 0;
            canvas.style.outline = "none";
            canvas.focus();
            // Click to focus
            canvas.addEventListener("click", () => {
                canvas.focus();
                console.log("Canvas focused");
            });
        }
    });

    // Define game constants
    const SPEED = 200;
    const JUMP_FORCE = 600;
    const GRAVITY = 800;
    const ENEMY_SPEED = 100;
    
    // Game state
    let score = 0;
    let gameOver = false;

    // Set gravity
    setGravity(GRAVITY);

    // Create platforms (ground and floating platforms) with cartoon outlines
    // Ground platform at the bottom
    add([
        rect(800, 40),
        pos(0, 560),
        color(20, 100, 20), // Dark green outline
        z(0),
    ]);
    add([
        rect(800 - 4, 40 - 4),
        pos(2, 562),
        area(),
        body({ isStatic: true }),
        color(34, 139, 34), // Forest green fill
        z(1),
        "platform",
    ]);

    // Floating platforms - making them more visible with thicker height and outlines
    add([
        rect(200, 30),
        pos(200, 400),
        color(80, 40, 10), // Dark brown outline
        z(0),
    ]);
    add([
        rect(200 - 4, 30 - 4),
        pos(202, 402),
        area(),
        body({ isStatic: true }),
        color(139, 69, 19), // Brown fill
        z(1),
        "platform",
    ]);

    add([
        rect(200, 30),
        pos(500, 300),
        color(80, 40, 10), // Dark brown outline
        z(0),
    ]);
    add([
        rect(200 - 4, 30 - 4),
        pos(502, 302),
        area(),
        body({ isStatic: true }),
        color(139, 69, 19), // Brown fill
        z(1),
        "platform",
    ]);

    add([
        rect(200, 30),
        pos(100, 200),
        color(80, 40, 10), // Dark brown outline
        z(0),
    ]);
    add([
        rect(200 - 4, 30 - 4),
        pos(102, 202),
        area(),
        body({ isStatic: true }),
        color(139, 69, 19), // Brown fill
        z(1),
        "platform",
    ]);

    // Create player (red square with cartoon outline) - spawn on the ground platform
    const playerX = 100;
    const playerY = 560 - 32;
    const playerSize = 32;
    
    // Create player with cartoon outline
    const playerOutline = add([
        rect(playerSize, playerSize),
        pos(playerX, playerY),
        color(150, 0, 0), // Dark red outline
        z(0),
    ]);
    
    const player = add([
        rect(playerSize - 4, playerSize - 4), // Slightly smaller for outline effect
        pos(playerX + 2, playerY + 2), // Offset for outline
        area(),
        body(),
        color(255, 0, 0), // Red fill
        z(1),
        "player",
    ]);
    
    // Keep outline in sync with player
    player.onUpdate(() => {
        playerOutline.pos.x = player.pos.x - 2;
        playerOutline.pos.y = player.pos.y - 2;
    });

    // Player movement controls and screen wrapping - all in one update loop
    // Use player.move() instead of velocity for proper physics interaction when grounded
    player.onUpdate(() => {
        // Check movement keys and move accordingly
        if (isKeyDown("left") || isKeyDown("a")) {
            player.move(-SPEED, 0);
        }
        if (isKeyDown("right") || isKeyDown("d")) {
            player.move(SPEED, 0);
        }
        
        // Keep player on screen (horizontal wrap)
        if (player.pos.x < 0) {
            player.pos.x = 800;
        }
        if (player.pos.x > 800) {
            player.pos.x = 0;
        }
    });

    // Jump controls - using player.jump() method as per documentation
    onKeyPress("space", () => {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    });
    
    onKeyPress("up", () => {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    });
    
    onKeyPress("w", () => {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    });

    // Create score display
    const scoreLabel = add([
        text("Score: 0", {
            size: 20,
        }),
        pos(10, 10),
        color(255, 255, 0), // Yellow
        fixed(),
    ]);

    // Function to create a moving enemy box with cartoon outline
    function createEnemy(x, y, platformWidth, direction = 1) {
        const enemySize = 24;
        const outlineWidth = 3;
        
        // Create enemy outline
        const enemyOutline = add([
            rect(enemySize, enemySize),
            pos(x, y),
            color(150, 0, 150), // Dark magenta outline
            z(0),
        ]);
        
        // Create enemy
        const enemy = add([
            rect(enemySize - outlineWidth * 2, enemySize - outlineWidth * 2),
            pos(x + outlineWidth, y + outlineWidth),
            area(),
            body(),
            color(255, 0, 255), // Magenta fill
            z(1),
            "enemy",
            {
                direction: direction, // 1 for right, -1 for left
                startX: x,
                leftBound: x,
                rightBound: x + platformWidth - enemySize, // Account for enemy width
                outline: enemyOutline, // Keep reference to outline
            },
        ]);

        // Enemy movement - move back and forth on platform
        enemy.onUpdate(() => {
            if (gameOver) return;
            
            // Move enemy horizontally
            enemy.move(ENEMY_SPEED * enemy.direction, 0);
            
            // Keep outline in sync
            if (enemy.outline) {
                enemy.outline.pos.x = enemy.pos.x - outlineWidth;
                enemy.outline.pos.y = enemy.pos.y - outlineWidth;
            }
            
            // Reverse direction if enemy reaches platform bounds
            if (enemy.pos.x <= enemy.leftBound + outlineWidth) {
                enemy.direction = 1; // Go right
                enemy.pos.x = enemy.leftBound + outlineWidth; // Keep on platform
            } else if (enemy.pos.x >= enemy.rightBound) {
                enemy.direction = -1; // Go left
                enemy.pos.x = enemy.rightBound; // Keep on platform
            }
            
            // Enemy falls if off platform (destroy if off screen)
            if (enemy.pos.y > 600) {
                if (enemy.outline) enemy.outline.destroy();
                enemy.destroy();
            }
        });
        
        // Clean up outline when enemy is destroyed
        enemy.onDestroy(() => {
            if (enemy.outline) {
                enemy.outline.destroy();
            }
        });

        return enemy;
    }

    // Create enemies on platforms
    createEnemy(220, 400 - 24, 200); // On first floating platform
    createEnemy(520, 300 - 24, 200); // On second floating platform
    createEnemy(300, 560 - 24, 800); // On ground platform, moving

    // Function to create a collectible star with cartoon outline
    function createStar(x, y) {
        const starSize = 20;
        const outlineWidth = 2;
        
        // Create star outline
        const starOutline = add([
            rect(starSize, starSize),
            pos(x, y),
            color(200, 150, 0), // Dark yellow/orange outline
            z(0),
        ]);
        
        // Create star
        const star = add([
            rect(starSize - outlineWidth * 2, starSize - outlineWidth * 2),
            pos(x + outlineWidth, y + outlineWidth),
            area(),
            body({ isStatic: true }), // Static so it doesn't fall
            color(255, 255, 0), // Yellow fill
            z(1),
            "star",
            {
                collected: false,
                outline: starOutline,
            },
        ]);

        // Add a simple star shape effect with a pulsing animation
        let starTime = 0;
        star.onUpdate(() => {
            if (gameOver) return;
            
            // Rotate and pulse effect
            starTime += dt();
            const rotation = Math.sin(starTime * 2) * 10; // Slight rotation
            star.angle = rotation;
            if (star.outline) {
                star.outline.angle = rotation;
            }
        });
        
        // Clean up outline when star is destroyed
        star.onDestroy(() => {
            if (star.outline) {
                star.outline.destroy();
            }
        });

        return star;
    }

    // Create stars at various locations
    createStar(400, 200 - 40); // Above upper platform
    createStar(600, 300 - 40); // Above middle platform
    createStar(150, 400 - 40); // Above lower platform
    createStar(700, 560 - 40); // Above ground on right
    createStar(300, 560 - 40); // Above ground on left

    // Collision: Player collects stars
    player.onCollide("star", (star) => {
        if (!star.collected) {
            star.collected = true;
            score += 10;
            scoreLabel.text = `Score: ${score}`;
            
            // Visual effect when collecting
            add([
                text("+10", {
                    size: 24,
                    color: rgb(255, 255, 0),
                }),
                pos(star.pos),
                lifespan(0.5, { fade: 0.5 }),
            ]);
            
            // Remove the star
            star.destroy();
        }
    });

    // Collision: Player hits enemy
    player.onCollide("enemy", (enemy) => {
        if (gameOver) return;
        
        // Check if player is above enemy (stomping it)
        if (player.pos.y < enemy.pos.y - 10) {
            // Player stomps enemy
            add([
                text("Squished!", {
                    size: 20,
                    color: rgb(255, 0, 255),
                }),
                pos(enemy.pos),
                lifespan(0.5, { fade: 0.5 }),
            ]);
            // Destroy outline first, then enemy
            if (enemy.outline) enemy.outline.destroy();
            enemy.destroy();
            score += 5;
            scoreLabel.text = `Score: ${score}`;
        } else {
            // Player hit by enemy - game over
            gameOver = true;
            player.color = rgb(128, 128, 128); // Gray out player
            
            const gameOverText = add([
                text("Game Over!\nPress R to Restart", {
                    size: 32,
                    color: rgb(255, 0, 0),
                    align: "center",
                }),
                pos(400, 300),
                anchor("center"),
                fixed(),
            ]);
            
            // Restart game on 'r' key
            onKeyPress("r", () => {
                if (gameOver) {
                    location.reload(); // Reload page to restart
                }
            });
        }
    });

    // Display instructions
    const instructionText = add([
        text("Arrow Keys or A/D: Move\nSpace/Up/W: Jump\nCollect stars, avoid enemies!", {
            size: 12,
        }),
        pos(10, 550),
        color(0, 0, 0),
        fixed(),
    ]);
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    // DOM is already ready
    initGame();
}
