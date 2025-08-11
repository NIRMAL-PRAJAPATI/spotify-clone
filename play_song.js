console.log("lets play song . . .");

let div = document.createElement('div');
let songlist = "";
let songtitle = document.querySelector("#songtitle");
let table = document.querySelector('table');
let response = [];

let song = [];
let singers = ["neesarg ass", "pro popli", "vinyo rock", "chapri gangstar", "spl dhulo", "bhakt rudra", "sir nirmal"];

// this function is fatch the song from the API and create the song array
const fatchsong = async () => {

    $('.playsongnavicon').click(function () {
        leftbox.style.position = "absolute";
        leftbox.style.left = "0vw";
        leftbox.style.width = "100vw";
        leftbox.style.transition = "0.5s";
    })

    const repoOwner = "NIRMAL-PRAJAPATI";
    const repoName = "spotify-clone";
    const branch = "main";
    const filePath = "songs";

    // GitHub API URL to get directory contents
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}?ref=${branch}`;

    try {
        const apiResponse = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        const files = await apiResponse.json();
        
        // Filter and process MP3 files
        songlist = files.filter(file => file.name.endsWith('.mp3'));
        
        // Create song URLs for GitHub Pages
        for (let i = 0; i < songlist.length; i++) {
            const fileName = songlist[i].name;
            const songUrl = `https://${repoOwner.toLowerCase()}.github.io/${repoName}/songs/${fileName}`;
            song.push(songUrl);
        }
        
        console.log('Songs loaded:', song);
        
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
    
    return song;
}

// Get song duration
const getSongDuration = (url) => {
    return new Promise((resolve) => {
        const audio = new Audio(url);
        audio.addEventListener('loadedmetadata', () => {
            resolve(secondandminutetimer(audio.duration));
        });
        audio.addEventListener('error', () => {
            resolve('2:54'); // fallback duration
        });
    });
};

// Generate random release date in DD/MM/YYYY format
const getRandomDate = () => {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const day = String(randomDate.getDate()).padStart(2, '0');
    const month = String(randomDate.getMonth() + 1).padStart(2, '0');
    const year = randomDate.getFullYear();
    return `${day}/${month}/${year}`;
};

const songadder = async () => {
    let tbody = document.querySelector('#tbody');
    let songs = await fatchsong();

    for (let i = 0; i < songlist.length; i++) {
        const fileName = songlist[i].name;
        const songTitle = fileName.replace('.mp3', '');
        const songUrl = songs[i];
        const duration = await getSongDuration(songUrl);
        const releaseDate = getRandomDate();

        tbody.innerHTML = tbody.innerHTML + `<tr data-href="${songUrl}" title="${fileName}">
    <td>${i + 1}</td>
    <td><div class="sandcname"><img style="margin-right: 10px;" src="img/play song icon.png" height="45">
            <div>
            <h4 id="songtitle" class="color">${songTitle}</h4>
            <p>By Sponzeall</p>
            </div>
        </div></td>
        <td>${singers[i] || 'Unknown Artist'}</td>
    <td id="songreleasedate">${releaseDate}</td>
    <td id="songduration">${duration}</td>
</tr>`;
    }
}

// this function gives minute and second formate for song timer
let secondandminutetimer = (seconds) => {
    let minute = Math.floor(seconds / 60);
    let second = Math.floor(seconds % 60);

    const formattedsecond = String(second).padStart(2, "0");
    const formattedminute = String(minute).padStart(2, "0");

    return `${formattedminute}:${formattedsecond}`;
}

