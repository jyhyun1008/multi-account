if (page == 'gpt') {

    function changeTokenDisabled(e) {
        if (e.value != '') {
            document.querySelector('#token-button').disabled = false
        } else {
            document.querySelector('#token-button').disabled = true
        }
    }

    function addGptToken(token) {
        localStorage.setItem("gptToken", token)
    }

    document.querySelector('#post-box').innerHTML = '<div id="token-label">OpenAI 액세스 토큰:</div><input id="token-input" oninput="changeTokenDisabled(this)">><button id="token-button" disabled="true" onclick="addGptToken(document.querySelector(`#token-input`).value)">저장</button>'

}