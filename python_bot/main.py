import time
import signal
import sys
import requests

WEBHOOK_URL = "https://webhook.site/f6028883-b68a-44f9-a847-d18eaa25e524"

def handle_exit(signum, frame):
    import socket
    try:
        # Get local IP address (best effort, since signal sender's IP is not available)
        try:
            hostname = socket.gethostname()
            local_ip = socket.gethostbyname(hostname)
        except Exception:
            local_ip = "unknown"
        requests.post(
            WEBHOOK_URL,
            json={
                "message": "Someone killed me",
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
                "kill_signal_received_from": local_ip,
                "signal_number": signum,
                "frame": str(frame)
            }
        )
        print("Sent kill notification!")
    except Exception as e:
        print(f"Failed to send notification: {e}")
    sys.exit(0)

# Catch termination signals
signal.signal(signal.SIGTERM, handle_exit)
signal.signal(signal.SIGINT, handle_exit)

print("Running... Kill me from another session to trigger the webhook.")

while True:
    time.sleep(1)
