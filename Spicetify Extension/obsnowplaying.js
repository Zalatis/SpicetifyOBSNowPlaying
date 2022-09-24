// NAME: obsnowplaying
// AUTHOR: Zalati & ohitstom
// DESCRIPTION: Get song information and send it to a websocket server

/// <reference path="../globals.d.ts" />

(function OBSNowPlaying() {
    if (!Spicetify.CosmosAsync || !Spicetify.Platform) {
        setTimeout(OBSNowPlaying, 500);
        return;
    }

    let currentMusicInfo;
    let ws;
    let currState = 0;
    const storage = {};
    function updateStorage(data) {
        if (!data?.track?.metadata) {
            return;
        }
        const meta = data.track.metadata;
        storage.TITLE = meta.title;
        storage.ALBUM = meta.album_title;
        storage.DURATION = parseInt(meta.duration);
        storage.STATE = !data.is_paused ? 1 : 2;
        storage.REPEAT = data.options.repeating_track ? 2 : data.options.repeating_context ? 1 : 0;
        storage.SHUFFLE = data.options.shuffling_context ? 1 : 0;
        storage.ARTIST = meta.artist_name;
        let artistCount = 1;
        while (meta["artist_name:" + artistCount]) {
            storage.ARTIST += ", " + meta["artist_name:" + artistCount];
            artistCount++;
        }
        if (!storage.ARTIST) {
            storage.ARTIST = meta.album_title; // Podcast
        }

        Spicetify.Platform.LibraryAPI.contains(data.track.uri).then(([added]) => (storage.RATING = added ? 5 : 0));

        const cover = meta.image_xlarge_url;
        if (cover?.indexOf("localfile") === -1) {
            storage.COVER = "https://i.scdn.co/image/" + cover.substring(cover.lastIndexOf(":") + 1);
        } else {
            storage.COVER = "";
        }
    }

    Spicetify.CosmosAsync.sub("sp://player/v2/main", updateStorage);

    function updateInfo() {
        if (!Spicetify.Player.data && currState !== 0) {
            ws.send("STATE:" + 0);
            currState = 0;
            return;
        }

        storage.POSITION = Spicetify.Player.getProgress();
        storage.VOLUME = Math.round(Spicetify.Player.getVolume() * 100);

        for (const field in storage) {
            try {
                const data = storage[field];
                if (data !== undefined && currentMusicInfo[field] !== data) {
                    ws.send(JSON.stringify(storage));
                    currentMusicInfo[field] = data;
                }
            } catch (e) {
                ws.send(`Error:Error updating ${field} for Spotify Desktop`);
                ws.send("ErrorD:" + e);
            }
        }
    }

    (function init() {
        ws = new WebSocket("ws://127.0.0.1:1111/");
        let sendData;

        ws.onopen = () => {
            currState = 1;
            currentMusicInfo = {};
            sendData = setInterval(updateInfo, 500);
        };

        ws.onclose = () => {
            clearInterval(sendData);
            setTimeout(init, 2000);
        };

    })();

    window.onbeforeunload = () => {
        ws.onclose = null; // disable onclose handler first
        ws.close();
    };
})();
