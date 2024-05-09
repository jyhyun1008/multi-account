function changePostDisabled(e) {
    if (e.value != '') {
        document.querySelector('#post-button').disabled = false
    } else {
        document.querySelector('#post-button').disabled = true
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

    csv += text.replace(/\,/gm, '&comma;').replace(/\n/gm, ' ') + ',' + accountIndex + '\n'
    localStorage.setItem('csv', csv)

    getTimeLine()

    document.querySelector(`#post-input`).value = ''

}

if (accounts.length > 0 && mode == 'manual') {

    document.querySelector('#mode').innerHTML = '현재 모드는 수동 분류 모드 입니다.'

    if (page !== 'signin' && page !=='callback') {

        document.querySelector('#post-box').innerHTML = '<div id="post-label">게시하기:</div><textarea id="post-input" oninput="changePostDisabled(this)"></textarea><button id="post-button" disabled="true" onclick="post(parseInt(document.querySelector(`#select-input`).value), document.querySelector(`#post-input`).value)">게시!</button>'

        document.querySelector('#post-box').innerHTML += '<div id="select-box"><select id="select-input" name="account" id="account"></select></div>'

        for (var i=0; i<accounts.length; i++) {
            document.querySelector('#select-input').innerHTML += '<option value="'+i+'">'+accounts[i].role+' (@'+accounts[i].username+'@'+accounts[i].host+')</option>'
        }

    }

}