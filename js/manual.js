if (accounts.length > 0 && mode == 'manual') {

    document.querySelector('#post-box').innerHTML += '<div id="select-box"><select name="account" id="account"></div>'

    for (var i=0; i<accounts.length; i++) {
        document.querySelector('#select-box').innerHTML += '<option value="'+i+'">@'+accounts[i].username+'@'+accounts[i].host+'</option>'
    }

}