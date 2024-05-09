if (accounts.length > 0 && mode == 'manual') {

    document.querySelector('#post-box').innerHTML += '<div id="select-box"><select id="select-input" name="account" id="account"></select></div>'

    for (var i=0; i<accounts.length; i++) {
        document.querySelector('#select-input').innerHTML += '<option value="'+i+'">@'+accounts[i].username+'@'+accounts[i].host+'</option>'
    }

}