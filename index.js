const $ = document.querySelector.bind(document)
        const $$ = document.querySelectorAll.bind(document)

        const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER'

        const player = $('.player')
        const cd = $('.cd')
        const heading = $('header h2')
        const cdThumb = $('.cd-thumb')
        const audio = $('#audio')
        const playBtn = $('.btn-toggle-play')
        const progress = $('#progress')
        const nextBtn = $('.btn-next')
        const prevBtn = $('.btn-prev')
        const randomBtn = $('.btn-random')
        const repeatBtn = $('.btn-repeat')
        const playlist = $('.playlist')
        const progressMaxValue = progress.max
        const timer = $('.time-remain')
        const audioVolumeBar = $('#audio-volume')
        const currentVolume = $('.current-volume')
        const audioVolumeWarn = $('.audio-control-volume-warn')
        const volumeWarnClose = $('.volume-warn-close-btn')
        const cdSoundWave = $('.cd-soundwave')
        const cdequalizer = $('.equalizer-container')

        const app = {
            currentIndex: 0,
            isPlaying: false,
            isRandom: false,
            isReapeat: false,
            config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

            songs: [
                {
                    name: 'Closer',
                    singer: 'The Chainsmokers ft. Halsey',
                    path: './assets/music/closer.mp3',
                    image: './assets/img/closer.jpg'
                },
                {
                    name: 'Happier',
                    singer: 'Marshmello ft. Bastille',
                    path: './assets/music/Happier.mp3',
                    image: './assets/img/happier.jpg'
                },
                {
                    name: 'Send My Love',
                    singer: 'Adele',
                    path: './assets/music/SendMyLove.mp3',
                    image: './assets/img/sendmylove.jpg'
                },
                {
                    name: 'Something Just Like This',
                    singer: 'The Chainsmokers & Coldplay',
                    path: './assets/music/SomethingJustLikeThis.mp3',
                    image: './assets/img/something.jpg'
                },
                {
                    name: 'Sorry',
                    singer: 'Justin Bieber',
                    path: './assets/music/Sorry.mp3',
                    image: './assets/img/sorry.jpg'
                },
                {
                    name: 'That\'s What I like',
                    singer: 'Bruno Mars',
                    path: './assets/music/ThatSWhatILike.mp3',
                    image: './assets/img/thatwhat.jpg'
                },
                {
                    name: 'Thank U, Next',
                    singer: 'Ariana Grande',
                    path: './assets/music/ThankUNext.mp3',
                    image: './assets/img/tksyou.jpg'
                },
                {
                    name: 'Lovely',
                    singer: 'Billie Eilish, Khalid',
                    path: './assets/music/Lovely.mp3',
                    image: './assets/img/lovely.jpg'
                },
                {
                    name: 'Company',
                    singer: 'Justin Bieber',
                    path: './assets/music/company.mp3',
                    image: './assets/img/company.jpg'
                },
                {
                    name: 'One Call Away',
                    singer: 'Charlie Puth',
                    path: './assets/music/onecallaway.mp3',
                    image: './assets/img/one.jpg'
                },
                {
                    name: 'Girls Like You',
                    singer: 'Maroon 5 ft. Cardi B',
                    path: './assets/music/GirlsLikeU.mp3',
                    image: './assets/img/girls.jpg'
                },
            ],
            setConfig: function(key, value) {
                this.config[key] = value;
                localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
            },

            render: function() {
                const htmls = this.songs.map((song, index) => {
                    return `
                    <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                        <div class="thumb" style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                            </div>
                            <div class="spectrum">
                             <div></div>
                            </div>
                            <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>`
                })
                $('.playlist').innerHTML = htmls.join('')
            },
            defineProperties: function() {
                Object.defineProperty(this, 'currentSong', {
                    get: function() {
                        return this.songs[this.currentIndex]
                    }
                })
            },

            handleEvent: function() {
                const _this = this
                const cdWidth = cd.offsetWidth

                //Xử lí cd quay / dừng
                const cdThumbAnimate = cdThumb.animate([
                    {transform: 'rotate(360deg)'}
                ], {
                    duration: 12000,  //10s
                    iterations: Infinity
                })

                cdThumbAnimate.pause()

                //Xu li phong to thu nho cd
                document.onscroll = function() {
                    const scrollTop = window.scrollY || document.documentElement.scrollTop
                    const newCdWidth = cdWidth - scrollTop

                    cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
                    cd.style.opacity = newCdWidth / cdWidth
                }

                //Xu li khi click play
                playBtn.onclick = function() {
                    if (_this.isPlaying) {
                        audio.pause()
                    } else {
                        audio.play()
                    }
                }

                // khi nhac dc play 
                audio.onplay = function() {
                    _this.isPlaying = true
                    player.classList.add('playing')
                    cdThumbAnimate.play()
                    cdSoundWave.classList.add('active')
                    $('.song.active .spectrum').classList.remove('paused')
                    $('.song.active .spectrum').classList.add('active')
                }

                // khi nhac dc pause
                audio.onpause = function() {
                    _this.isPlaying = false
                    player.classList.remove('playing')
                    cdThumbAnimate.pause()
                    cdSoundWave.classList.remove('active')
                    $('.song.active .spectrum').classList.remove('active')
                    $('.song.active .spectrum').classList.add('paused')
                }

                audioVolumeBar.oninput = function(e) {
                    audio.volume = e.target.value / audioVolumeBar.max
                    currentVolume.textContent = e.target.value
                }   

                // khi tiến độ bài hát thay đổi
                audio.ontimeupdate = function() {
                    if (audio.duration) {
                        const progressPercent = Math.floor(audio.currentTime / audio.duration * progressMaxValue)
                        // console.log((audio.duration - (audio.duration % 60)) / 60 + ':' + Math.floor(audio.duration % 60))
                        const timeRemain = audio.duration - audio.currentTime
                        let timeRemainAsMinute
                        if (Math.floor(timeRemain % 60) < 10) {
                            timeRemainAsMinute = (timeRemain - (timeRemain % 60)) /60 + ':0' + Math.floor(timeRemain % 60)
                            timer.textContent = timeRemainAsMinute
                        } else {
                            timeRemainAsMinute = (timeRemain - (timeRemain % 60)) /60 + ':' + Math.floor(timeRemain % 60)
                            timer.textContent = timeRemainAsMinute
                            
                        }
                    
                        progress.value = progressPercent
                    }
                }

                //xu li khi tua nhac
                progress.oninput = function(e) {
                    const seekTime = audio.duration / 100 * e.target.value
                    audio.currentTime = seekTime
                }

                // Khi next nhac
                nextBtn.onclick = function() {
                    if ( _this.isRandom) {
                        _this.playRandomSong()
                        
                    } else {
                        _this.nextSong()
                    }
                    audio.play()
                    _this.render()
                    _this.scrollToActiveSong()
                }

                // Khi prev nhac
                prevBtn.onclick = function() {
                    if (_this.isRandom) {
                        _this.playRandomSong()
                    } else {
                        _this.prevSong()
                    } 
                    audio.play()
                    _this.render()
                    _this.scrollToActiveSong()
                }

                //random
                randomBtn.onclick = function(e) {
                    _this.isRandom = !_this.isRandom
                    _this.setConfig('isRandom', _this.isRandom)
                    randomBtn.classList.toggle('active', _this.isRandom)
                    
                }


                //xu li lap lai 1 bai hat
                repeatBtn.onclick = function() {
                    _this.isReapeat = !_this.isReapeat
                    _this.setConfig('isReapeat', _this.isReapeat)
                    repeatBtn.classList.toggle('active', _this.isReapeat)
                }

                //Xu lí next song khi audio ended
                audio.onended = function() {
                    if (_this.isReapeat) {
                        audio.play()
                    } else {
                        nextBtn.click()
                    }  
                }

                // lang nghe hành vi click vao playlist
                playlist.onclick = function(e) {
                    const songNode = e.target.closest('.song:not(.active)')
                    if (songNode || e.target.closest('.option')){
                        
                        // Xử lí khi click vao song
                        if(songNode) {
                            _this.currentIndex = Number(songNode.dataset.index)
                            _this.loadCurrentSong()
                            audio.play()
                            _this.render()
                        }

                    }
                }

            },

            scrollToActiveSong: function() {
                setTimeout(() => {
                    if(this.currentIndex === 0 || this.currentIndex === 1){
                        $('.song.active').scrollIntoView({
                            behavior : 'smooth',
                            block : 'end'
                        })    
                    }
                    else{
                        $('.song.active').scrollIntoView({
                            behavior : 'smooth',
                            block : 'nearest'
                        })    
                    }
                }, 300)
            },


            loadCurrentSong: function() {
            
                heading.textContent = this.currentSong.name
                cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
                audio.src = this.currentSong.path

            },

            loadConfig: function() {
                this.isRandom = this.config.isRandom
                this.isReapeat = this.config.isReapeat
            },

            nextSong: function(){
                this.currentIndex++
                if(this.currentIndex >= this.songs.length) {
                    this.currentIndex = 0
                }
                this.loadCurrentSong()
            },

            prevSong: function(){
                this.currentIndex--
                if(this.currentIndex < 0 ) {
                    this.currentIndex = this.songs.length - 1
                }
                this.loadCurrentSong()
            },

            playRandomSong: function() {
                let newIndex
                do {
                    newIndex = Math.floor(Math.random() * this.songs.length)
                } while (newIndex == this.currentIndex)

                this.currentIndex = newIndex
                this.loadCurrentSong()
            },

            start: function() {
                //gán cấu hình từ cònig từ ứng dụng
                this.loadConfig()
                //Dinh nghia cac thuoc tinh cho object
                this.defineProperties()

                //Lang nghe/ xu li cac su kien
                this.handleEvent()

                //Tai thong tin bai hat dau tien vao UI khi chay ung dung
                this.loadCurrentSong()

                //render playlist
                this.render()

                //hien thi trang thia ban dau cua repeat va random
                randomBtn.classList.toggle('active', this.isRandom)
                repeatBtn.classList.toggle('active', this.isReapeat)

               
            }
        }

        app.start()
