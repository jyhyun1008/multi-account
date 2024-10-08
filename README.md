# APAP:Auto Post-classifier for ActivityPub

[APAP:Auto Post-classifier for ActivityPub](https://apap.peacht.art/) 가 대강 완성되었습니다. 
타이틀이 시사하는 바와 같이, 액티비티펍 소프트웨어 중 일부에서 자동으로 게시물을 분류해 주는 기능을 수행합니다.

# 주요 기능

## 목표

* 서로 다른 테마의 계정을 여러 개 굴리시는 분들에게 계정 스위칭이 보다 편리하면서도, 계정 실수를 조금이나마 줄일 수 있게끔 제작되었습니다.

## 계정 추가

* 미스키, 마스토돈 및 그 포크 소프트웨어 인스턴스 계정을 여러 개 추가할 수 있습니다.
* 글리치의 경우 마크다운이 활성화되어 있으며, 미스키의 경우 mfm을 사용할 수 있습니다.
* 양쪽 모두 CW를 사용한 포스팅이 가능합니다.

## 분류 모드 

* 수동 분류 모드와 자동 분류 모드가 있습니다.
* 수동 분류 모드의 경우, 드롭다운 메뉴에서 게시할 계정을 고를 수 있습니다.
* 자동 분류 모드의 경우, 게시물의 텍스트를 입력고 분류 버튼을 누르면, GPT 4.0 mini 를 이용한 게시물 분류가 진행됩니다. 
  * 이전 데이터에 의해 자동으로 게시물을 분류해 줍니다.
  * 분류가 잘못되었을 경우 수정하여 게시할 수 있습니다.
* 분류된 데이터는 저장됩니다.
* 각 계정의 게시물 비율을 일정하게 유지할 필요 없습니다. 각 계정별 데이터셋의 길이는 10개 미만을 유지합니다.

## 예의바른 글쓰기

* GPT-변환 버튼을 통해 글을 조금 더 유려하고 예의바르게 수정할 수 있습니다.

### 이 기능에 대한 변명

* 지난 봄에 정신과에 내원했을 때, SNS상에서 너무 날선 얘기를 하게 된다는 저의 고백을 들은 정신과 의사선생님의 추천에 의해 추가한 기능이었습니다.
* 기능을 구현하라는 얘기가 아니고, 평소 게시물을 작성할 때 GPT로 한번 필터링을 해보라는 얘기였어요.
* 지금은 그 기능이 필요하지 않을 정도로 많이 좋아졌지만, 정신적으로 정말 여유가 없을 때는 해당 모드를 켤 계획입니다.
* APAP를 통해 변환하지 않더라도 상황이 악화되면 GPT를 사용한 포스팅을 할 가능성이 높아요.

# 주의사항

* 텍스트만 있는 게시물만 지원합니다. 이미지나 멘션 등을 읽어와 자동 분류할 경우 여러모로 곤란한 오류가 발생할 수 있기 때문입니다.
* 각 계정의 테마는 명확하게 다른 것이 좋습니다.
* 수동 분류 모드에서 최대한 모든 계정을 한 번씩이라도 사용한 후에 자동 분류 모드로 진입해주세요.
* 자동 분류 모드와 GPT-변환 모드는 OpenAI의 토큰 추가가 필요합니다. 토큰이 없는 경우 수동 분류 모드만 이용하시면 됩니다.
* 일단 쓰기 시작하시면, **해당 기기의 해당 브라우저에만 데이터가 저장됩니다.** 모바일 사용은 피해주세요.
* 브라우저의 localStorage를 초기화 하시는 경우, 모든 데이터셋이 날아갑니다.