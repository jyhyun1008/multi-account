
async function getTimeLine() {

    document.querySelector('#note-box').innerHTML = ''
    document.querySelector('#timeline-box').innerHTML = ''

    var parsedCSV = csv.split('\n')
    if (parsedCSV.length > 1) {
        document.querySelector('#dataset-length').innerHTML = ' (' + parsedCSV.length - 1 + ')'
    } else {
        document.querySelector('#dataset-length').innerHTML = ' (0)'
    }
    for (var i=parsedCSV.length - 2; i>-1; i--) {
        var parsedText = parsedCSV[i].split(',')[0]
        var parsedIndex = parseInt(parsedCSV[i].split(',')[1])

        document.querySelector('#note-box').innerHTML += '<div class="notes"><div class="notes-user" style="background-color:'+COLORCHIP[parsedIndex % COLORCHIP.length]+';">@'+accounts[parsedIndex].role+'</div><div class="notes-text">'+parsedText+'</div></div>'
    }

    if (accounts[0].type == 'misskey') {

        var url = 'https://'+accounts[0].host+'/api/notes/timeline'
        var param = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                i: accounts[0].token,
                limit: 100
            })
        }
        var data = await fetch(url, param)
        var result = await data.json()
    
        for (var i=0; i<result.length;i++) {
            var notetext = ''
            var notehost = accounts[0].host
            if (result[i].text) {
                notetext = result[i].text
            }
            if (result[i].user.host) {
                notehost = result[i].user.host
            }
            document.querySelector('#timeline-box').innerHTML += '<div class="notes"><div class="notes-user">@'+result[i].user.username+'@'+notehost+'</div><div class="notes-text">'+notetext+'</div></div>'
        }
    } else {
        //마스토돈 구현중
        var url = `https://${accounts[0].host}/api/v1/timelines/home?limit=40`
        var param = {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer `+accounts[0].token,
            }
        }
        var data = await fetch(url, param)
        var result = await data.json()

        for (var i=0; i<result.length;i++) {
            var notetext = ''
            var notehost = accounts[0].host
            if (result[i].content) {
                notetext = result[i].content
            }
            if (result[i].account.url) {
                notehost = result[i].account.url.split('://')[1].split('/')[0]
            }
            document.querySelector('#timeline-box').innerHTML += '<div class="notes"><div class="notes-user">@'+result[i].account.username+'@'+notehost+'</div><div class="notes-text">'+notetext+'</div></div>'
        }
    }

}

if (accounts.length > 0) {

    getTimeLine()

}