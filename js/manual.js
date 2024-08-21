function changeGPTDisabled(e) {
    if (e.value != '' && localStorage.getItem('gptToken') != '') {
        document.querySelector('#gpt-button').disabled = false
    } else {
    }
}

function changePostDisabled(e) {
    document.querySelector('#wordcount').innerText = e.value.length
    if (e.value != '' && localStorage.getItem('gptToken') != '') {
        document.querySelector('#post-button').disabled = false
        document.querySelector('#gpt-button').disabled = false
    } else if (e.value != '' ) {
        document.querySelector('#post-button').disabled = false
        document.querySelector('#gpt-button').disabled = true
    } else {
        document.querySelector('#post-button').disabled = true
        document.querySelector('#gpt-button').disabled = true
    }
}

async function translategpt(text) {
    document.querySelector('#gpt-button').disabled = true
    document.querySelector('#post-button').disabled = true

    var msgs = [{"role": "system", "content": "Make the following (after the colon) sentence into a pretty and polite Korean sentence. Please print out only the content WITHOUT quotation marks:"}]

    msgs.push({"role": 'user', "content": text})

    var sendChatUrl = 'https://api.openai.com/v1/chat/completions'
    var sendChatParam = {
        body: JSON.stringify({
            "model": "gpt-4o-mini", 
            "messages": msgs, 
            "temperature": 0.7,
            "max_tokens": 512}),
        method: "POST",
        headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + localStorage.getItem('gptToken'),
        }
    }
    var data = await fetch(sendChatUrl, sendChatParam)
    var result = await data.json()
    document.querySelector('#gpt-button').disabled = true
    document.querySelector('#post-button').disabled = false

    if (result.choices) {
        var response = result.choices[0].message.content
        document.querySelector(`#post-input`).value = response
    }
}

async function post(accountIndex, text) {

    var vis = accounts[accountIndex].vis
    
    if (accounts[accountIndex].type == 'misskey') {

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
    
        csv += text.replace(/\,/gm, '&comma;').replace(/\n/gm, ' ') + ',' + accountIndex + ',' + accounts[accountIndex].role + '\n'
        localStorage.setItem('csv', csv)

    } else { //마스토돈
        if (vis == 'home') {
            vis = 'unlisted'
        } else if (vis == 'followers') {
            vis = 'private'
        }
        var url = `https://${accounts[accountIndex].host}/api/v1/statuses`
        var param = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer `+accounts[accountIndex].token,
            },
            body: JSON.stringify({
                status: text,
                visibility: vis,
                content_type: 'text/markdown'
            })
        }

        var data = await fetch(url, param)
        var result = await data.json()
    
        csv += text.replace(/\,/gm, '&comma;').replace(/\n/gm, ' ') + ',' + accountIndex + ',' + accounts[accountIndex].role + '\n'
        localStorage.setItem('csv', csv)
    }

    getTimeLine()

    document.querySelector(`#post-input`).value = ''
    document.querySelector('#gpt-button').disabled = true
    document.querySelector('#post-button').disabled = true
    document.querySelector('#wordcount').innerText = 0

}

if (accounts.length > 0 && mode == 'manual') {
    window.onbeforeunload = function () {
        return ''; 
    }

    document.querySelector('#mode').innerHTML = '현재 모드는 수동 분류 모드 입니다.'

    if (page !== 'signin' && page !=='callback' && page !== 'gpt' && !code) {

        document.querySelector('#post-box').innerHTML = '<div id="post-label">게시하기: <span id="wordcount"></span></div><textarea id="post-input" oninput="changePostDisabled(this)"></textarea><button id="gpt-button" disabled="true" onclick="translategpt(document.querySelector(`#post-input`).value)">GPT-변환</button><button id="post-button" disabled="true" onclick="post(parseInt(document.querySelector(`#select-input`).value), document.querySelector(`#post-input`).value)">게시!</button>'

        document.querySelector('#post-box').innerHTML += '<div id="select-box"><select id="select-input" name="account" id="account"></select></div>'

        for (var i=0; i<accounts.length; i++) {
            document.querySelector('#select-input').innerHTML += '<option value="'+i+'">'+accounts[i].role+' (@'+accounts[i].username+'@'+accounts[i].host+')</option>'
        }
    }
}