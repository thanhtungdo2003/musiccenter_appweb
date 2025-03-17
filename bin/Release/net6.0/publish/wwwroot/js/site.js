
const uri = "http://localhost:5000/api/";
$(document).ready(function () {
    fetch('https://localhost:5001/api/Artist')
        .then(reponse => reponse.json())
        .then(data => {
            const artsit_card = $("#artis-card > .type-card-content");
            artsit_card.empty();
            var count = 0;
            data.forEach(artist => {
                if (count == 5) return;
                count++;
                artsit_card.append("<div class='artist-item' id='" + artist.artistUid + "'>" + "<img class='artist-avt-item'></img><br/><span class='title-item'>" + artist.stageName + "</span><br/><span class='subline-item'>Nghệ sĩ<span/>" + "</div>");
                $("#" + artist.artistUid + " img").attr("src", "data:image/jpeg;base64," + artist.avata);
            })
        }).catch(error => console.error('Error:', error));


    //
    fetch(uri + 'Record/Viral')
        .then(reponse => reponse.json())
        .then(data => {
            const viral_card = $("#viral-card > .type-card-content");
            viral_card.empty();
            var jsonList = data.sort((a, b) => b.views - a.views);

            var count = 0;
            jsonList.forEach(viral_music => {
                if (count == 5) return;
                count++;
                fetch('https://localhost:7165/api/Record/' + viral_music.uid)
                    .then(reponse_record => reponse_record.json())
                    .then(data_record => {
                        const record = data_record.value;
                        viral_card.append("<div class='record-item' id='" + record.uid + "'>" + "<img class='record-poster-item'></img><br/><span class='title-item'>" + record.displayName + "</span><br/><span class='subline-item'>Ca khúc<span/>" + "</div>");
                        $("#" + record.uid + " img").attr("src", "data:image/jpg;base64," + record.poster);
                    }).catch(error_record => console.error());
            })
        }).catch(error => console.error('Error:', error));
        //
    fetch('https://localhost:7165/api/Record')
        .then(reponse => reponse.json())
        .then(data => {
            const new_product_card = $("#new-product-card > .type-card-content");
            new_product_card.empty();

            var count = 0;
            data.forEach(record => {
                if (count == 5) return;
                count++;
                new_product_card.append("<div class='record-item' id='" + record.uid + "'>" + "<img class='record-poster-item'></img><br/><span class='title-item'>" + record.displayName + "</span><br/><span class='subline-item'>Ca khúc<span/>" + "</div>");
                $("#" + record.uid + " img").attr("src", "data:image/jpg;base64," + record.poster);
            })
        }).catch(error => console.error('Error:', error));
    //
    fetch('https://localhost:7165/api/Record')
        .then(reponse => reponse.json())
        .then(data => {
            const top_card = $("#top-card > .type-card-content");
            top_card.empty();
            let jsonList;
            jsonList = data.sort((a, b) => b.views - a.views);
            var count = 0;
            jsonList.forEach(record => {
                if (count == 5) return;
                count++;
                top_card.append("<div class='record-item' id='" + record.uid + "'>" + "<img class='record-poster-item'></img><br/><span class='title-item'>" + record.displayName + "</span><br/><span class='subline-item'>Ca khúc<span/>" + "</div>");
                $("#" + record.uid + " img").attr("src", "data:image/jpeg;base64," + record.poster);
            });
        }).catch(error => console.error('Error:', error));

    $(document).on('click', '.record-item', function () {
        const id = $(this).attr("id");
        localStorage.setItem("uid_record", id);
        open("audio", "_parent");
    });
});