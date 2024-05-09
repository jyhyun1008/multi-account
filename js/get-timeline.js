
async function getTimeLine() {

    document.querySelector('#note-box').innerHTML = ''
    document.querySelector('#timeline-box').innerHTML = ''
    
    var parsedCSV = csv.split('\n')
    for (var i=parsedCSV.length - 2; i>-1; i--) {
        var parsedText = parsedCSV[i].split(',')[0]
        var parsedIndex = parseInt(parsedCSV[i].split(',')[1])

        document.querySelector('#note-box').innerHTML += '<div class="notes"><div class="notes-user">@'+accounts[parsedIndex].role+'</div><div class="notes-text">'+parsedText+'</div></div>'
    }

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
}

if (accounts.length > 0) {

    getTimeLine()

}