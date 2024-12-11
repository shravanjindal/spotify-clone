let audios = []
let buttons = []
let newElements = []
let songtimes = document.querySelector(".songtime").getElementsByTagName("span")
let songinfo = document.querySelector(".songinfo")
let circle = document.querySelector(".circle")
let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
let songbuttons = document.querySelector(".songbuttons").getElementsByTagName("button")
let last_played;
let playbtn = songbuttons[1]
let repeatInfo = false

// Function to format time (seconds) into mm:ss
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
const timer = setInterval(() => {
    if (audios[audios.length - 1]) {
        songtimes[0].innerText = formatTime(audios[audios.length - 1].currentTime)
        songtimes[1].innerText = formatTime(audios[audios.length - 1].duration)
        songinfo.innerText = buttons[buttons.length - 1].childNodes[1].innerText
        if (audios[audios.length - 1].currentTime === audios[audios.length - 1].duration){
            if (!repeatInfo)
                playnext()
            else
                playfromStart()
        }
    }
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

async function getSongs(dir) {
    let a = await fetch(dir);
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
        if (tiles[index].href.endsWith(".mp3")) {
            songinfo.songNames.push(tiles[index].getElementsByTagName("span")[0].innerText);
            songinfo.songs.push(tiles[index].href);
        }
    }
    return songinfo
}

async function playbarController() {
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
    // let clickTimer;

    songbuttons[0].addEventListener('click', () => {
        // Single-click logic
        playfromStart()
    });
    songbuttons[0].addEventListener('dblclick', () => {
        // Double-click logic
        let currBtn = buttons[buttons.length - 1];
        let element;
        let prev;
        for (let i = 0; i < newElements.length; i++) {
            element = newElements[i];
            if (element.childNodes[0] == currBtn) {
                prev = (newElements.length + i - 1) % newElements.length;
                break;
            }
        }
        let audio = new Audio(newElements[prev].childNodes[0].dataset.url);
        audios[audios.length - 1].pause();
        buttons[buttons.length - 1].childNodes[2].src = "play2.svg";
        audios.push(audio);
        buttons.push(newElements[prev].childNodes[0]);
        buttons[buttons.length - 1].childNodes[2].src = "play.svg";
        audio.play();
        playbtn.childNodes[0].src = "play.svg";
    });

    songbuttons[2].onclick = () => {
        playnext()
    }
    songbuttons[3].onclick = () => {
        if(repeatInfo){
            repeatInfo = false
            songbuttons[3].style.border = "2px solid #1ed760"
        }
        else{
            repeatInfo = true
            songbuttons[3].style.border = "2px solid #ff0000"
        }
    }
}
function playfromStart() {
    if (audios[audios.length - 1]) {
        audios[audios.length - 1].currentTime = 0;
        buttons[buttons.length - 1].innerHTML = `<img src="music.svg"><p>${buttons[buttons.length - 1].childNodes[1].innerText}</p><img src="play.svg"></img>`;
        audios[audios.length - 1].play();
        playbtn.childNodes[0].src = "play.svg";
    }
}

function playnext (){
    let currBtn = buttons[buttons.length-1]
    let element;
    let next;
    for (let i = 0; i  < newElements.length; i++) {
        element = newElements[i];
        if(element.childNodes[0] == currBtn){
            next = (i+1)%newElements.length
            break;
        }
    }
    let audio = new Audio(newElements[next].childNodes[0].dataset.url)
    audios[audios.length-1].pause()
    buttons[buttons.length-1].childNodes[2].src = "play2.svg"
    audios.push(audio)
    buttons.push(newElements[next].childNodes[0])
    buttons[buttons.length-1].childNodes[2].src = "play.svg"
    audio.play()
    playbtn.childNodes[0].src = "play.svg"
}

async function main(songinfo) {
    // Add an event listener for beforeunload
    window.addEventListener('beforeunload', () => {
        last_played = audios.pop()
        if (!last_played.paused)
            last_played.pause()
    });
    let i = -1;
    for (const song of songinfo.songNames) {
        let li = document.createElement("li")
        let button = document.createElement("button")
        i++;
        button.innerHTML = `<img src="music.svg"><p>${song.replace(".mp3", "")}</p><img src="play2.svg"></img>`
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
        newElements.push(li)
        songUL.appendChild(li)
    }
    let seekbar = document.querySelector(".seekbar")
    seekbar.addEventListener("click", (e) => {
        slide(e.offsetX, seekbar.offsetWidth);
    })
}

async function addevents() {
    let cards1 = document.querySelectorAll(".artist-card")
    let cards2 = document.querySelectorAll(".playlist-card")
    let open = false
    document.querySelector(".hamburger").addEventListener ('click', () => {
        if (!open){
            open = true
            document.querySelector(".left").style.left = "0%";
            document.querySelector(".right").style.opacity = "10%"
        }
        else{
            open = false
            document.querySelector(".left").style.left = "-100%";
            document.querySelector(".right").style.opacity = "1"
        }
    });
    window.addEventListener("resize", () => {
        const viewportWidth = document.documentElement.offsetWidth; // or window.innerWidth
        const leftElement = document.querySelector(".left");
        if (viewportWidth > 1450) {
            if (leftElement) {
                leftElement.style.left = "0%";
            }
        }
        else
            leftElement.style.left = "-100%";

    });
    document.querySelector(".left-hamburger").addEventListener ('click', () => {
        if(open){
            document.querySelector(".left").style.left = "-100%";
            document.querySelector(".right").style.opacity = "1"
        }
    });
    document.addEventListener("click", (e) => {
        if (open)
            if(e.offsetX > 373){
                open = false
                document.querySelector(".left").style.left = "-100%";
                document.querySelector(".right").style.opacity = "1"
            }
    })
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

        card.addEventListener('click', async () => {
            let artist = (card.childNodes[5].innerText).toLowerCase();
            let songinfo = await getSongs(`./playlists/${artist}-songs/`);
            for (const li of newElements) {
                li.remove();
            }
            while (newElements.length != 0) {
                newElements.pop()
            }
            main(songinfo);
            if (document.style.offsetWidth < 1450){
                open = true
                document.querySelector(".left").style.left = "0%";
                document.querySelector(".right").style.opacity = "10%"
            }
        })
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
        card.addEventListener('click', async () => {
            let artist = (card.childNodes[5].innerText).toLowerCase();
            let songinfo = await getSongs(`./playlists/${artist}-songs/`);
            for (const li of newElements) {
                li.remove();
            }
            while (newElements.length != 0) {
                newElements.pop()
            }
            main(songinfo);
            if (document.style.offsetWidth < 1450){
                open = true
                document.querySelector(".left").style.left = "0%";
                document.querySelector(".right").style.opacity = "10%"
            }
        })
    }
}

addevents()
playbarController()
