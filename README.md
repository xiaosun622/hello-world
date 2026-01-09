# Kaboom.js Platform Game

A simple platform game built with HTML, JavaScript, and Kaboom.js featuring a player that can move left/right and jump on platforms. All graphics use simple square shapes instead of sprites.

## Features

- **Player Movement**: Move left and right with arrow keys or A/D keys
- **Jumping**: Jump with the spacebar
- **Platforms**: Multiple platforms to jump between
- **Physics**: Realistic gravity and collision detection
- **Simple Graphics**: All elements are simple colored squares

## How to Run

### Option 1: Open Directly in Browser

1. Make sure you have all three files in the same directory:
   - `game.html`
   - `game.js`
   - `README.md` (optional)

2. Double-click `game.html` to open it in your default web browser.

3. The game should start automatically. Make sure you have an internet connection as the game loads Kaboom.js from a CDN.

### Option 2: Using a Local Server (Recommended)

For a better development experience, use a local web server:

#### Using Python (if installed):
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Then open `http://localhost:8000/game.html` in your browser.

#### Using Node.js (if installed):
```bash
# Install http-server globally (one time only)
npm install -g http-server

# Run the server
http-server
```
Then open `http://localhost:8080/game.html` in your browser.

#### Using VS Code:
Install the "Live Server" extension and right-click on `game.html` → "Open with Live Server"

## How to Play

### Controls

- **Arrow Left** or **A**: Move player to the left
- **Arrow Right** or **D**: Move player to the right
- **Spacebar**: Jump (only works when the player is on the ground)

### Gameplay

- The red square is your player character
- The green rectangle at the bottom is the ground platform
- The brown rectangles are floating platforms
- Move left and right to navigate between platforms
- Jump when you're on a platform to reach higher platforms
- The player wraps around horizontally when reaching the edges of the screen

## File Structure

```
├── game.html      # Main HTML file with game container
├── game.js        # Game logic and Kaboom.js code
└── README.md      # This file
```

## Technical Details

- **Framework**: Kaboom.js v3000
- **Game Dimensions**: 800x600 pixels
- **Physics**: Custom gravity (800) and jump force (400)
- **Player Speed**: 200 pixels per second

## Requirements

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for loading Kaboom.js from CDN)
- No installation or build process required

## Customization

You can modify the game by editing `game.js`:

- Change `SPEED` to adjust movement speed
- Change `JUMP_FORCE` to adjust jump height
- Change `GRAVITY` to adjust fall speed
- Modify platform positions and sizes
- Change colors by modifying the RGB values in the `color()` functions

## License

This is a simple example project. Feel free to use and modify as needed.
