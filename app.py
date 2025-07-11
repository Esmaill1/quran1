from flask import Flask, render_template, send_from_directory
import datetime

app = Flask(__name__)

@app.route('/')
def index():
    # Get current time for display
    current_time = datetime.datetime.now().strftime("%H:%M")
    return render_template('index.html', current_time=current_time)

@app.route('/test')
def test_stream():
    return send_from_directory('.', 'test_stream.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 