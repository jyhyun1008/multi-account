if (accounts.length > 0 && mode == 'manual') {

    document.querySelector('#post-box').innerHTML += '<select name="account" id="account">'

    for (var i=0; i<accounts.length; i++) {
        document.querySelector('#post-box').innerHTML += '<option value="'+i+'">@'+accounts[i].username+'@'+accounts[i].host+'</option>'
    }

}