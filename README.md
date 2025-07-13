# 나만의 캐릭터 갤러리

GitHub Pages로 호스팅되는 학생 캐릭터 갤러리입니다. Google Sheets와 연동하여 데이터를 관리합니다.

## 🚀 실행 방법

### 1. Google Sheets 설정
1. [Google Sheets](https://sheets.google.com)에서 새 시트 생성
2. 시트 이름을 '히어로'로 변경
3. 첫 번째 행에 다음 헤더 입력:
캐릭터 이름,제작자,소개자료 URL,사진 URL,챗봇 URL,소개영상 URL,능력,무기,나이,좋아요 수
4. 시트를 **"링크가 있는 모든 사용자"**로 공유 설정
5. Google Sheets URL에서 시트 ID 복사 (예: `1eZmbqq1oGiafmz_1C0QaUYmjKjzMGWVXMRcdZqM6_4U`)

### 2. GitHub 설정
1. GitHub에서 새 저장소 생성 (저장소명: `character-gallery`)
2. 이 파일들을 저장소에 업로드:
- `index.html`
- `config.js`
- `README.md`
3. `config.js`에서 `SHEET_ID`를 본인의 Google Sheets ID로 변경
4. Settings > Pages에서 GitHub Pages 활성화

### 3. 데이터 입력
Google Sheets에 캐릭터 정보를 입력하면 자동으로 웹사이트에 반영됩니다.

#### 필수 필드:
- 캐릭터 이름
- 제작자
- 소개자료 URL
- 사진 URL
- 능력
- 무기
- 나이
- 좋아요 수

#### 선택 필드:
- 챗봇 URL (비어있으면 버튼 안 보임)
- 소개영상 URL (비어있으면 버튼 안 보임)

## 🎨 주요 기능

- ✅ **실시간 Google Sheets 연동**: 시트 수정 시 즉시 반영
- ✅ **반응형 디자인**: 모바일/태블릿/PC 모든 기기 지원
- ✅ **다크 갤럭시 테마**: 멋진 우주 테마 디자인
- ✅ **이미지 모달**: PC에서 이미지 클릭 시 큰 화면으로 보기
- ✅ **랜덤 배치**: 페이지 로드 시마다 캐릭터 순서 랜덤
- ✅ **선택적 버튼**: 챗봇/영상 URL이 없으면 해당 버튼 숨김
- ✅ **무제한 트래픽**: GitHub Pages의 무료 무제한 호스팅

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Hosting**: GitHub Pages (무료)
- **Database**: Google Sheets (무료)
- **CDN**: GitHub Pages CDN (전세계 빠른 속도)

## 📱 화면 미리보기

### PC 화면
- 3-4열 그리드 레이아웃
- 호버 효과와 애니메이션
- 이미지 클릭 시 모달 팝업

### 모바일 화면
- 1열 레이아웃
- 터치 친화적 버튼 크기
- 스와이프 최적화

## 🔧 커스터마이징

### 디자인 변경
`index.html`의 CSS 섹션에서 색상, 폰트, 레이아웃을 수정할 수 있습니다.

### 사이트 정보 변경
`config.js`의 `SITE_CONFIG` 객체에서 제목, 부제목, 제작자 정보를 변경할 수 있습니다.

### Google Sheets 구조 변경
시트의 열 순서나 이름을 변경하려면 `index.html`의 데이터 파싱 부분을 수정해야 합니다.

## 🚨 주의사항

1. **Google Sheets 공유 설정**: 시트가 "링크가 있는 모든 사용자"로 설정되어야 합니다.
2. **이미지 URL**: 공개적으로 접근 가능한 이미지 URL을 사용해야 합니다.
3. **CSV 형식**: 데이터에 쉼표(,)가 들어가면 파싱에 문제가 생길 수 있습니다.
4. **캐시**: 브라우저 캐시로 인해 변경사항이 즉시 반영되지 않을 수 있습니다.

## 📞 지원

문제가 발생하면 GitHub Issues에 등록해주세요.
