async function getSongs() {
    let a = await fetch("./songs/");
    let response = await a.text();
    // console.log(response);
    let element = document.createElement("div");

    element.innerHTML = response;
    // console.log(element);
    
    let tiles = element.getElementsByTagName("a");
    let songinfo = {
        songs: [],
        songNames: []
    }
    for (let index = 0; index < tiles.length; index++) {
        if (tiles[index].href.endsWith(".ogg")){
            songinfo.songNames.push(tiles[index].getElementsByTagName("span")[0].innerText);
            songinfo.songs.push(tiles[index].href);
        }
    }
    return songinfo
}


async function main () {
    let songinfo = await getSongs();
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    let audios = []
    let songbuttons = document.querySelector(".songbuttons").getElementsByTagName("button")
    let last_played;
    let last_played2;
    songbuttons[1].onclick = () => {
        last_played = audios.pop()
        if(last_played)
            last_played.pause()
        else {
            last_played2.play()
            audios.push(last_played2)
        }
    }
    songbuttons[0].onclick = () => {
        if(last_played2){
            last_played2.currentTime = 0
            last_played2.play()
        }
    }
    let i=-1;
    for (const song of songinfo.songNames) {
        let li = document.createElement("li")
        let button = document.createElement("button")
        i++;
        button.innerText = song.replace(".ogg", "")
        button.dataset.url = songinfo.songs[i]
        button.style.width = "100%"
        button.onclick = () => {
            last_played = audios.pop()
            if (last_played){
                last_played.pause()
            }
            
            let audio = new Audio(button.dataset.url)
            audios.push(audio)
            audio.play()
            last_played2 = audio;
        }
        li.appendChild(button)
        songUL.appendChild(li)
    }
}
main()