// this is the main function which runs first wehen script is called
let main = async () => {
    let currentsongimg = document.querySelector('#currentsongimg');
    let currentsongname = document.querySelector('#currentsongname');
    let currentsongsinger = document.querySelector('#currentsongsinger');
    let mainplaybar = document.querySelector('#playbar');
    let previous = document.querySelector("#sprevious");
    let play = document.querySelector("#splay");
    let next = document.querySelector("#snext");
    let currenttime = document.querySelector("#currenttime");
    let totaltime = document.querySelector("#totaltime");
    let seekbar = document.querySelector('#seekbar');
    let seekcircle = document.querySelector('#songcircle');
    let currentsong = new Audio();
    let currentSongIndex = 0;

    let songs = await fatchsong();

    await songadder();

    // Function to update active song effect
    const updateActiveSong = () => {
        $('#tbody tr').removeClass('active-song');
        $(`#tbody tr:eq(${currentSongIndex})`).addClass('active-song');
    };

    // Playlist play button functionality
    $("#playlist_play_btn").click(function () {
        if (songs.length > 0) {
            currentSongIndex = 0;
            currentsong.src = songs[0];
            currentsong.play();
            currentsongimg.src = "img/music wave.gif";
            currentsongname.innerHTML = songlist[0].name.replace('.mp3', '');
            currentsongsinger.innerHTML = singers[0] || 'Unknown Artist';
            mainplaybar.style.opacity = "1";
            mainplaybar.style.zIndex = "2";
            updateActiveSong();
        }
    });

    // this event is used to take current song from data and set the current song's data
    $("#tbody tr").click(function (e) {
        const songUrl = (e.currentTarget).dataset["href"];
        currentSongIndex = songs.indexOf(songUrl);
        currentsong.src = songUrl;
        currentsong.play();
        currentsongimg.src = "img/music wave.gif";
        currentsongname.innerHTML = e.currentTarget.title.split(".mp3")[0];
        currentsongsinger.innerHTML = singers[currentSongIndex] || 'Unknown Artist';
        mainplaybar.style.opacity = "1";
        mainplaybar.style.zIndex = "2";
        updateActiveSong();
    })

    // this event is used to plat and pause the song also change the UI img
    $(play).click(function () {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "img/pause.png";
        }

        else if (currentsong.play) {
            currentsong.pause();
            play.src = "img/splay.png";
        }
    })

    // this is used to set the time and roll the seekbar's circle
    currentsong.addEventListener("timeupdate", () => {

        currenttime.innerHTML = secondandminutetimer(currentsong.currentTime);
        totaltime.innerHTML = secondandminutetimer(currentsong.duration);

        seekcircle.style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";

        // this is play the next song when the current song is completed
        if (currentsong.currentTime == currentsong.duration) {
            if (currentSongIndex < songs.length - 1) {
                currentSongIndex++;
                currentsong.src = songs[currentSongIndex];
                currentsongname.innerHTML = songlist[currentSongIndex].name.replace('.mp3', '');
                currentsongsinger.innerHTML = singers[currentSongIndex] || 'Unknown Artist';
                currentsong.play();
                updateActiveSong();
            }
        }
    })

    // this is for set seekbar on the click
    seekbar.addEventListener("click", (e) => {
        let seekcirclecontroler = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

        seekbar.style.backgroundcolor = "green";
        seekcircle.style.left = seekcirclecontroler + "%";
        currentsong.currentTime = ((currentsong.duration) * seekcirclecontroler) / 100;
    })

    // this is previous song button functionality
    $(previous).click(function () {
        if (currentSongIndex > 0) {
            currentSongIndex--;
            currentsong.src = songs[currentSongIndex];
            currentsongname.innerHTML = songlist[currentSongIndex].name.replace('.mp3', '');
            currentsongsinger.innerHTML = singers[currentSongIndex] || 'Unknown Artist';
            currentsong.play();
            updateActiveSong();
        }
    })

    // this is next song button functionality
    $(next).click(function () {
        if (currentSongIndex < songs.length - 1) {
            currentSongIndex++;
            currentsong.src = songs[currentSongIndex];
            currentsongname.innerHTML = songlist[currentSongIndex].name.replace('.mp3', '');
            currentsongsinger.innerHTML = singers[currentSongIndex] || 'Unknown Artist';
            currentsong.play();
            updateActiveSong();
        }
    })
}

// Call the main function
main();