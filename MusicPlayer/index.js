/* 
    1. Render songs
    2. Scroll top
    3. Play / pause / seek
    4. CD rotate
    5. Next / prev
    6. Random
    7. Next / Repeat when ended
    8. Active song
    9. Scroll active song into view
    10. Play song when click
    */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const player = $('.player');
const playlist = $('.playlist');
const cd = $('.cd');
const cdSoundWave = $('.cd-soundwave');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const progress = $('#progress');
const time_start = $('.controls_time--left');
const time_count = $('.controls_time--right');
const cdThumbAnimate = cdThumb.animate([
  { transform: 'rotate(360deg)' }
], {
  duration: 10000, // 10s
  iterations: Infinity
});

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  arrOldIndexes: [],

  songs: [
    {
      name: 'Stand Still',
      singer: 'Noah Cyrus',
      path: './assets/music/Stand Still - Noah Cyrus.m4a',
      image: './assets/img/standstill.jpg'
    },
    {
      name: 'Top of the World',
      singer: 'AK',
      path: './assets/music/AK - Top of the World (Lyrics).mp3',
      image: './assets/img/topoftheworld.jpg'
    },
    {
      name: 'Biblical',
      singer: 'Calum Scott',
      path: './assets/music/Biblical - Calum Scott.mp3',
      image: './assets/img/biblical.jpg'
    },
    {
      name: 'Slay',
      singer: 'Felucia',
      path: './assets/music/Felucia - Slay.mp3',
      image: './assets/img/slay.jpg'
    },
    {
      name: 'Crossfire',
      singer: 'Felucia',
      path: './assets/music/Felucia - Crossfire.mp3',
      image: './assets/img/crossfire.jpg'
    },
    {
      name: 'Where No One Goes Reprise',
      singer: 'Unknown',
      path: './assets/music/Where No One Goes Deluxe Reprise.mp3',
      image: './assets/img/wherenoonegoes.jpg'
    },
    {
      name: 'Dream Lantern',
      singer: 'RADWIMPS',
      path: './assets/music/RADWIMPS  Dream Lantern Instrumental.mp3',
      image: './assets/img/dreamlantern.jpg'
    },
  ],

  //render playlist
  render: function () {
    const htmls = this.songs.map(function (song, currentIndex) {
      return `
      <div class="song" data-index = ${currentIndex}>
    <div class="thumb" style="background-image: url('${song.image}')">
    </div>
    <div class="body">
      <h3 class="title">${song.name}</h3>
      <p class="author">${song.singer}</p>
    </div>
    <div class="equalizer-container">
          <ol class="equalizer-column">
          <li class="colour-bar"></li>
        </ol>
        <ol class="equalizer-column">
          <li class="colour-bar"></li>
        </ol>
        <ol class="equalizer-column">
          <li class="colour-bar"></li>
        </ol>
        <ol class="equalizer-column">
          <li class="colour-bar"></li>
        </ol>
        <ol class="equalizer-column">
          <li class="colour-bar"></li>
        </ol>
      </div>
    <div class="option">
      <i class="fas fa-ellipsis-h"></i>
    </div>
  </div>
      `
    })

    playlist.innerHTML = htmls.join('');
  },

  //define property 'currentSong' for object 'app'
  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex];
      }
    })
  },

  //handle events function
  handleEvents: function () {
    cdThumbAnimate.pause();

    cdWidth = cd.offsetWidth;

    //minimize CD when scroll down
    document.onscroll = function () {
      const scrollTop = window.scrollY;

      cdNewWidth = cdWidth - scrollTop;
      cd.style.width = cdNewWidth > 0 ? cdNewWidth + 'px' : 0;
      cd.style.opacity = cdNewWidth / cdWidth;
      cdSoundWave.style.opacity = cdNewWidth / cdWidth;
    }

    playBtn.onclick = function () {
      app.isPlaying ? app.pause() : app.play();
    }

    nextBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.nextSong();
      }
      app.play();
    }

    prevBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.prevSong();
      }
      app.play();
    }

    //toggle random songs
    randomBtn.onclick = function () {
      app.isRandom = !app.isRandom;
      randomBtn.classList.toggle('active', app.isRandom);
    }

    //toggle repeat songs
    repeatBtn.onclick = function () {
      app.isRepeat = !app.isRepeat;
      repeatBtn.classList.toggle('active', app.isRepeat);
    }

    //change songs when clicked on playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active');
      if (songNode || e.target.closest('.option')) {

        if (songNode) {
          app.currentIndex = songNode.dataset.index;
          app.loadCurrentSong();
          app.play();
        }

        if (e.target.closest('.option')) {

        }

      }
    }

    audio.ontimeupdate = function () {
      //show current time of the song on progress bar
      if (audio.duration) {
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
        progress.value = progressPercent;
        progress.style.background = 'linear-gradient(to right, #00cfff 0%, #00cfff ' + progressPercent + '%, #d3d3d3 ' + progressPercent + '%, #d3d3d3 100%)'; //progress bar filled from 0 to current time
        
        // Time Count of Audio Current Time
        var e = Math.floor(audio.currentTime);
        var d = e % 60; // number of second
        var b = Math.floor(e / 60); // number of minutes
        if (d < 10) {
          var c = 0;
        } else {
          c = "";
        }
        time_start.textContent = '0' + b + ":" + c + d;

        // Time Count of Audio Duration
        var ee = Math.floor(audio.duration);
        var dd = ee % 60; //number of second
        var bb = Math.floor(ee / 60); //number of minutes
        if (dd < 10) {
          var cc = 0;
        } else {
          cc = "";
        }

        time_count.textContent = '0' + bb + ":" + cc + dd;
      }

      if(!audio.duration) {
        time_start.textContent = '-' + ":" + "-";
        time_count.textContent = '-' + ":" + "-";
      }

      //handle when current song is finished
      if (audio.currentTime === audio.duration) {
        if (app.isRepeat) {
          audio.currentTime = 0; // repeat song when repeat button is active
        } else {
          app.nextSong(); //auto next song when ended
        }
        app.play();
      }
    }

    //seek song when press on the progress bar
    progress.oninput = function () {
      progressPercent = progress.value;
      audio.currentTime = progressPercent / 100 * audio.duration;
    }
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
    cdThumbAnimate.cancel();
  },

  //highlight song when active
  highlightSong: function () {
    let songBlock = $$('.song');
    for (var i = 0; i < songBlock.length; i++) {
      songBlock[i].classList.remove('active');
    }
    songBlock[this.currentIndex].classList.add('active');
  },

  //scroll active song to view
  scrollToActiveSong: function () {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }, 300);
  },

  //function to next songs
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }

    this.loadCurrentSong();
  },

  //function to prev songs
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }

    this.loadCurrentSong();
  },

  //function to play random songs
  playRandomSong: function () {
    let newIndex;
    this.arrOldIndexes.push(this.currentIndex)
    if (this.arrOldIndexes.length === this.songs.length) {
      this.arrOldIndexes = [];
    }
    do {
      newIndex = Math.floor(Math.random() * this.songs.length)
    }
    while (this.arrOldIndexes.includes(newIndex))

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  //app function play
  play: function () {
    player.classList.add('playing');
    cdSoundWave.classList.add('active');
    this.isPlaying = true;
    cdThumbAnimate.play();
    audio.play();
    app.highlightSong();
    this.scrollToActiveSong();
  },

  //app function pause
  pause: function () {
    player.classList.remove('playing');
    cdSoundWave.classList.remove('active');
    this.isPlaying = false;
    cdThumbAnimate.pause();
    audio.pause();
  },

  //app function start
  start: function () {
    this.defineProperties();
    this.handleEvents();

    this.loadCurrentSong();

    this.render();
  },

}

app.start();