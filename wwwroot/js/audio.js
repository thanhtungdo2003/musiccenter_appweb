

$(document).ready(function () {
    const url = location.href.split('/');
    const uidRecord = url[url.length - 1];
    fetch(uri + 'Record/' + uidRecord + "/" + getCookie("token_login"))
        .then(reponse => reponse.json())
        .then(data => {
            const record = data;
            fetch(uri + "Artist/" + record.artistUid)
                .then(artistResponse => artistResponse.json())
                .then(artist => {
                    SetFile("record-coverphoto", record.coverPhoto, $("#record-cover-photo"));
                    SetFile("record-poster", record.poster, $("#poster-record"));
                    SetFile("artist-avata", artist.avata, $("#img-avata-artist-auido"));
                    const audioPlayer = document.querySelector(".audio-player");
                    loadAudio(audioPlayer, uidRecord, false);
                    loadRecordsForArtist(record.artistUid);
                }).catch(error => console.error('Error:', error));

        }).catch(error => console.error('Error:', error));

    (async function () {
        const img = document.getElementById('record-cover-photo');
        const canvas = document.getElementById('imageCanvasCorverPhoto');
        const ctx = canvas.getContext('2d');

        img.onload = function () {
            const srcImg = $("#record-cover-photo").attr("src");
            document.getElementById('cover-photo-container').style.backgroundImage = `url(${srcImg})`;
        };
    })();
    loadComments(uidRecord);
    $(document).on("click",".reply-button", function () {
        const container = $(this).parent().parent().parent();
        const commentUid = container.attr("id")
        $(".reply-comment-container").height(0);
        $(".reply-comment-container").css("visibility", "hidden")
        container.find(".reply-comment-container").height(60);
        container.find(".reply-comment-container").css("visibility", "unset")
    });
    $(document).on("click", "#more-comment", function () {
        loadComment(5);
    });
    $("#comment-send-btn").click(function () {
        if (userNameHasLogin == "") {
            ShowMessageBox("Bạn cần đăng nhập để bình luận", "openPage('/signin')", "rgb(200, 100,100)");
            return;
        }
        const content = $("#comment-textbox").val();
        if (content == "") {
            ShowMessageBox("Không thể bình luận nội dung trống!", "", "rgb(200, 100,100)");
            return;
        }

        $.ajax({
            url: uri + "Comments/comment/record_uid=" + uidRecord + "session_login_uid=" + getCookie("token_login") + "content=" + content,
            type: 'POST',
            data: JSON.stringify({
                rid: uidRecord,
                session_login_uid: getCookie("token_login"),
                content: content
            }),
            success: function (ok) {
                $("#comment-textbox").val("");
                loadComments(uidRecord);
            },
            error: function (error) {
                ShowMessageBox("Phản hồi thất bại", "", "rgb(200, 100,100)");

            }
        })
    });
    $("#playlist-add-button").click(function (event) {
        event.stopPropagation();
        openAddPlaylistMenu(event, uidRecord);
    });
});
var countOfComment = 0;
var currentComments;

function loadRecordsForArtist(aid) {
    $.ajax({
        url: uri + "Artist/records/" + aid,
        type: 'GET',
        success: function (records) {
            const container = $("#records-list-artist-container");
            var count = 0;
            records.forEach(record => {
                count++;
                container.append(`<div class="record-artist-item" id="${record.RecordUid}">
                                        <div class="record-artist-item-col-1 record-artist-item-poster">
                                            <img id="record-item-img-index-${count}" src=""/>
                                        </div>
                                        <div class="record-artist-item-col-2 record-artist-item-name">
                                            ${record.DisplayName}
                                        </div>
                                        <div class="record-artist-item-col-4 record-artist-item-category">
                                            ${record.CategoryName}
                                        </div>
                                        <div class="record-artist-item-col-5 record-artist-item-action">
                                            <img class="add-wishlist-record-playlist-item-button" src="/lib/favourite.png" style="width: 24px; height: 24px;"/>
                                        </div>
                                    </div>`);
                SetFile("record-poster", record.Poster, $('#record-item-img-index-' + count + ''));
            });

            $(document).on('click', ".record-artist-item", function () {
                const id = $(this).attr("id");
                $(".record-artist-item").css("background-color", "");
                $(this).css("background-color", "#dc7349");

                $.ajax({
                    url: uri + "Record/" + id,
                    type: 'GET',
                    success: function (record) {
                        $("#record-title").text(record.displayName);
                        $("#record-stageName").text(record.stageName);
                        $("#record-views-display").text(record.views + " Lượt nghe");
                        SetFile("record-coverphoto", record.coverPhoto, $("#record-cover-photo"));
                        SetFile("record-poster", record.poster, $("#poster-record"));
                        const audioPlayer = document.querySelector(".audio-player");
                        loadAudio(audioPlayer, id, false);
                        loadComments(id);
                    }
                })
            });
        }
    });
}

function loadComment(amount) {
    var j = 0;
    const container = $("#comment-box");
    $(".bottom-comment-box").remove();
    var full = false;
    for (var i = countOfComment; i < currentComments.length; i++) {       
        if (j >= amount) {
            break;
        }
        j++;
        container.append(`<div class='comment-item' id='${currentComments[i].CommentUid}'>
                                    <div class='comment-item-header'>
                                        <img class='avata-user-comment-item' src='/lib/profile-user.png'/>
                                        <div class='user-name-comment-item'>
                                            <span>${currentComments[i].UserName}</span>
                                            <span style='color: gray; font-size: 14px; font-weight: 600; margin: 0px 10px'>
                                                ${getDate(currentComments[i].TimeOfComment)}
                                            </span>
                                        </div>
                                        <div class='comment-option'>
                                            <img src='/lib/option.png'/>
                                        </div>
                                    </div>
                                    <div class='comment-item-content-box'>
                                        <p>${currentComments[i].Content}</p>
                                    </div>
                                    <div class='comment-item-control-container'>
                                        <img src='/lib/heart-non-comment.png'/>
                                        <p>${currentComments[i].totalReact}</p>
                                        <div class='comment-item-controls'>
                                            <span class='reply-button'>Trả lời</span>
                                        </div>
                                    </div>
                                    <div class='reply-comment-container'>
                                        <input class='reply-textbox' type='text' placeholder='phản hồi cho @${currentComments[i].UserName}'/>
                                        <div class='reply-comment-submit-container'>
                                            <input type='button' value='Send'/>
                                        </div>
                                    </div>
                                </div>`);
        countOfComment++;
        if (countOfComment >= currentComments.length) {
            full = true;
        }
    }
    if (!full) {
        container.append(`<div class='bottom-comment-box' style='height: 30px;'><p id='more-comment'>Tải thêm bình luận</p></div>`)
    } else {
        container.append(`<div class='bottom-comment-box' style='height: 30px;'></div>`)
    }
}

function loadComments(RecordUid) {
    $.ajax({
        url: uri + "Comments/" + RecordUid,
        type: 'GET',
        data: JSON.stringify({
            rid: RecordUid
        }),
        success: function (comments) {
            countOfComment = 0;
            currentComments = comments;
            $("#comment-title").text(`Comments (${comments.length})`);
            $(".comment-item").remove();
            loadComment(3);
        }
    })
}

function getDate(dateString) {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
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
