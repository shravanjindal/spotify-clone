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
        if (tiles[index].href.endsWith(".ogg")) {
            songinfo.songNames.push(tiles[index].getElementsByTagName("span")[0].innerText);
            songinfo.songs.push(tiles[index].href);
        }
    }
    return songinfo
}

async function addevents() {
    let cards1 = document.querySelectorAll(".artist-card")
    let cards2 = document.querySelectorAll(".playlist-card")
    for (const card of cards1) {
        // Add event listeners for mouseover and mouseout
        card.addEventListener('mouseover', () => {
            const playButton = card.querySelector('.play');
            playButton.style.opacity = '1'
            card.classList.add("hovered")
        });
        card.addEventListener('mouseout', () => {
            const playButton = card.querySelector('.play');
            playButton.style.opacity = '0'
            card.classList.remove("hovered")
        });
    }
    for (const card of cards2) {
        // Add event listeners for mouseover and mouseout
        card.addEventListener('mouseover', () => {
            const playButton = card.querySelector('.play');
            playButton.style.opacity = '1'
            card.classList.add("hovered")
        });
        card.addEventListener('mouseout', () => {
            const playButton = card.querySelector('.play');
            playButton.style.opacity = '0'
            card.classList.remove("hovered")
        });
    }
}
let audios = []
let buttons = []
let songtimes = document.querySelector(".songtime").getElementsByTagName("span")
let songinfo = document.querySelector(".songinfo")
let circle = document.querySelector(".circle")

// Function to format time (seconds) into mm:ss
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
const timer = setInterval(() => {
    if (audios[audios.length - 1])
        songtimes[0].innerText = formatTime(audios[audios.length - 1].currentTime)
}, 500)
const timer2 = setInterval(() => {
    if (audios[audios.length - 1])
        songtimes[1].innerText = formatTime(audios[audios.length - 1].duration)
}, 500)
const timer4 = setInterval(() => {
    if (audios[audios.length - 1])
        songinfo.innerText = buttons[buttons.length-1].childNodes[1].innerText
}, 500)

const timer3 = setInterval(() => {
    if (audios[audios.length - 1]) {
        circle.style.left = `${((audios[audios.length - 1].currentTime) / (audios[audios.length - 1].duration)) * 100}%`
    }
}, 100)

const slide = (x, w) => {
    if (audios[audios.length - 1]) {
        audios[audios.length - 1].currentTime = (x / w) * audios[audios.length - 1].duration
        circle.style.left = `${(x / w) * 100}%`
    }
}

async function main() {
    let songinfo = await getSongs();
    addevents()
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]

    let songbuttons = document.querySelector(".songbuttons").getElementsByTagName("button")

    let last_played;
    let playbtn = songbuttons[1]


    // Add an event listener for beforeunload
    window.addEventListener('beforeunload', () => {
        last_played = audios.pop()
        if (!last_played.paused)
            last_played.pause()
    });
    songbuttons[1].onclick = () => {
        last_played = audios[audios.length - 1]
        let button = buttons[buttons.length - 1]
        if (!last_played.paused) {
            last_played.pause()
            button.innerHTML = `<img src="music.svg"><p>${button.childNodes[1].innerText}</p><img src="play2.svg"></img>`
            playbtn.childNodes[0].src = "play2.svg"
        }
        else {
            last_played.play()
            button.innerHTML = `<img src="music.svg"><p>${button.childNodes[1].innerText}</p><img src="play.svg"></img>`
            playbtn.childNodes[0].src = "play.svg"
        }
    }
    songbuttons[0].onclick = () => {
        last_played = audios[audios.length - 1]
        if (last_played) {
            last_played.currentTime = 0
            buttons[buttons.length - 1].innerHTML = `<img src="music.svg"><p>${buttons[buttons.length - 1].childNodes[1].innerText}</p><img src="play.svg"></img>`
            last_played.play()
            playbtn.childNodes[0].src = "play.svg"
        }
    }
    songbuttons[0].ondblclick = () => {
        last_played = audios[audios.length - 1]
        let last_played2 = audios[audios.length - 2]
        let button1 = buttons[buttons.length - 1]
        let button2 = buttons[buttons.length - 2]

        if (last_played2) {
            last_played.pause()
            button1.innerHTML = `<img src="music.svg"><p>${button1.childNodes[1].innerText}</p><img src="play2.svg"></img>`
            button2.innerHTML = `<img src="music.svg"><p>${button2.childNodes[1].innerText}</p><img src="play.svg"></img>`
            audios.push(last_played2)
            buttons.push(button2)
            last_played2.currentTime = 0
            last_played2.play()
            playbtn.childNodes[0].src = "play.svg"
        }
    }
    let i = -1;
    for (const song of songinfo.songNames) {
        let li = document.createElement("li")
        let button = document.createElement("button")
        i++;
        button.innerHTML = `<img src="music.svg"><p>${song.replace(".ogg", "")}</p><img src="play2.svg"></img>`
        button.dataset.url = songinfo.songs[i]

        button.onclick = () => {
            last_played = audios[audios.length - 1]
            if (last_played) {
                let button = buttons[buttons.length - 1]
                button.innerHTML = `<img src="music.svg"><p>${button.childNodes[1].innerText}</p><img src="play2.svg"></img>`
                last_played.pause()
                playbtn.childNodes[0].src = "play2.svg"
            }
            button.innerHTML = `<img src="music.svg"><p>${button.childNodes[1].innerText}</p><img src="play.svg"></img>`
            let audio = new Audio(button.dataset.url)
            audios.push(audio)
            buttons.push(button)
            audio.play()
            playbtn.childNodes[0].src = "play.svg"
        }
        li.appendChild(button)
        songUL.appendChild(li)
    }
    let seekbar = document.querySelector(".seekbar")
    seekbar.addEventListener("click", (e) => {
        slide(e.offsetX, seekbar.offsetWidth);
    })
}
main()
