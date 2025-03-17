$(document).ready(function () {
    if (window.location.pathname === '/audio') {
        const uidRecord = localStorage.getItem("uid_record");
        fetch('https://localhost:7165/api/Record/' + uidRecord)
            .then(reponse => reponse.json())
            .then(data => {
                const record = data.value;
                //const header = $(".slide-head");
                    fetch('https://localhost:7165/api/Artist/' + record.artistUid)
                        .then(artist_reponse => artist_reponse.json())
                        .then(artist => {
                            $("#poster-record").attr("src", "data:image/jpeg;base64," + record.poster);
                            $("#record-cover-photo").attr("src", "data:image/jpeg;base64," + record.coverPhoto);
                            $("#record-title").text(record.displayName);
                            $("#record-stageName").text("Nghệ Sĩ: " + artist.stageName);
                            $("#record-views-display").text("Lượt nghe: " + record.views);
                            $("#record-name").text(record.displayName);
                            

                            const audioPlayer = document.querySelector(".audio-player");
                            const audio = new Audio(
                                "data:audio/mp3;base64," + record.record
                            );
                            audio.play();
                            console.dir(audio);

                            audio.addEventListener(
                                "loadeddata",
                                () => {
                                    audioPlayer.querySelector(".time .length").textContent = getTimeCodeFromNum(
                                        audio.duration
                                    );
                                    audio.volume = .75;
                                    fetch(`https://localhost:7165/api/Record/AddViews/`+uidRecord+`?amount=1`, {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        }
                                    })
                                        .then(response => {
                                            if (!response.ok) {                                       
                                                console.error("Error updating views");
                                            }
                                        })
                                        .catch(error => console.error('Error:', error));
                                },
                                false
                            );

                            //click on timeline to skip around
                            const timeline = audioPlayer.querySelector(".timeline");
                            timeline.addEventListener("click", e => {
                                const timelineWidth = window.getComputedStyle(timeline).width;
                                const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
                                audio.currentTime = timeToSeek;
                            }, false);

                            //click volume slider to change volume
                            const volumeSlider = audioPlayer.querySelector(".controls .volume-slider");
                            volumeSlider.addEventListener('click', e => {
                                const sliderWidth = window.getComputedStyle(volumeSlider).width;
                                const newVolume = e.offsetX / parseInt(sliderWidth);
                                audio.volume = newVolume;
                                audioPlayer.querySelector(".controls .volume-percentage").style.width = newVolume * 100 + '%';
                            }, false)

                            //check audio percentage and update time accordingly
                            setInterval(() => {
                                const progressBar = audioPlayer.querySelector(".progress");
                                progressBar.style.width = audio.currentTime / audio.duration * 100 + "%";
                                audioPlayer.querySelector(".time .current").textContent = getTimeCodeFromNum(
                                    audio.currentTime
                                );
                            }, 500);

                            //toggle between playing and pausing on button click
                            const playBtn = audioPlayer.querySelector(".controls .toggle-play");
                            playBtn.addEventListener(
                                "click",
                                () => {
                                    if (audio.paused) {
                                        playBtn.classList.remove("play");
                                        playBtn.classList.add("pause");
                                        audio.play();
                                    } else {
                                        playBtn.classList.remove("pause");
                                        playBtn.classList.add("play");
                                        audio.pause();
                                    }
                                },
                                false
                            );

                          
                            audioPlayer.querySelector(".volume-button").addEventListener("click", () => {
                                const volumeEl = $(".volume-container .volume-button");
                                audio.muted = !audio.muted;
                                volumeEl.empty();
                                if (audio.muted) {
                                    volumeEl.append("<img src='/lib/speaker-0-svgrepo-com.svg'/>");
                                } else {
                                    volumeEl.append("<img src='/lib/audio-max-svgrepo-com.svg'/>");

                                }
                            });
                        }).catch(error => console.error('Error:', error))
            }).catch(error => console.error('Error:', error));
    }
})



//turn 128 seconds into 2:08
function getTimeCodeFromNum(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;

    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    return `${String(hours).padStart(2, 0)}:${minutes}:${String(
        seconds % 60
    ).padStart(2, 0)}`;
}
