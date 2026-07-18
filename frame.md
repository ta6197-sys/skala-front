# 외부 라이브러리를 사용하지는 말아야함 


# 해야 할 것
- index.html(메인 화면) - 완료
- myProfile.html(내소개)
- myClass.html(내 강의 일정)
- signUp.html(회원가입)
- signUpResult.html(회원가입결과)
- myTrip.html(내 여행지)




# 큰 틀 (진행 순서)

## 1. 폴더 구조 먼저 잡기
```
skala-front/
  index.html
  myProfile.html
  myClass.html
  signUp.html
  signUpResult.html
  myTrip.html
  css/
    style.css        # 전체 공통 스타일
  images/             # 프로필 사진, 여행지 사진 등
```

## 2. 공통 레이아웃(네비게이션) 먼저 설계
- HTML만으로는 헤더/푸터를 파일 하나로 공유할 수 없으므로, 모든 페이지 상단에 동일한 `<nav>` 메뉴(6개 페이지로 가는 링크)를 붙여넣는 방식으로 시작.
- index.html에 이 네비게이션을 가장 먼저 추가해서 틀을 확정한 뒤, 나머지 페이지에 복사해서 재사용.

## 3. 페이지 제작 순서 (난이도/태그 연습 순으로 추천)
1. **index.html** - 완료. 네비게이션 추가만 남음.
2. **myProfile.html** - 정적 소개 페이지. 이미지 태그, 텍스트 배치 연습.
3. **myClass.html** - 강의 일정. `<table>` 태그 연습.
4. **signUp.html** - 회원가입. `<form>`, `<input>`, `<label>` 태그 연습.
5. **signUpResult.html** - 가입 결과 표시. signUp.html에서 입력한 값을 보여주는 정적/연동 페이지.
6. **myTrip.html** - 여행지 소개. 이미지+텍스트 카드형 레이아웃, 지금까지 배운 태그 종합.

## 4. 페이지별 체크리스트
- [ ] `<title>` 페이지 내용에 맞게 설정
- [ ] 공통 네비게이션으로 다른 페이지 이동 가능
- [ ] `header`, `nav`, `main`, `footer` 등 시맨틱 태그 사용
- [ ] css/style.css 연결 (`<link rel="stylesheet">`)
- [ ] 브라우저로 직접 열어서 링크 이동, 레이아웃 확인

