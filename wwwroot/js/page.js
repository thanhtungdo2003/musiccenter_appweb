$(document).ready(function () {
    if (window.location.pathname === '/allArtist') {
        fetch(uri + 'Artist')
            .then(reponse => reponse.json())
            .then(data => {
                const artsit_card = $("#top-page-card > .type-card-content");
                const all_artsit_card = $("#all-content-card > .type-card-content");
                artsit_card.empty();
                all_artsit_card.empty();
                data.sort((a, b) => b.Visits - a.Visits);
                var count = 0;
                data.forEach(artist => {
                    count++;
                    if (count <= 6) {
                        artsit_card.append("<div class='artist-item' id='" + artist.ArtistUid + "'><div class='avata-container'><img class='artist-avt-item'></img></div><br/><span class='title-item'>" + artist.StageName + "</span><br/><span class='subline-item'>Nghệ sĩ<span/>" + "</div>");
                        SetFile("artist-avata", artist.Avata, $("#" + artist.ArtistUid + " img"))
                    } else {
                        all_artsit_card.append("<div class='artist-item' id='" + artist.ArtistUid + "'><div class='avata-container'><img class='artist-avt-item'></img></div><br/><span class='title-item'>" + artist.StageName + "</span><br/><span class='subline-item'>Nghệ sĩ<span/>" + "</div>");
                        SetFile("artist-avata", artist.Avata, $("#" + artist.ArtistUid + " img"))
                    }
                })
            }).catch(error => console.error('Error:', error));
    } else if (window.location.pathname === '/allRecord') {
        var currentPage = 1;
        fetch(uri + 'Record/page/1' + "&10")
            .then(reponse => reponse.json())
            .then(data => {
                const top_card = $("#top-page-card > .type-card-content");
                const all_content_card = $("#all-content-card > .type-card-content");
                top_card.empty();
                all_content_card.empty();
                data.sort((a, b) => b.views - a.views);
                var count = 0;
                data.forEach(sortData => {
                    count++;
                    if (count <= 6) {
                        top_card.append("<div class='record-item' id='item_" + sortData.RecordUid + "'>" + `<img class='premium-record-icon ${sortData.Payfee}' src='/lib/crown-minimalistic-svgrepo-com.svg'/>` + "<img class='record-poster-item'></img><br/><span class='title-item'>" + sortData.DisplayName + "</span><br/><span class='subline-item'>Ca khúc<span/>" + "<div class='option-record-item' id='playlist-btn-record-item'><div>+</div></div><div class='option-record-item' id='favorite-btn-record-item'><div>❤︎</div></div></div>");
                        SetFile("record-poster", sortData.Poster, $("#item_" + sortData.RecordUid + " .record-poster-item"))
                    } else {
                        all_content_card.append("<div class='record-item' id='item_" + sortData.RecordUid + "'>" + `<img class='premium-record-icon ${sortData.Payfee}' src='/lib/crown-minimalistic-svgrepo-com.svg'/>` + "<img class='record-poster-item'></img><br/><span class='title-item'>" + sortData.DisplayName + "</span><br/><span class='subline-item'>Ca khúc<span/>" + "<div class='option-record-item' id='playlist-btn-record-item'><div>+</div></div><div class='option-record-item' id='favorite-btn-record-item'><div>❤︎</div></div></div>");
                        SetFile("record-poster", sortData.Poster, $("#item_" + sortData.RecordUid + " .record-poster-item"))
                    }
                })
            }).catch(error => console.error('Error:', error));
        var full = false;
        var showLoader = false;
        $(".main-content").on("scroll", function () {
            const contentDiv = $(this);
            const scrollTop = contentDiv.scrollTop();
            const scrollHeight = contentDiv[0].scrollHeight;
            const clientHeight = contentDiv[0].clientHeight;
            const all_content_card = $("#all-content-card > .type-card-content");
            if (!full && !showLoader) {
                showLoader = true;
                all_content_card.append(`<div class="page-loader">
                                      <span></span>
                                      <span></span>
                                      <span></span>
                                      <span></span>
                                      <span></span>
                                      <span></span>
                                    </div>`);
            }
            if (scrollTop + clientHeight >= scrollHeight - 10) {
                currentPage++;
                fetch(uri + 'Record/page/' + currentPage + "&10")
                    .then(reponse => reponse.json())
                    .then(data => {
                        showLoader = false;
                        $(".page-loader").remove();
                        if (data.length <= 0) {
                            full = true;
                        }
                        data.sort((a, b) => b.views - a.views);
                        var count = 0;
                        data.forEach(sortData => {
                            count++;
                            all_content_card.append("<div class='record-item' id='item_" + sortData.RecordUid + "'>" + `<img class='premium-record-icon ${sortData.Payfee}' src='/lib/crown-minimalistic-svgrepo-com.svg'/>` + "<img class='record-poster-item'></img><br/><span class='title-item'>" + sortData.DisplayName + "</span><br/><span class='subline-item'>Ca khúc<span/>" + "<div class='option-record-item' id='playlist-btn-record-item'><div>+</div></div><div class='option-record-item' id='favorite-btn-record-item'><div>❤︎</div></div></div>");
                            SetFile("record-poster", sortData.Poster, $("#item_" + sortData.RecordUid + " .record-poster-item"))
                        })
                    }).catch(error => console.error('Error:', error));
            }
        });
    } else if (window.location.href.includes('/category/')) {
        fetch(uri + 'Category/records/' + $("#categoryUidTag").attr("content"))
            .then(reponse => reponse.json())
            .then(data => {
                const top_card = $("#top-records-categorypage-card > .type-card-content");
                const all_content_card = $("#all-content-card > .type-card-content");
                top_card.empty();
                all_content_card.empty();
                data.sort((a, b) => b.views - a.views);
                var count = 0;
                data.forEach(sortData => {
                    count++;
                    if (count <= 6) {
                        top_card.append("<div class='record-item' id='item_" + sortData.RecordUid + "'>" + `<img class='premium-record-icon ${sortData.Payfee}' src='/lib/crown-minimalistic-svgrepo-com.svg'/>` + "<img class='record-poster-item'></img><br/><span class='title-item'>" + sortData.DisplayName + "</span><br/><span class='subline-item'>Ca khúc<span/>" + "<div class='option-record-item' id='playlist-btn-record-item'><div>+</div></div><div class='option-record-item' id='favorite-btn-record-item'><div>❤︎</div></div></div>");
                        SetFile("record-poster", sortData.Poster, $("#item_" + sortData.RecordUid + " .record-poster-item"))
                    } else {
                        all_content_card.append("<div class='record-item' id='item_" + sortData.RecordUid + "'>" + `<img class='premium-record-icon ${sortData.Payfee}' src='/lib/crown-minimalistic-svgrepo-com.svg'/>` + "<img class='record-poster-item'></img><br/><span class='title-item'>" + sortData.DisplayName + "</span><br/><span class='subline-item'>Ca khúc<span/>" + "<div class='option-record-item' id='playlist-btn-record-item'><div>+</div></div><div class='option-record-item' id='favorite-btn-record-item'><div>❤︎</div></div></div>");
                        SetFile("record-poster", sortData.Poster, $("#item_" + sortData.RecordUid + " .record-poster-item"))
                    }
                })
            }).catch(error => console.error('Error:', error));
    } else if (window.location.href.includes("/Category")) {
        fetch(uri + 'Category/top-cate')
            .then(reponse => reponse.json())
            .then(data => {
                const top_card = $("#top-category-card > .type-card-content");
                const all_card = $("#all-content-card > .type-card-content");
                all_card.empty();
                top_card.empty();
                data.sort((a, b) => b.TotalViews - a.TotalViews);
                var count = 0;
                data.forEach(cate => {
                    count++;
                    if (count <= 4) {
                        top_card.append("<div class='category-item' id='" + cate.CategoryUid + "'>" + "<div id='index-icon-box-" + count + "_" + cate.CategoryUid + "' class='category-icon-box' style='background-color: " + getRandomColor() + "'><span class='title-item' style='font-size: 30px; text-shadow: 0px 0px 50px white; display: inline-block'>" + cate.DisplayName + "</span><canvas style='display: none' id='canvas-cate-index-" + count + "_" + cate.CategoryUid + "'></canvas><img id='index-cate-avata-" + count + "_" + cate.CategoryUid + "' class='outstanding-poster-record-cate-item'/></div><span class='subline-item'>Tổng lượt nghe: " + cate.TotalViews + "<span/><br/><span class='subline-item'>" + cate.TotalRecords + " Bài hát</span>" + "<div class='option-record-item' id='playlist-btn-record-item'><div>+</div></div><div class='option-record-item' id='favorite-btn-record-item'><div>❤︎</div></div></div>");
                        SetFile("record-poster", cate.OutstandingRecordPoster, $("#" + cate.CategoryUid + " .category-icon-box img"));
                    } else {
                        all_card.append("<div class='category-item' id='" + cate.CategoryUid + "'>" + "<div id='index-icon-box-" + count + "_" + cate.CategoryUid + "' class='category-icon-box' style='background-color: " + getRandomColor() + "'><span class='title-item' style='font-size: 30px; text-shadow: 0px 0px 50px white; display: inline-block'>" + cate.DisplayName + "</span><canvas style='display: none' id='canvas-cate-index-" + count + "_" + cate.CategoryUid + "'></canvas><img id='index-cate-avata-" + count + "_" + cate.CategoryUid + "' class='outstanding-poster-record-cate-item'/></div><span class='subline-item'>Tổng lượt nghe: " + cate.TotalViews + "<span/><br/><span class='subline-item'>" + cate.TotalRecords + " Bài hát</span>" + "<div class='option-record-item' id='playlist-btn-record-item'><div>+</div></div><div class='option-record-item' id='favorite-btn-record-item'><div>❤︎</div></div></div>");
                        SetFile("record-poster", cate.OutstandingRecordPoster, $("#" + cate.CategoryUid + " .category-icon-box img"));
                    }
                });
            }).catch(error => console.error('Error:', error));
    }
    else if (window.location.pathname === '/login' || window.location.pathname === '/signin') {
        const leftside = $(".leftside");
        const main = $(".main");
        const main_content = $(".main-content");
        leftside.remove();
        main.css("width", "100%");
        main_content.css("display", "flex")
        main_content.css("display", "flex")
        main_content.css("overflow", "hidden")
    } else if (window.location.href.includes("/playlist/")) {
        const pid = sessionStorage.getItem("currentPlaylistUid");
        $.ajax({
            url: uri + "Playlist/record/" + pid,
            type: 'GET',
            headers: {
                "Authorization": "Bearer " + getCookie("token_login")
            },
            success: function (records) {
                const container = $("#playlist-page-item-container");
                var count = 0;
                records.forEach(record => {
                    count++;
                    container.append(`<div class="playlist-page-item playlist-record-item" id="${record.recordUid}">
                                        <div class="playlist-item-col-1 playlist-page-item-poster">
                                            <img id="playlist-item-img-index-${count}" src=""/>
                                        </div>
                                        <div class="playlist-item-col-2 playlist-page-item-name">
                                            ${record.displayName}
                                        </div>
                                        <div class="playlist-item-col-3 playlist-page-item-artist">
                                            ${record.artist.stageName}
                                        </div>
                                        <div class="playlist-item-col-4 playlist-page-item-category">
                                            ${record.category.displayName}
                                        </div>
                                        <div class="playlist-item-col-5 playlist-page-item-action">
                                            <img class="add-wishlist-record-playlist-item-button" src="/lib/favourite.png" style="width: 24px; height: 24px;"/>
                                            <img class="delete-record-playlist-item-button" src="/lib/trash-bin.png" style="width: 16px; height: 16px;"/>
                                        </div>
                                    </div>`);
                    SetFile("record-poster", record.poster, $('#playlist-item-img-index-' + count + ''));
                });
                const audioPlayer = document.querySelector(".audio-player");
                const item = $(".playlist-record-item").get(0);
                $(item).css("background-color", "#dc7349");
                loadAudio(audioPlayer, item.id, true);

                $(document).on('click', ".playlist-record-item", function () {
                    const id = $(this).attr("id");
                    $(".playlist-record-item").css("background-color", "");
                    $(this).css("background-color", "#dc7349");
                    const audioPlayer = document.querySelector(".audio-player");
                    loadAudio(audioPlayer, id, true);

                });
                $("#rename-playlist-btn").click(function () {
                    const textBoxName = $("#playlist-page-displayname");
                    const sumbitButton = $("#rename-playlist-sumbit");
                    sumbitButton.css("display", "flex");
                    textBoxName.css("background-color", "white");
                    textBoxName.css("color", "gray");
                    textBoxName.attr("readonly", null);
                });
                $("#rename-playlist-sumbit").click(function () {
                    const content = $("#playlist-page-displayname").val();
                    playlistRename(content);
                });
            }
        });


    } else if (window.location.href.includes("/favorite/")) {
        $.ajax({
            url: uri + "FavoriteList/get/" + getCookie("token_login"),
            type: 'GET',
            headers: {
                "Authorization": "Bearer " + getCookie("token_login")
            },
            success: function (records) {
                const container = $("#favorite-page-item-container");
                var count = 0;
                records.forEach(record => {
                    count++;
                    container.append(`<div class="favorite-page-item favorite-record-item" id="${record.RecordUid}">
                                        <div class="favorite-item-col-1 favorite-page-item-poster">
                                            <img id="favorite-item-img-index-${count}" src=""/>
                                        </div>
                                        <div class="favorite-item-col-2 favorite-page-item-name">
                                            ${record.DisplayName}
                                        </div>
                                        <div class="favorite-item-col-3 favorite-page-item-artist">
                                            ${record.StageName}
                                        </div>
                                        <div class="favorite-item-col-4 favorite-page-item-category">
                                            ${record.cate_display}
                                        </div>
                                        <div class="favorite-item-col-5 favorite-page-item-action">
                                            <img class="delete-record-favorite-item-button" src="/lib/trash-bin.png" style="width: 16px; height: 16px;"/>
                                        </div>
                                    </div>`);
                    SetFile("record-poster", record.Poster, $('#favorite-item-img-index-' + count + ''));
                });
                const audioPlayer = document.querySelector(".audio-player");
                const item = $(".favorite-record-item").get(0);
                $(item).css("background-color", "#dc7349");
                loadAudio(audioPlayer, item.id, true);

                $(document).on('click', ".favorite-record-item", function () {
                    const id = $(this).attr("id");
                    $(".favorite-record-item").css("background-color", "");
                    $(this).css("background-color", "#dc7349");
                    const audioPlayer = document.querySelector(".audio-player");
                    loadAudio(audioPlayer, id, true);

                });
                $(document).on('click', ".delete-record-favorite-item-button", function (event) {
                    event.stopPropagation();
                    const recordItem = $(this).parent().parent();
                    const rUid = recordItem.attr("id");
                    $.ajax({
                        url: uri + "FavoriteList/remove/session_login_uid=" + getCookie("token_login") + "record_uid=" + rUid,
                        type: 'DELETE',
                        data: JSON.stringify({
                            sid: getCookie("token_login"),
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
                })
            }
        });


    } else if (location.href.includes("/pay_confirm")) {
        setTimeout(() => {
            open("/", "_parent")
        }, 2000);
    }else if (location.href.includes("infoArtist")) {
        $("#artist-info-tab-info").css("display", "block");

        $(document).on('click', ".artist-info-tabmenu div", function () {
            const clicker = $(this);
            $(".artist-info-tabmenu div .tabmenu-selection").remove();
            clicker.append("<div class='tabmenu-selection'></div>");
            $(".artist-info-tab").css("display", "none");
            switch (clicker.attr("id")) {
                case "tabmenu-info":
                    $("#artist-info-tab-info").css("display", "block");
                    break; ss
                case "tabmenu-records":
                    $("#artist-info-tab-records").css("display", "block");
                    break;
            }
        });
        var rawUid = location.href.split("/");
        const uid = rawUid[rawUid.length - 1];
        $.ajax({
            url: uri + "Artist/" + uid,
            type: 'GET',
            data: JSON.stringify({
                id: uid
            }),
            success: function (artist) {
                SetFile("artist-avata", artist.avata, $("#artist-avata-container img"));
            },
            error: function (e) {

            }
        });
        $.ajax({
            url: uri + "Artist/records/" + uid,
            type: 'GET',
            data: JSON.stringify({
                id: uid
            }),
            success: function (records) {
                const top_card = $("#top-page-card > .type-card-content");
                const all_content_card = $("#all-content-card > .type-card-content");
                top_card.empty();
                all_content_card.empty();
                records.sort((a, b) => b.Views - a.Views);
                var count = 0;
                records.forEach(sortData => {
                    count++;
                    if (count <= 5) {
                        top_card.append("<div class='record-item' id='item_" + sortData.RecordUid + "'>" + `<img class='premium-record-icon ${sortData.Payfee}' src='/lib/crown-minimalistic-svgrepo-com.svg'/>` + "<img class='record-poster-item'></img><br/><span class='title-item'>" + sortData.DisplayName + "</span><br/><span class='subline-item'>Ca khúc<span/>" + "<div class='option-record-item' id='playlist-btn-record-item'><div>+</div></div><div class='option-record-item' id='favorite-btn-record-item'><div>❤︎</div></div></div>");
                        SetFile("record-poster", sortData.Poster, $("#item_" + sortData.RecordUid + " .record-poster-item"))

                    } else {

                        all_content_card.append("<div class='record-item' id='item_" + sortData.RecordUid + "'>" + `<img class='premium-record-icon ${sortData.Payfee}' src='/lib/crown-minimalistic-svgrepo-com.svg'/>` + "<img class='record-poster-item'></img><br/><span class='title-item'>" + sortData.DisplayName + "</span><br/><span class='subline-item'>Ca khúc<span/>" + "<div class='option-record-item' id='playlist-btn-record-item'><div>+</div></div><div class='option-record-item' id='favorite-btn-record-item'><div>❤︎</div></div></div>");
                        SetFile("record-poster", sortData.Poster, $("#item_" + sortData.RecordUid + " .record-poster-item"))
                    }
                })
            },
            error: function (error) {
                console.log('Lỗi' + error);
            }
        });
        (async function () {
            const img = document.getElementById('info-page-avata-artist');
            const canvas = document.getElementById('imageCanvas');
            const ctx = canvas.getContext('2d');

            img.onload = function () {
                // Vẽ ảnh lên canvas
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // Lấy dữ liệu pixel
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;

                // Lưu màu và số lần xuất hiện
                const colorCount = {};
                let mostFrequentColor = '';
                let maxCount = 0;

                // Duyệt qua dữ liệu pixel
                for (let i = 0; i < pixels.length; i += 4) {
                    const r = pixels[i];
                    const g = pixels[i + 1];
                    const b = pixels[i + 2];
                    const color = `${r},${g},${b}`;

                    // Tính số lần xuất hiện của màu
                    if (colorCount[color]) {
                        colorCount[color]++;
                    } else {
                        colorCount[color] = 1;
                    }

                    // Kiểm tra nếu màu này xuất hiện nhiều nhất
                    if (colorCount[color] > maxCount) {
                        maxCount = colorCount[color];
                        mostFrequentColor = color;
                    }
                }
                document.getElementById("artist-info-container").style.background = `linear-gradient(rgb(${mostFrequentColor}), #00000000)`;
            }
        })();

    } else if (location.href.includes("/search_results/")) {
        var currentSearchPage = 1;
        const key = $("#data-search").val();
        const container = $("#search-page-content");
        var data = new FormData();
        data.append("keyword", key);
        $.ajax({
            url: uri + "Record/search_query=" + key + "&" + currentSearchPage,
            type: 'GET',
            success: function (records) {
                records.sort((a, b) => b.Views - a.Views);
                var count = 0;
                records.forEach(record => {
                    count++;
                    var artist_container_id;
                    container.append('<div class="search-item" id="index-' + count + '_' + record.RecordUid + '"><div class="search-item-poster-container"><img /></div><div class="search-item-info-container"><a class="search-item-displayname" href="/audio/' + record.RecordUid + '">' + record.DisplayName + '</a><br /><span class="search-item-views">Lượt nghe ' + record.Views + '</span><br /><div class="search-item-artist-container" id="index-' + count + '_' + record.ArtistUid + '"><img class="search-item-avata-artist"/><span class="search-item-stagename"></span></div></div></div>');
                    SetFile("record-poster", record.Poster, $("#index-" + count + '_' + record.RecordUid + " .search-item-poster-container img"));
                    artist_container_id = "#index-" + count + "_" + record.ArtistUid;
                    $.ajax({
                        url: uri + "Artist/" + record.ArtistUid,
                        type: 'GET',
                        success: function (artist) {
                            SetFile("artist-avata", artist.avata, $(artist_container_id + " > img"));
                            $(artist_container_id + " > .search-item-stagename").text(artist.stageName);
                        }
                    })
                });
                $("#search-amount").text("Tìm thấy " + records.length + " kết quả");
            },
            error: function (e) {
                console.log("Lỗi: " + e);
            }
        });
        $(".search-page-container").on("scroll", function () {
            const contentDiv = $(this);
            const scrollTop = contentDiv.scrollTop();
            const scrollHeight = contentDiv[0].scrollHeight;
            const clientHeight = contentDiv[0].clientHeight;
            if (!full && !showLoader) {
                showLoader = true;
                $("#search-page-content").append(`<div class="page-loader">
                                      <span></span>
                                      <span></span>
                                      <span></span>
                                      <span></span>
                                      <span></span>
                                      <span></span>
                                    </div>`);
            }
            if (scrollTop + clientHeight >= scrollHeight - 10) {
                currentSearchPage++;
                $.ajax({
                    url: uri + "Record/search_query=" + key + "&" + currentSearchPage,
                    type: 'GET',
                    success: function (records) {
                        $(".page-loader").remove();
                        records.sort((a, b) => b.Views - a.Views);
                        var count = 0;
                        records.forEach(record => {
                            count++;
                            var artist_container_id;
                            container.append('<div class="search-item" id="index-' + count + '_' + record.RecordUid + '"><div class="search-item-poster-container"><img /></div><div class="search-item-info-container"><a class="search-item-displayname" href="/audio/' + record.RecordUid + '">' + record.DisplayName + '</a><br /><span class="search-item-views">Lượt nghe ' + record.Views + '</span><br /><div class="search-item-artist-container" id="index-' + count + '_' + record.ArtistUid + '"><img class="search-item-avata-artist"/><span class="search-item-stagename"></span></div></div></div>');
                            SetFile("record-poster", record.Poster, $("#index-" + count + '_' + record.RecordUid + " .search-item-poster-container img"));
                            artist_container_id = "#index-" + count + "_" + record.ArtistUid;
                            $.ajax({
                                url: uri + "Artist/" + record.ArtistUid,
                                type: 'GET',
                                success: function (artist) {
                                    SetFile("artist-avata", artist.avata, $(artist_container_id + " > img"));
                                    $(artist_container_id + " > .search-item-stagename").text(artist.stageName);
                                }
                            })
                        });
                        $("#search-amount").text("Tìm thấy " + records.length + " kết quả");
                    },
                    error: function (e) {
                        console.log("Lỗi: " + e);
                    }
                });
            }
        });
    } else if (location.href.includes("/premium_register")) {
        const leftside = $(".leftside");
        const rightside = $(".right-side");
        const main = $(".main");
        const main_content = $(".main-content");
        leftside.remove();
        rightside.remove();
        main.css("width", "100%");
        main_content.css("display", "flex")
        main_content.css("display", "flex")
        main_content.css("overflow", "hidden")
    }
    function playlistRename(content) {
        var data = new FormData();
        const tokenLogin = getCookie("token_login");
        const pid = sessionStorage.getItem("currentPlaylistUid");
        data.append("sessionUid", tokenLogin);
        data.append("userName", userNameHasLogin);
        data.append("pid", pid);
        $.ajax({
            url: uri + "Playlist/rename/sessionLogin=" + tokenLogin + "&username=" + userNameHasLogin + "&id=" + pid + "&content=" + content,
            type: 'POST',
            data: data,
            contentType: false,
            processData: false,
            success: function (response) {
                location.reload();
            },
            error: function (error) {

            },
        });
    }
});
