if (accounts.length > 0) {

    async function getTimeLine() {

        var url = 'https://'+accounts[0].host+'/api/notes/global-timeline'
        var param = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                limit: 100
            })
        }
        var data = await fetch(url, param)
        var result = await data.json()
    
        for (var i=0; i<result.length;i++) {
            document.querySelector('#note-box').innerHTML += '<div class="notes"><div class="notes-user">@'+result[i].user.username+'@'+result[i].user.host+'</div><div class="notes-text">'+result[i].text+'</div></div>'
        }
    }

}