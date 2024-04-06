// Data

const audioStore = [
  {
    id: "Owl_City_Fireflies.mp3",
    name: "Fireflies",
    artist: "Owlcity",
    image: "fireflies.jpg",
  },
  {
    id: "Who_Says.mp3",
    name: "Who Says",
    artist: "Selena Gomez",
    image: "Who_Says.jpg",
  },
  {
    id: "AMERSYS_VIDEO.mp3",
    name: "Piano Remix",
    artist: "Amersys",
    image: "default.jpg",
  },
  {
    id: "I_Hired_A_Random_Guy_to_Remix_Beethoven's_5th_Symphony.mp3",
    name: "Beethoven Piano Remix",
    artist: "Unknown",
    image: "default.jpg",
  },
];

// Functions
// Load the new audio file and update all related displays.
function loadAudio(index) {
  currAudio = audioStore[index];
  audioFile.src = `../audio/${currAudio.id}`;
  const image = document.querySelector(".image");
  const audioName = document.querySelector(".song-name");
  const artist = document.querySelector(".singer");
  image.src = `../images/${currAudio.image}`;
  audioName.textContent = `${currAudio.name}`;
  artist.textContent = `${currAudio.artist}`;
}

// Play the audio.
function playAudio() {
  audioFile.play();
  playButton.classList.replace("fa-play", "fa-pause");
  isAudioPlaying = true;
}

// Pause audio.
function pauseAudio() {
  audioFile.pause();
  playButton.classList.replace("fa-pause", "fa-play");
  isAudioPlaying = false;
}

// Load next song in the list.
function loadNextSong() {
  songIndex = songIndex < audioStore.length - 1 ? songIndex + 1 : 0;
  loadAudio(songIndex);
  isAudioPlaying && playAudio();
}

// Load previous song in list.
function loadPreviousSong() {
  songIndex = songIndex > 0 ? songIndex - 1 : audioStore.length - 1;
  loadAudio(songIndex);
  isAudioPlaying && playAudio();
}

// Load a random song. Used if shuffle is on.
function loadRandomSong() {
  newSongIndex = Math.floor(Math.random() * audioStore.length);
  if (newSongIndex == songIndex) {
    newSongIndex = songIndex < audioStore.length - 1 ? songIndex + 1 : 0;
  }
  songIndex = newSongIndex;
  loadAudio(songIndex);
  isAudioPlaying && playAudio();
}

// Handler for the Forward button Click.
function handleForwardClick() {
  isShuffleOn ? loadRandomSong() : loadNextSong();
}

function handleBackwardClick() {
  isShuffleOn ? loadRandomSong() : loadPreviousSong();
}

// Index of the current loaded song.
let songIndex = 0;

const audioFile = document.querySelector(".audioFile");
audioFile.addEventListener("onchange", () => {
  console.log("Changed");
});

// Adding functionality to the play button.
const playButton = document.querySelector(".play-button");
let isAudioPlaying = false;
playButton.addEventListener("click", () => {
  isAudioPlaying ? pauseAudio() : playAudio();
});

// Adding functionality to the forward button.
const forwardButton = document.querySelector(".fa-forward");
forwardButton.addEventListener("click", handleForwardClick);

// Adding functionality to the backward button.
const backwardButton = document.querySelector(".fa-backward");
backwardButton.addEventListener("click", handleBackwardClick);

// Implementing timer display.
// Total duration display loads as soon as the new song is loaded.
// Give the duration to the progress slider so that it can function properly.
const progressBar = document.querySelector(".bar");
const totalDurationTag = document.querySelector(".total-time");
audioFile.addEventListener("durationchange", (event) => {
  const duration = event.target.duration;
  progressBar.max = duration;
  let minutes = Math.floor(duration / 60);
  let seconds = Math.floor(duration % 60);
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  totalDurationTag.textContent = `${minutes}:${seconds}`;
});

// Current duration display changes every second the song progresses.
const currDurationTag = document.querySelector(".current-time");
audioFile.addEventListener("timeupdate", () => {
  const currTime = audioFile.currentTime;
  const duration = audioFile.duration;

  // Move the slider.
  progressBar.value = currTime;

  // Automatically plays next song.
  if (currTime === duration) {
    if (repeat === 2) {
      playAudio();
    } else if (repeat === 0 && songIndex === audioStore.length - 1) {
      playButton.classList.replace("fa-pause", "fa-play");
      isAudioPlaying = false;
    } else {
      isShuffleOn ? loadRandomSong() : loadNextSong();
    }
  }

  let minutes = Math.floor(currTime / 60);
  let seconds = Math.floor(currTime % 60);
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  currDurationTag.textContent = `${minutes}:${seconds}`;
});

// We should be able to change the time with the slider too.
progressBar.addEventListener("input", () => {
  audioFile.currentTime = progressBar.value;
});

// Adding functionality to the shuffle button.
let isShuffleOn = false;
const shuffleButton = document.querySelector(".fa-shuffle");
shuffleButton.addEventListener("click", () => {
  if (isShuffleOn) {
    isShuffleOn = false;
    shuffleButton.classList.remove("active-icon");
  } else {
    isShuffleOn = true;
    shuffleButton.classList.add("active-icon");
  }
  repeatButton.classList.remove("bi", "bi-repeat-1", "active-icon");
  repeatButton.classList.add("fa-solid", "fa-repeat");
  repeat = 0;
});

// Adding functionality to repeat button.
let repeat = 0;
const repeatButton = document.querySelector(".fa-repeat");
repeatButton.addEventListener("click", () => {
  if (repeat === 0) {
    repeatButton.classList.add("active-icon");
    repeat = 1;
  } else if (repeat === 1) {
    repeatButton.classList.replace("fa-solid", "bi");
    repeatButton.classList.replace("fa-repeat", "bi-repeat-1");
    repeat = 2;
  } else {
    repeatButton.classList.remove("bi", "bi-repeat-1", "active-icon");
    repeatButton.classList.add("fa-solid", "fa-repeat");
    repeat = 0;
  }
  isShuffleOn = false;
  shuffleButton.classList.remove("active-icon");
});

const darkModeToggle = document.querySelector("#darkmode-toggle");
const body = document.querySelector("body");
darkModeToggle.addEventListener("change", () => {
  if (darkModeToggle.checked) {
    body.classList.replace("light", "dark");
  } else {
    body.classList.replace("dark", "light");
  }
});

loadAudio(songIndex);
