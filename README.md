# SpicetifyOBSNowPlaying
Tired of using the Spotify API to have a NowPlaying on your Stream? Use this Spotify extension with its OBS script

# Preview : 
![](https://github.com/Zalatis/SpicetifyOBSNowPlaying/blob/main/Preview/preview.gif?raw=true)

# Requirements : 
- Have Spotify installed
- Have Spicetify installed 
[My Spicetify Installer (Windows)](https://github.com/Zalatis/Install-spicetify-cli "My Spicetify Installer (Windows)") |
[Official Spicetify repo](https://github.com/spicetify/spicetify-cli "Official Spicetify repo")
- Have [Python](https://www.python.org/downloads/ "Python") Installed

# Installation : 
- Put `obsnowplaying.js` that is inside the `Spicetify Extension` to this path : `C:\Users\<Users>\AppData\Roaming\spicetify\Extensions`
- Open a terminal and do `spicetify config extensions obsnowplaying.js` then `spicetify apply`
- On OBS click on Tools -> Scripts and setup your Python Path
- Extract the content of OBS Files wherever you want on your PC and add `OBS Files\Script\SpicetifyOBS.py` as a script
- You can now add `OBS Files\Website Source\widget.html` as a website source on OBS
- Close and open back OBS and you're done 🙂

# Credits : 
- obsnowplaying.js is based on [webnowplaying.js default extension of Spicetify](https://github.com/spicetify/spicetify-cli/blob/master/Extensions/webnowplaying.js "webnowplaying.js default extension of Spicetify")
- widget.html based on [Tuna widget.html](https://github.com/univrsal/tuna "Tuna widget.html")
- And a huge thanks to [@ohitstom](https://www.github.com/ohitstom "@ohitstom") for the help on the OBS Script
