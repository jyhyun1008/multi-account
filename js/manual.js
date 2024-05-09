function changePostDisabled(e) {
    if (e.value != '') {
        document.querySelector('#host-button').disabled = false
    } else {
        document.querySelector('#host-button').disabled = true
    }
}

async function post(accountIndex, text) {

    var vis = 'public'

    var url = 'https://'+accounts[accountIndex].host+'/api/notes/create'
    var param = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            i: accounts[accountIndex].token,
            text: text,
            visibility: vis,
        })
    }

    var data = await fetch(url, param)
    var result = await data.json()

    csv += text.replace(/\,/gm, '&comma;') + ',' + accountIndex + '\n'
    localStorage.setItem('csv', csv)

}

if (accounts.length > 0 && mode == 'manual') {

    document.querySelector('#post-box').innerHTML += '<div id="select-box"><select id="select-input" name="account" id="account"></select></div>'

    for (var i=0; i<accounts.length; i++) {
        document.querySelector('#select-input').innerHTML += '<option value="'+i+'">@'+accounts[i].username+'@'+accounts[i].host+'</option>'
    }

    if (page !== 'signin' && page !=='callback') {

        document.querySelector('#post-box').innerHTML = '<div id="post-label">게시하기:</div><input id="post-input" oninput="changeDisabled(this)"><button id="post-button" disabled="true" onclick="post(document.querySelector(`#select-input`).value, document.querySelector(`#post-input`).value)">게시!</button>'

    }

}