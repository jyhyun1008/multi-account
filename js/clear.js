if (page == 'clear') {
    var conf = confirm('정말 계정 목록을 초기화하시겠습니까? 로그인하셨던 계정 목록 및 데이터셋이 영구 삭제됩니다.')
    if (conf) {
        localStorage.removeItem('accounts')
        localStorage.removeItem('csv')
        location.href="./index.html"
    } else {
        location.href="./index.html"
    }
}