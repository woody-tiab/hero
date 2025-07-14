// Google Sheets 설정
const SHEET_ID = '1WDlNHl4JbT2b6qjI5p9p9drheY4vEBtCVkZ6MLJo8oc';

// CSV 내보내기 URL (읽기용)
const GOOGLE_SHEETS_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

// Google Apps Script Web App URL (좋아요 API용)
// ⚠️ 이 URL을 Apps Script 배포 후 실제 URL로 변경해야 합니다!
const APPS_SCRIPT_API_URL = 'https://script.google.com/macros/s/AKfycbxYaX0hojdw_lwf1eWv0P4QcwQDV9wjj77RuuYPl6pyOad2NdPMF8RLGQTYnU4lTZAu/exec';

// 웹사이트 설정
const SITE_CONFIG = {
    title: '나만의 캐릭터 갤러리',
    subtitle: '학생들이 만든 멋진 히어로 캐릭터들을 만나보세요!',
    creator: '훈민초등학교 4학년 5반'
};
