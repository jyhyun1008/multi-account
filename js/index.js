const COLORCHIP = ['#FFB5E8', '#D5AAFF', '#AFCBFF', '#AFF8DB', '#E7FFAC', '#FFF5BA']

var accounts = []
var csv = ''

function getQueryStringObject() {
    var a = window.location.search.substr(1).split('&');
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
}

var qs = getQueryStringObject()
var page = qs.page
var mode = qs.mode
var code = qs.code

if (!mode) {
    mode = 'manual'
}

if (localStorage.getItem('csv')) {
    csv = localStorage.getItem('csv')
}

if (localStorage.getItem('accounts')) {
    accounts = JSON.parse(localStorage.getItem('accounts'))
    if (accounts.length == 0) {
        location.href = './index.html?page=signin'
    }
} else if (page !== 'signin' && page !=='callback' && !code) {
    location.href = './index.html?page=signin'
}
