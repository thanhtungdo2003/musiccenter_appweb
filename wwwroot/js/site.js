
const uri_getaway = "https://localhost:7105/api/";
const uri_tunnel = "https://9996gzq7j27i.share.zrok.io/api/";
const uri_localhost = "https://localhost:7165/api/";
const message_box = $("#message-box");
var userNameHasLogin = "";
var showMessBox = false;
var uri = uri_getaway;

$(document).ready(function () {
    const mini_audio_box = document.getElementById("audio-card-container");

    let isDragging = false;
    let offsetX, offsetY;

    mini_audio_box.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - mini_audio_box.offsetLeft;
        offsetY = e.clientY - mini_audio_box.offsetTop;
        mini_audio_box.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            mini_audio_box.style.left = e.clientX - offsetX + "px";
            mini_audio_box.style.top = e.clientY - offsetY + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        mini_audio_box.style.cursor = "grab";
    });




    $("#logo").click(function () {
        window.location.href = "/";
    });

    fetch(uri + 'Account/token_login', {
        method: 'GET',
        credentials: 'include',
    }).then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('Không có phiên đăng nhập hợp lệ');
        }
    }).then(data => {
        const { username, premium_ex } = JSON.parse(data);
        const account_control = $("#account");
        $(".account-control").remove();
        account_control.css("cursor", "pointer");
        account_control.append("<span style='width: 40px; height:40px;border-radius: 100em; background-color: rgb(100, 100, 100);border: 2px solid white;color: white; margin: auto 10px; font-size: 22px;display:flex; text-align: center; justify-content:center'>" + username.charAt(0).toUpperCase() + "</span>");
        account_control.append("<a id='account-option-btn' style='color: white; margin: auto 10px'>" + username + " ▼" + "</a>");
        const displayUserName = $("#user-name-account-select");
        displayUserName.text(username);
        userNameHasLogin = username;
        loadPlayList();
    }).catch(error => console.error('Error:', error));

    $(document).on('click', '#account-option-btn', function (event) {
        event.stopPropagation();
        const select = $("#account-select");
        select.css("display", "block");
    });
    $(document).on('click', "#account-option-logout", function () {
        var data = new FormData();
        data.append("id", getCookie("token_login"));
        fetch(uri + "Account/visit/logout/" + getCookie("token_login"), {
            method: 'POST',
            body: data
        }).catch(error => console.error('Error:', error));
        deleteCookie("token_login");
        open("/", "_parent");
    }); $(document).on('click', ".search-item-poster-container img", function () {
        var recordUid = $(this).parent().parent().attr("id");
        const index = recordUid.indexOf('_');
        recordUid = recordUid.substring(index + 1);
        openPage("/audio/" + recordUid);
    }); $(document).on('click', ".search-item-artist-container", function () {
        var uid = $(this).attr("id");
        const index = uid.indexOf("_");
        uid = uid.substring(index + 1);
        $.ajax({
            url: uri + "Artist/visit/userName=" + userNameHasLogin + "artistUid=" + uid,
            type: 'POST',
            data: JSON.stringify({
                userName: userNameHasLogin,
                id: uid
            })
        });
        openPage("/infoArtist/" + uid);

    });

    fetch(uri + 'Artist')
        .then(reponse => reponse.json())
        .then(data => {
            const artsit_card = $("#artis-card > .type-card-content");
            artsit_card.empty();
            data.sort((a, b) => b.Visits - a.Visits);
            var count = 0;
            data.forEach(artist => {
                if (count == 6) return;
                count++;
                artsit_card.append("<div class='artist-item' id='" + artist.ArtistUid + "'><div class='avata-container'><img id='" + artist.ArtistUid + "' class='artist-avt-item'></img></div><br/><span class='title-item'>" + artist.StageName + "</span><br/><span class='subline-item'>Nghệ sĩ<span/>" + "</div>");
                const container = $("#" + artist.ArtistUid + " img");
                SetFile("artist-avata", artist.Avata, container);
            })
        }).catch(error => console.error('Error:', error));

    $(document).on('click', ".artist-item", function () {
        const artistUid = $(this).attr("id");
        sessionStorage.setItem("current_artistUid", artistUid);
        open("/infoArtist/" + artistUid, "_parent");
        $.ajax({
            url: uri + "Artist/visit/userName=" + userNameHasLogin + "artistUid=" + artistUid,
            type: 'POST',
            data: JSON.stringify({
                userName: userNameHasLogin,
                id: artistUid
            })
        });
    });
    $("#search-button").click(function () {
        const keyword = $("#search").val();
        if (keyword == "") return;
        open("/search_results/search_query=%" + keyword, "_parent");
    });
    $("#search").on("keydown", function (event) {
        if (event.key == "Enter") {
            const keyword = $("#search").val();
            if (keyword == "") return;
            open("/search_results/search_query=%" + keyword, "_parent");
        }
    })

    //
    fetch(uri + 'Record/Viral')
        .then(reponse => reponse.json())
        .then(data => {
            const viral_card = $("#viral-card > .type-card-content");
            viral_card.empty();
            data.sort((a, b) => b.views - a.views);
            var count = 0;
            data.forEach(viral_music => {
                if (count == 6) return;
                count++;
                viral_card.append("<div class='record-item' id='viral_" + viral_music.uid + "'>" + `<img class='premium-record-icon ${viral_music.record.payfee}' src='/lib/crown-minimalistic-svgrepo-com.svg'/>` + "<img class='record-poster-item'></img><br/><span class='title-item'>" + viral_music.record.displayName + "</span><br/><span class='subline-item'>Ca khúc<span/>" + "<div class='option-record-item' id='playlist-btn-record-item'><div>+</div></div><div class='option-record-item' id='favorite-btn-record-item'><div>❤︎</div></div></div>");
                SetFile("record-poster", viral_music.record.poster, $("#viral_" + viral_music.uid + " .record-poster-item"))
            })
        }).catch(error => console.error('Error:', error));
    //
    fetch(uri + 'Record/top_audio')
        .then(reponse => reponse.json())
        .then(data => {
            const top_card = $("#new-product-card > .type-card-content");
            top_card.empty();
            data.sort((a, b) => b.views - a.views);
            var count = 0;
            data.forEach(record => {
                if (count == 6) return;
                count++;
                top_card.append("<div class='record-item' id='top_" + record.RecordUid + "'>" + `<img class='premium-record-icon ${record.Payfee}' src='/lib/crown-minimalistic-svgrepo-com.svg'/>` + "<img class='record-poster-item'></img><br/><span class='title-item'>" + record.DisplayName + "</span><br/><span class='subline-item'>Ca khúc<span/>" + "<div class='option-record-item' id='playlist-btn-record-item'><div>+</div></div><div class='option-record-item' id='favorite-btn-record-item'><div>❤︎</div></div></div>");
                SetFile("record-poster", record.Poster, $("#top_" + record.RecordUid + " .record-poster-item"));
            });
        }).catch(error => console.error('Error:', error));

    $(document).on('click', '.record-item', function () {
        const id = $(this).attr("id").split("_")[1];
        open("/audio/" + id, "_parent");
    });
    fetch(uri + 'Category/top-cate')
        .then(reponse => reponse.json())
        .then(data => {
            const top_card = $("#category-card > .type-card-content");
            top_card.empty();
            data.sort((a, b) => b.TotalViews - a.TotalViews);
            var count = 0;
            data.forEach(cate => {
                if (count == 4) return;
                count++;
                top_card.append("<div class='category-item' id='" + cate.CategoryUid + "'>" + "<div id='index-icon-box-" + count + "_" + cate.CategoryUid + "' class='category-icon-box' style='background-color: " + getRandomColor() + "'><span class='title-item' style='font-size: 30px; text-shadow: 0px 0px 50px white; display: inline-block'>" + cate.DisplayName + "</span><canvas style='display: none' id='canvas-cate-index-" + count + "_" + cate.CategoryUid + "'></canvas><img id='index-cate-avata-" + count + "_" + cate.CategoryUid + "' class='outstanding-poster-record-cate-item'/></div><span class='subline-item'>Tổng lượt nghe: " + cate.TotalViews + "<span/><br/><span class='subline-item'>" + cate.TotalRecords + " Bài hát</span>" + "<div class='option-record-item' id='playlist-btn-record-item'><div>+</div></div><div class='option-record-item' id='favorite-btn-record-item'><div>❤︎</div></div></div>");
                SetFile("record-poster", cate.OutstandingRecordPoster, $("#" + cate.CategoryUid + " .category-icon-box img"));
            });
        }).catch(error => console.error('Error:', error));

    $(document).on('click', '.record-item', function () {
        const id = $(this).attr("id").split("_")[1];
        open("/audio/" + id, "_parent");
    });
    $(document).on('click', '.category-item', function () {
        const id = $(this).attr("id");
        open("/category/uid=" + id, "_parent");
    });


    $("#sumbit").click(function () {
        const mess_box = $("#mess");
        const userName = $("#username").val();
        const password = $("#password").val();
        if (userName == "" || password == "") {
            mess_box.css("display", "block");
            mess_box.text("Không được để trống thông tin nhập.");
            return;
        }
        switch ($("#form-case").text()) {
            case "login":
                const dataLogin = new FormData();
                dataLogin.append("userName", userName);
                dataLogin.append("password", password);
                fetch(uri + "Account/login/username=" + userName + "&password=" + password, {
                    method: "POST",
                    credentials: "include",
                    body: dataLogin,
                }).then(reponse => {
                    if (reponse.ok) {
                        window.location.href = "index";
                    } else {
                        mess_box.text("Tên đăng nhập hoặc mật khẩu không chính xác!")
                    }
                }).catch(error => console.error('Error:', error));
                break;
            case "signin":
                const rePass = $("#re-password").val();
                if (rePass == "") {
                    mess_box.css("display", "block");
                    mess_box.text("Không được để trống thông tin nhập.");
                    return;
                }
                const dataSignin = new FormData();
                dataSignin.append("userName", userName);
                dataSignin.append("password", password);
                fetch(uri + "Account/sginin/username=" + userName + "&password=" + password, {
                    method: "POST",
                    credentials: "include",
                    body: dataSignin,
                }).then(reponse => {
                    if (reponse.ok) {
                        window.location.href = "index";
                    } else {
                        mess_box.text("Tài khoản đã tồn tại hoặc mật khẩu nhập lại không chính xác")
                    }
                }).catch(error => console.error('Error:', error));
                break;
        }
    });
    var playlistAmount = 1;
    function loadPlayList() {
        var totalPlaylist = 1;
        window.setTimeout(function () {
            fetch(uri + "Playlist/" + userNameHasLogin,
                {
                    headers: {
                        "Authorization": "Bearer " + getCookie("token_login")
                    }
                })
                .then(response => response.json())
                .then(data => {
                    const container = $("#playlist-box");
                    $('.playlist-container').remove();
                    data.forEach(playlist => {
                        totalPlaylist++;
                        container.append("<div id='" + playlist.PlaylistUid + "' class='playlist-container'><div class='playlist-play-btn'>▶</div><div class='palette'></div><div id='stats'><span id='stats-name'>" + playlist.DisplayName + "</span><svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18'><path d='M4 7.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5S5.5 9.83 5.5 9 4.83 7.5 4 7.5zm10 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-5 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5S9.83 7.5 9 7.5z'></path></svg></div></div > ")
                        const imgItemContainer = $("#" + playlist.PlaylistUid + " .palette");

                        fetch(uri + "Playlist/record/" + playlist.PlaylistUid,
                            {
                                headers: {
                                    "Authorization": "Bearer " + getCookie("token_login")
                                }
                            })
                            .then(recordResponse => recordResponse.json())
                            .then(records => {
                                var count = 0;
                                records.forEach(record => {
                                    count++;
                                    if (count == 6) return;
                                    imgItemContainer.append("<img class='img-record-playlist-preview' id='poster-" + count + "'/>")
                                    SetFile("record-poster", record.poster, $("#" + playlist.PlaylistUid + " .palette #poster-" + count));
                                });
                            }).catch(error => console.error('Error:', error));
                    });
                    playlistAmount = totalPlaylist;
                }).catch(error => console.error('Error:', error));
        }, 600);
    }
    $(document).on('click', ".playlist-play-btn", function () {
        const playlistUid = $(this).parent().attr("id");
        sessionStorage.setItem("currentPlaylistUid", playlistUid);
        open("/playlist/" + userNameHasLogin + "&" + getCookie('token_login') + "&" + playlistUid, "_parent");
    });
    $("#add-playlist").click(function () {
        if (userNameHasLogin != "") {
            const playlist_add_container = $(".playlist-add-container");
            playlist_add_container.slideToggle(50);
        }
        else {
            if (!showMessBox) {
                showMessBox = true;
                message_box.slideToggle(100);
                message_box.attr("value", "Bạn cần đăng nhập để sử dụng tính năng này");
                message_box.attr("onclick", "openPage('login')");
                window.setTimeout(function () {
                    message_box.slideToggle(100);
                    showMessBox = false;
                    message_box.attr("value", "");
                    message_box.attr("onclick", "");
                }, 3000);
            }
        }
    });
    $("#playlist-add-cancel").click(function () {
        const playlist_add_container = $(".playlist-add-container");
        playlist_add_container.slideToggle(50);
    });
    $("#playlist-add-sumbit").click(function () {
        const playlist_add_container = $(".playlist-add-container");
        var namePlaylist = $("#playlist-add-name").val();
        if (namePlaylist == "") {
            namePlaylist = "playList" + playlistAmount;
        }
        const data = new FormData();
        data.append("userName", userNameHasLogin);
        data.append("name", namePlaylist);
        fetch(uri + "Playlist/userName=" + userNameHasLogin + "&id=" + namePlaylist, {
            method: 'POST',
            body: data,
            headers: {
                "Authorization": "Bearer " + getCookie("token_login")
            },

        }).then(response => {
            if (response.ok) {
                const playlist_add_container = $(".playlist-add-container");
                playlist_add_container.slideToggle(50);
                loadPlayList();
            }
        })
    });
    $(document).on('click', "#playlist-btn-record-item", function (event) {
        event.stopPropagation();
        if (userNameHasLogin != "") {
            const container = $(this).parent().parent().parent();
            recordUid = container.attr("id").split("_")[1];
            openAddPlaylistMenu(event, recordUid);
        } else {
            ShowMessageBox("Bạn cần đăng nhập để sử dụng tính năng này", "openPage('/login')", "rgb(200,40,40)");
        }
    });
    $(document).on('click', "#favorite-btn-record-item", function (event) {
        event.stopPropagation();
        if (userNameHasLogin != "") {
            const container = $(this).parent().parent().parent();
            recordUid = container.attr("id").split("_")[1];
            $.ajax({
                url: uri + "FavoriteList/add/session_login_uid=" + getCookie("token_login") + "record_uid=" + recordUid,
                type: 'POST',
                headers: {
                    "Authorization": "Bearer " + getCookie("token_login")
                },
                data: JSON.stringify({
                    sid: getCookie("token_login"),
                    rid: recordUid
                }),

                success: function () {
                    ShowMessageBox("Đã thêm bài hát vào danh sách yêu thích", "", "rgb(100,230,100)");
                }
            })
        } else {
            ShowMessageBox("Bạn cần đăng nhập để sử dụng tính năng này", "openPage('/login')", "rgb(200,40,40)");
        }
    });
    $(document).on('click', '.menu-strip-item', function () {
        const playlistUid = $(this).attr("id");
        var data = new FormData();
        data.append("pid", playlistUid);
        data.append("rid", recordUidAddPlaylist);
        fetch(uri + "Playlist/record/add/playlistUid=" + playlistUid + "&recordUid=" + recordUidAddPlaylist, {
            method: 'POST',
            body: data,
            headers: {
                "Authorization": "Bearer " + getCookie("token_login")
            },
        }).then(response => {
            if (response.ok) {
                ShowMessageBox("Thêm vào danh sách phát thành công", "", "rgb(50,200,60)");
                loadPlayList();
            }
        })
    })
    $(document).on('click', ".delete-record-playlist-item-button", function (event) {
        event.stopPropagation();
        const recordItem = $(this).parent().parent();
        const rUid = recordItem.attr("id");
        const pUid = sessionStorage.getItem("currentPlaylistUid");
        $.ajax({
            url: uri + "Playlist/record/delete/playlistUid=" + pUid + "&recordUid=" + rUid,
            type: 'DELETE',
            headers: {
                "Authorization": "Bearer " + getCookie("token_login")
            },
            data: JSON.stringify({
                pid: pUid,
                rid: rUid
            }),

            success: function (response) {
                recordItem.remove();
                ShowMessageBox("Đã xóa thành công", "", "rgb(30, 200, 50)");
            },
            error: function (error) {
                console.log("Lỗi: " + error);
            },
        });
    });
    $("#delete-playlist-button").click(function () {
        const pUid = sessionStorage.getItem("currentPlaylistUid");
        $.ajax({
            url: uri + "Playlist/delete/playlistUid=" + pUid,
            type: 'DELETE',
            headers: {
                "Authorization": "Bearer " + getCookie("token_login")
            },
            data: JSON.stringify({
                pid: pUid
            }),
            success: function (response) {
                open("/", "_parent");
                ShowMessageBox("Đã xóa thành công", "", "rgb(30, 200, 50)");
            },
            error: function (error) {
                console.log("Lỗi: " + error);
            },
        });
    });
    $(document).click(function () {
        $(".menu-strip-container").css("display", "none");
        $("#account-select").css("display", "none");
    })

    $("#toggle-rightside-button").click(function () {
        const showRightSide = localStorage.getItem("showRightSide");
        const container = $("#right-side");
        const icon = $("#toggle-rightside-button img");
        const main = $(".main");
        icon.css("transform", "rotate(180deg)");

        if (showRightSide === "true") {
            localStorage.setItem("showRightSide", false);
            container.removeClass("on");
            container.addClass("off");
            main.css("width", "1100px");
            icon.css("transform", "rotate(0deg)");
            $(this).css("background", "rgb(93, 86, 76)");

        } else if (showRightSide === "false" || !showRightSide) {
            localStorage.setItem("showRightSide", true);
            container.addClass("on");
            main.css("width", "900px");
            container.removeClass("off");
            icon.css("transform", "rotate(180deg)");
            $(this).css("background", "linear-gradient(90deg, #0000004d, #00000000)");
        }

    });
    loadRightSide();

});
function ShowMessageBox(content, onclick, color) {
    if (!showMessBox) {
        showMessBox = true;
        message_box.css("background-color", color)
        message_box.slideToggle(100);
        message_box.attr("value", content);
        message_box.attr("onclick", onclick);
        window.setTimeout(function () {
            message_box.slideToggle(100);
            showMessBox = false;
            message_box.attr("value", "");
            message_box.attr("onclick", "");
        }, 3000);
    }
}
//Hàm lấy ảnh
function SetFile(folder, fileName, container) {
    fetch(uri + "File/get/folder=" + folder + "&file=" + fileName)
        .then(response => {
            const contentType = response.headers.get("Content-Type");
            return response.blob().then(blob => ({ blob, contentType }));
        }).then(({ blob, contentType }) => {
            const fileUrl = URL.createObjectURL(blob);
            if (contentType.startsWith("image/")) {
                container.attr("src", fileUrl);
            } else {
                container.attr("src", fileUrl);
            }
        })
        .catch(error => {
            console.error('Lỗi:', error);
            return null;
        });

}
var audio = null;
var currentRecordUid = null;
var nextRecord = null;
function loadAudio(audioPlayer, recordUidInput, togglePlaylist) {
    if (!recordUidInput) { return; }
    currentRecordUid = recordUidInput;
    if (audio != null && audio.src != null) {
        audio.src = "";
        audio = null;
    }
    $.ajax({
        url: uri + "Record/" + recordUidInput+"/"+getCookie("token_login"),
        type: "GET",
        contentType: 'application/json',
        success: function (record) {
            if (!record.recordUid) { return; }
            localStorage.setItem("listening_record_uid", recordUidInput);
            SetFile("record-coverphoto", record.coverPhoto, $("#right-side-record-cover-photo"));
            SetFile("artist-avata", record.artist.avata, $("#right-side-artist-avt"));
            $("#right-side-record-name").text(record.displayName);
            $("#right-side-artist-stagename").text(record.artist.stageName);
            $("#right-side-song-lyric").val(record.lyrics);
            $("#right-side-song-description").val(record.description);
            $("#right-side-artist-stagename").attr("href", "https://localhost:7089/infoArtist/" + record.artist.artistUid);
            if (record.record === "EXPIRED") {
                ShowMessageBox("Bạn chưa gia hạn hoặc đăng ký gói Premium", "openPage('/premium_register')", "rgb(200,0,0)");
                $("#premium-notify").css("display", "flex");
                return;
            }
            $("#premium-notify").css("display", "none");

            fetch(uri + "File/get/folder=record-audio&file=" + record.record)
                .then(response => {
                    if (response.ok) {
                        $("#record-name").text(record.displayName);
                        return response.blob();
                    }
                    throw new Error('Không tìm thấy file');
                })
                .then(blob => {
                    const reader = new FileReader();
                    reader.onloadend = function () {
                        const base64String = reader.result.split(',')[1];
                        const audioOpen = new Audio(
                            "data:audio/mp3;base64," + base64String
                        );
                        audio = audioOpen
                        console.dir(audio);
                        audio.addEventListener(
                            "loadeddata",
                            () => {
                                audioPlayer.querySelector(".time .length").textContent = getTimeCodeFromNum(
                                    audio.duration
                                );
                                audio.volume = .99;
                                fetch(uri + `Record/AddViews/` + recordUidInput + `?amount=1`, {
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

                        //điều chỉnh thời lượng
                        const timeline = audioPlayer.querySelector(".timeline");
                        timeline.addEventListener("click", e => {
                            const timelineWidth = window.getComputedStyle(timeline).width;
                            const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
                            audio.currentTime = timeToSeek;
                        }, false);

                        //Điều chỉnh âm lượng
                        const volumeSlider = audioPlayer.querySelector(".controls .volume-slider");
                        volumeSlider.addEventListener('click', e => {
                            const sliderWidth = window.getComputedStyle(volumeSlider).width;
                            const newVolume = e.offsetX / parseInt(sliderWidth);
                            audio.volume = newVolume;
                            audioPlayer.querySelector(".controls .volume-percentage").style.width = newVolume * 100 + '%';
                        }, false)

                        //thời lượng
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
                                    const img = playBtn.querySelector("img");
                                    img.setAttribute("src", "/lib/pause.png");
                                    audio.play();
                                } else {
                                    const img = playBtn.querySelector("img");
                                    img.setAttribute("src", "/lib/play-button-arrowhead.png");
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
                                volumeEl.append("<img src='/lib/mute.png'/>");
                            } else {
                                volumeEl.append("<img src='/lib/volume-max.png'/>");

                            }
                        });
                        audio.addEventListener('ended', function () {
                            if (togglePlaylist) {
                                const item = $(".playlist-record-item");
                                item.css("background-color", "#474747");
                                for (var i = 0; i < item.length; i++) {
                                    if (item[i].id === recordUid) {
                                        $(item[i + 1]).css("background-color", "#dc7349");
                                        item[i + 1].click();
                                    }
                                }
                            } else {

                            }
                            // Thực hiện các hành động khác khi audio kết thúc
                        });
                        audio.play();


                    };
                    reader.readAsDataURL(blob);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },
        error: function (error) {
            console.log("Error:", error);
        }
    });

}
function loadRightSide() {
    const showRightSide = localStorage.getItem("showRightSide");
    const recordUid = localStorage.getItem("listening_record_uid");
    const container = $("#right-side");
    const icon = $("#toggle-rightside-button img");
    const main = $(".main");
    if (showRightSide === "true") {
        container.addClass("on");
        container.removeClass("off");
        icon.css("transform", "rotate(180deg)");
        main.width("56%");
        $("#toggle-rightside-button").css("background", "linear-gradient(90deg, #0000004d, #00000000)");
    }
    const right_audio_player = document.querySelector(".right-side-audio-player");
    if (!window.location.href.includes("/audio/") && !window.location.href.includes("/playlist/") && !window.location.href.includes("/favorite/")) {
        loadAudio(right_audio_player, recordUid, false);
    }
}
function deleteCookie(name) {
    document.cookie = name + '=; Max-Age=0; path=/';
}
function openPage(page) {
    open(page, '_parent')
}

function getCookie(name) {
    const value = `; ${document.cookie}`; // Thêm dấu chấm phẩy để dễ dàng tách cookie
    const parts = value.split(`; ${name}=`); // Tách chuỗi cookie theo tên cookie
    if (parts.length === 2) {
        return parts.pop().split(';').shift(); // Lấy giá trị của cookie
    }
    return null; // Nếu không tìm thấy cookie
}
function getArtistData(aid) {
    return $.ajax({
        url: uri + "Artist/" + aid,
        type: 'GET'
    });
}
async function getArtist(aid) {
    const artist = await getArtistData(aid);
    return artist;
}
function getCategoryData(cateUid) {
    return $.ajax({
        url: uri + "Category/" + cateUid,
        type: 'GET'
    });
}
async function getCategory(id) {
    const data = await getCategoryData(id);
    return data;
}
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
var recordUidAddPlaylist = "";

function openAddPlaylistMenu(event, recordUid) {
    recordUidAddPlaylist = recordUid;
    var x = event.clientX;
    var y = event.clientY;
    const menustrip = $("#menu-strip-playlist");
    $(".menu-strip-item").remove();
    fetch(uri + "Playlist/" + userNameHasLogin,
        {
            headers: {
                "Authorization": "Bearer " + getCookie("token_login")
            }
        })
        .then(response => response.json())
        .then(data => {
            data.forEach(playlist => {
                fetch(uri + "Playlist/record/" + playlist.PlaylistUid + "/amount",
                    {
                        headers: {
                            "Authorization": "Bearer " + getCookie("token_login")
                        }
                    })
                    .then(data_amount => data_amount.json())
                    .then(amount => {
                        menustrip.append("<div class='menu-strip-item' id='" + playlist.PlaylistUid + "'><div class='menu-strip-item-title'>" + playlist.DisplayName + "</div><div class='menu-strip-item-value'>" + amount.Amount + "</div></div>");
                    }).catch(error => console.error('Error:', error));
            });
        }).catch(error => console.error('Error:', error));
    menustrip.css("left", x + "px");
    menustrip.css("top", y - 200 + "px");
    menustrip.css("display", "block");
}
function openFavoriteList() {
    if (userNameHasLogin != "") {
        open(`/favorite/favorite_list/${userNameHasLogin}&${getCookie("token_login")}`, "_parent")
    } else {
        ShowMessageBox("Bạn cần đăng nhập để sử dụng tính năng này!", "openPage('signin')", "rgb(200,100,100)");
    }
}



function buyPremiumPack(pack) {
    $.ajax({
        url: uri_localhost + "Momo/create/"+pack,
        type: "POST",
        contentType: 'application/json',
        headers: {
            "Authorization": "Bearer " + getCookie("token_login"),
        },
        success: function (res) {
            const { payUrl } = JSON.parse(res);
            open(payUrl, "_parent");
        },
        error: function (err) {
            ShowMessageBox("Bạn chưa đăng nhập", "", "rgb(200,0,0)")
        }
    })
}
