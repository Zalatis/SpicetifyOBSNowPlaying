import obspython as obs
import threading
import sys
from modules import network

def script_description():
  return """
  SpicetifyOBS:
      Reads websocket data from the webnowplaying extension.
      This data includes but is not limited to: 
      Title, 
      album, 
      and art.
      This data is then formatted into a graphical source.
  """   

def thread():
    thread = threading.Thread(target=network.startServer)
    thread.daemon = True
    thread.start()
    return thread

def close():
    thread()._Thread_stop()

def on_event(event):
    if event == obs.OBS_FRONTEND_EVENT_FINISHED_LOADING:
        print("OBS Ready")
        thread()
    if event == obs.OBS_FRONTEND_EVENT_SCRIPTING_SHUTDOWN:
        print("Shutting down")
        close()
        
def script_load(settings):
    obs.obs_frontend_add_event_callback(on_event)
    
