import asyncio
import websockets
import subprocess
import psutil
import json
import os

connected = set()

class startServer():
    def __init__(self):
        print("Thread Started")
        self.port = asyncio.run(self.portFinder())
        asyncio.run(self.initialize())  
  
    def process_pid_running(self, pid):
        try:
            return psutil.pid_exists(pid)
        except Exception:
            return False
          
    async def portFinder(self):
        proc = await asyncio.create_subprocess_exec(
            "powershell",
            "spicetify -e path obsnowplaying.js",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.STDOUT,
            creationflags=subprocess.CREATE_NO_WINDOW
        ) 
        while self.process_pid_running(proc.pid):
            line = str(await proc.stdout.readline(), encoding="utf-8")
            if line.strip() != "":
                output = line.strip()
        
        with open(output, 'r') as f:
            for line in f:
                if 'WebSocket' in line:
                    string = line.strip()
                    index = string.rindex('/')
                    port = string[index-4:index]
                    print(f"port: {port} found!")
                    return port

    async def handler(self, websocket, path):
        print("A client just connected")
        connected.add(websocket)
        try:
            async for message in websocket:
                print(message)
                for conn in connected:
                    if conn != websocket:
                        await conn.send(message)
        except websockets.exceptions.ConnectionClosedError:
            print("Client disconnected, attempting to reconnect.")
            return
            
    async def initialize(self):
        print("Server Ready, waiting for client.")
        async with websockets.serve(self.handler, "localhost", self.port):
            await asyncio.Future()