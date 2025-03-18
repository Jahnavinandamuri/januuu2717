from flask import Flask
import os
import subprocess
from datetime import datetime
import pytz

app = Flask(__name__)

@app.route('/htop')
def htop():
    full_name = "Your Full Name"
    username = os.getenv("USER") or os.getenv("USERNAME") or "codespace"

    ist = pytz.timezone('Asia/Kolkata')
    server_time = datetime.now(ist).strftime('%Y-%m-%d %H:%M:%S %Z')

    top_output = subprocess.run(['top', '-b', '-n', '1'], capture_output=True, text=True).stdout
    top_lines = "\n".join(top_output.split("\n")[:10])

    return f"""
    <html>
    <head><title>System Info</title></head>
    <body>
        <h1>System Information</h1>
        <p><strong>Name:</strong> {full_name}</p>
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Server Time (IST):</strong> {server_time}</p>
        <h2>Top Output (First 10 Lines)</h2>
        <pre>{top_lines}</pre>
    </body>
    </html>
    """

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081, debug=True)
