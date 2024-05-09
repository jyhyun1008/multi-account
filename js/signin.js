function signin(host) {
    let uuid = self.crypto.randomUUID()

    localStorage.setItem("lastSessionId", uuid)
    localStorage.setItem("lastHost", host)
    var signinUrl = 'https://'+host+'/miauth/'+uuid+'?name=Multi-Account&callback='+encodeURIComponent(location.href.split('?')[0])+'%3Fpage%3Dcallback&permission=write:account,read:account,write:drive,write:notes'
    location.href = signinUrl;
}

function changeDisabled(e) {
    if (e.value != '') {
        document.querySelector('#host-button').disabled = false
    } else {
        document.querySelector('#host-button').disabled = true
    }
}

function changeRoleDisabled(e) {
    if (e.value != '') {
        document.querySelector('#role-button').disabled = false
    } else {
        document.querySelector('#role-button').disabled = true
    }
}

if (page == 'signin') {

    document.querySelector('#post-box').innerHTML = '<div id="host-label">계정이 있는 인스턴스 주소:</div><input id="host-input" oninput="changeDisabled(this)"><button id="host-button" disabled="true" onclick="signin(document.querySelector(`#host-input`).value)">로그인!</button>'

} else if (page == 'callback') {

    function register(value, vis) {

        if (localStorage.getItem('lastSessionId')) {
            var sessionId = localStorage.getItem('lastSessionId')
            var sessionHost = localStorage.getItem('lastHost')
            var postUrl = 'https://'+sessionHost+'/api/miauth/'+sessionId+'/check'
            var postParam = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({})
            }
            fetch(postUrl, postParam)
            .then((tokenData) => {return tokenData.json()})
            .then((tokenRes) => {

                var token = tokenRes.token
                var userId = tokenRes.user.id
                var username = tokenRes.user.username
                var avatar = tokenRes.user.avatarUrl

                accounts.push({
                    "host": sessionHost,
                    "sessionId": sessionId,
                    "userId": userId,
                    "username": username,
                    "avatar": avatar,
                    "role": value,
                    "vis": vis,
                    "token": token
                })

                localStorage.setItem("accounts", JSON.stringify(accounts))
                localStorage.removeItem("lastSessionId")
                localStorage.removeItem("lastHost")

                location.href = './index.html'
            })
        } else {
            alert('잘못된 접근입니다.')
        }
    }

    document.querySelector('#post-box').innerHTML = '<div id="role-label">이 계정의 역할:</div><input id="role-input" oninput="changeRoleDisabled(this)"><div id="role-label">고정 공개범위:</div><select id="vis-input"><option value="public">공개</option><option value="home">홈</option><option value="followers">팔로워</option></select><button id="role-button" disabled="true" onclick="register(document.querySelector(`#role-input`).value, document.querySelector(`#vis-input`).value)">확인</button>'

}