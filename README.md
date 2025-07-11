# Relax Radio - Calming Stream Player

A beautiful, calming radio streaming website built with Flask, featuring smooth animations and a relaxing design.

## Features

- 🎵 Streams relaxing radio from https://stream.radiojar.com/8s5u5tpdtwzuv
- 🎨 Beautiful animated background with floating shapes
- 📱 Fully responsive and mobile-friendly
- ⏰ Real-time clock display
- 🎮 Smooth play/pause button with animations
- 🌊 Gradient animations and hover effects
- 🔄 Auto-play support (with graceful fallback)

## Installation

1. **Clone or download the project files**

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application:**
   ```bash
   python app.py
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:5000
   ```

## Project Structure

```
/project
├── app.py              # Flask application
├── requirements.txt    # Python dependencies
├── static/
│   ├── style.css      # Styling and animations
│   └── script.js      # Audio controls and interactions
└── templates/
    └── index.html     # Main page template
```

## Features Explained

### Design
- **Calming Color Palette**: Soft blues, purples, and gradients
- **Animated Background**: Smooth gradient transitions and floating shapes
- **Glass Morphism**: Translucent player card with backdrop blur
- **Typography**: Clean Inter font for excellent readability

### Functionality
- **Audio Streaming**: Direct stream from RadioJar
- **Play/Pause Control**: Smooth button animations
- **Status Indicators**: Visual feedback for loading, playing, and error states
- **Mobile Responsive**: Optimized for all screen sizes
- **Auto-play**: Attempts to start automatically (respects browser policies)

### Technical Highlights
- **Pure CSS Animations**: No external animation libraries needed
- **Vanilla JavaScript**: Clean, efficient audio controls
- **Flask Backend**: Simple, fast Python web server
- **Progressive Enhancement**: Works even if JavaScript is disabled

## Browser Compatibility

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Changing the Radio Stream
Edit the audio source in `templates/index.html`:
```html
<source src="YOUR_STREAM_URL" type="audio/mpeg">
```

### Modifying Colors
Update the CSS variables in `static/style.css`:
```css
body {
    background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
}
```

### Adding More Stations
Extend the JavaScript in `static/script.js` to handle multiple audio sources.

## Troubleshooting

### Audio Not Playing
- Check if the stream URL is still active
- Ensure your browser allows autoplay
- Try clicking the play button manually

### Mobile Issues
- Some mobile browsers require user interaction before playing audio
- The app gracefully handles this with clear status messages

### Performance
- The app uses efficient CSS animations
- Audio streaming is handled natively by the browser
- Minimal JavaScript for smooth performance

## License

This project is open source and available under the MIT License.

---

Enjoy your relaxing radio experience! 🎧✨ 