async function signin(host) {
    let uuid = self.crypto.randomUUID()

    localStorage.setItem("lastSessionId", uuid)
    localStorage.setItem("lastHost", host)

    function misskeySignin() {
        const misskeySigninUrl = 'https://'+host+'/miauth/'+uuid+'?name=Multi-Account&callback='+encodeURIComponent(location.href.split('?')[0])+'%3Fpage%3Dcallback&permission=write:account,read:account,write:drive,write:notes'
        location.href = misskeySigninUrl;
    }

    async function mastodonSignin() {
        const mastodonCreateAppUrl = 'https://'+host+'/api/v1/apps'
        const mastodonCreateAppParam = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                client_name: "apap",
                redirect_uris: `${encodeURIComponent(location.href.split('?')[0])}?page=callback`,
                scopes: 'read write'
            })
        }
        try {
            var mastodonCreateApp = await fetch(mastodonCreateAppUrl, mastodonCreateAppParam)
            var mastodonCreateAppRes = await mastodonCreateApp.json()
            var client_id = mastodonCreateAppRes.client_id
            var client_secret = mastodonCreateAppRes.client_secret
            localStorage.setItem('client_id', client_id)
            localStorage.setItem('client_secret', client_secret)

            const mastodonSigninUrl = `https://${host}/oauth/authorize?response_type=code&client_id=${client_id}&redirect_uri=${encodeURIComponent(location.href.split('?')[0])}&scope=read%20write&lang=ko-KR`
            console.log(mastodonSigninUrl)
            // location.href = mastodonSigninUrl;

        } catch(err) {
            console.log(err)
        }
    }

    try {
        //미스키 api
        const misskeyApiTestUrl = 'https://'+host+'/api/emojis'
        var misskeyFetch = await fetch(misskeyApiTestUrl)
        var misskeyFetchRes = await misskeyFetch.json()
        misskeySignin()
    } catch(err1) {
        try {
            //마스토돈 api
            const mastodonApiTestUrl = 'https://'+host+'/api/v2/instance'
            var mastodonFetch = await fetch(mastodonApiTestUrl)
            var mastodonFetchRes = await mastodonFetch.json()
            mastodonSignin()
        } catch(err2) {
            document.querySelector('#post-box').innerHTML += '정확한 인스턴스 주소를 입력했는지 확인해 주세요!'
        }
    }

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
                    "type": 'misskey',
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

} else if ( code ) { //mastodon
    var sessionId = localStorage.getItem('lastSessionId')
    var sessionHost = localStorage.getItem('lastHost')

    async function register(value, vis) {
        const mastodonCreateTokenUrl = 'https://'+sessionHost+'/oauth/token'
        const mastodonCreateTokenParam = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                grant_type: "authorization_code",
                code: code,
                client_id: localStorage.getItem('client_id'),
                client_secret: localStorage.getItem('client_secret'),
                redirect_uri: `${encodeURIComponent(location.href.split('?')[0])}?page=callback`,
                scope: 'read write'
            })
        }
        try {
            var mastodonCreateToken = await fetch(mastodonCreateTokenUrl, mastodonCreateTokenParam)
            var mastodonCreateTokenResult = await mastodonCreateToken.json()
    
            var mastoToken = mastodonCreateTokenResult.access_token
    
            const mastodonMeUrl = `https://${sessionHost}/api/v1/accounts/verify_credentials`
            const mastodonMeParam = {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer `+mastoToken,
                }
            }
            try {
                var me = await fetch(mastodonMeUrl, mastodonMeParam)
                var meRes = await me.json()
        
                var userId = meRes.id
                var username = meRes.username
                var avatar = meRes.avatar
        
                accounts.push({
                    "type": 'mastodon',
                    "host": sessionHost,
                    "sessionId": sessionId,
                    "userId": userId,
                    "username": username,
                    "avatar": avatar,
                    "role": value,
                    "vis": vis,
                    "token": mastoToken
                })
            } catch (err) {
                console.log(err)
            }
        } catch(err) {
            console.log(err)
        }
    }

    document.querySelector('#post-box').innerHTML = '<div id="role-label">이 계정의 역할:</div><input id="role-input" oninput="changeRoleDisabled(this)"><div id="role-label">고정 공개범위:</div><select id="vis-input"><option value="public">공개</option><option value="home">홈</option><option value="followers">팔로워</option></select><button id="role-button" disabled="true" onclick="register(document.querySelector(`#role-input`).value, document.querySelector(`#vis-input`).value)">확인</button>'

}