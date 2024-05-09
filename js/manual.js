function changeGPTDisabled(e) {
    if (e.value != '' && localStorage.getItem('gptToken')) {
        document.querySelector('#gpt-button').disabled = false
    } else {
        document.querySelector('#gpt-button').disabled = true
    }
}

function changePostDisabled(e) {
    if (e.value != '') {
        document.querySelector('#post-button').disabled = false
    } else {
        document.querySelector('#post-button').disabled = true
    }
}


async function translate(text) {

    var msgs = [{"role": "system", "content": "Make the following sentence into a pretty and polite Korean sentence. Please print out only the content without quotation marks:"}]

    document.querySelector(`#post-input`).value = ''
    msgs.push({"role": 'user', "content": text})

    var sendChatUrl = 'https://api.openai.com/v1/chat/completions'
    var sendChatParam = {
        body: JSON.stringify({
            "model": "gpt-4", 
            "messages": msgs, 
            "temperature": 0.7,
            "max_tokens": 512}),
        method: "POST",
        headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + authCode,
        }
    }
    var data = await fetch(sendChatUrl, sendChatParam)
    var result = await data.json()

    if (result.choices) {
        var response = result.choices[0].message.content
        document.querySelector(`#post-input`).value = response
    }
}


async function post(accountIndex, text) {

    var vis = accounts[accountIndex].vis

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
    document.querySelector('#post-button').disabled = true

}

if (accounts.length > 0 && mode == 'manual') {

    document.querySelector('#mode').innerHTML = '현재 모드는 수동 분류 모드 입니다.'

    if (page !== 'signin' && page !=='callback') {

        document.querySelector('#post-box').innerHTML = '<div id="post-label">게시하기:</div><textarea id="post-input" oninput="changePostDisabled(this)"></textarea><button id="gpt-button" disabled="true" onclick="translate(document.querySelector(`#post-input`).value)">GPT-변환</button><button id="post-button" disabled="true" onclick="post(parseInt(document.querySelector(`#select-input`).value), document.querySelector(`#post-input`).value)">게시!</button>'

        document.querySelector('#post-box').innerHTML += '<div id="select-box"><select id="select-input" name="account" id="account"></select></div>'

        for (var i=0; i<accounts.length; i++) {
            document.querySelector('#select-input').innerHTML += '<option value="'+i+'">'+accounts[i].role+' (@'+accounts[i].username+'@'+accounts[i].host+')</option>'
        }
    }
}