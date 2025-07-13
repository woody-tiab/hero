/**
 * 나만의 캐릭터 갤러리 - Google Apps Script 백엔드
 * 파일명: Code.gs
 */

// 구글 시트 설정
const SHEET_ID = '1eZmbqq1oGiafmz_1C0QaUYmjKjzMGWVXMRcdZqM6_4U';
const SHEET_NAME = '히어로';

/**
 * 웹 앱 진입점 - HTML 파일 반환
 */
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('나만의 캐릭터 갤러리')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * HTML에서 CSS/JS 파일 포함하기 위한 헬퍼 함수
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Google Sheets에서 캐릭터 데이터 가져오기
 * @return {Array} 캐릭터 배열
 */
function getCharacters() {
  try {
    // 스프레드시트 열기
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error(`시트 '${SHEET_NAME}'를 찾을 수 없습니다.`);
    }
    
    // 데이터 범위 가져오기 (헤더 포함)
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    if (values.length < 2) {
      return []; // 헤더만 있거나 데이터가 없는 경우
    }
    
    // 헤더 행 (첫 번째 행)
    const headers = values[0];
    
    // 헤더 인덱스 찾기 (확장된 필드 포함)
    const headerIndexes = {
      name: findHeaderIndex(headers, ['캐릭터 이름', '이름', 'name']),
      creator: findHeaderIndex(headers, ['제작자', 'creator']),
      introUrl: findHeaderIndex(headers, ['소개자료 URL', '소개자료', 'intro_url', 'introUrl']),
      photoUrl: findHeaderIndex(headers, ['사진 URL', '사진', 'photo_url', 'photoUrl']),
      chatbotUrl: findHeaderIndex(headers, ['챗봇 URL', '챗봇', 'chatbot_url', 'chatbotUrl']),
      videoUrl: findHeaderIndex(headers, ['소개영상 URL', '소개영상', 'video_url', 'videoUrl']),
      ability: findHeaderIndex(headers, ['능력', 'ability']),
      weapon: findHeaderIndex(headers, ['무기', 'weapon']),
      age: findHeaderIndex(headers, ['나이', 'age']),
      likes: findHeaderIndex(headers, ['좋아요 수', '좋아요', 'likes'])
    };
    
    // 필수 헤더 확인 (챗봇과 영상은 선택사항)
    const requiredFields = ['name', 'creator', 'introUrl', 'photoUrl', 'ability', 'weapon', 'age', 'likes'];
    for (const field of requiredFields) {
      if (headerIndexes[field] === -1) {
        throw new Error(`필수 필드 '${field}'에 해당하는 열을 찾을 수 없습니다.`);
      }
    }
    
    // 데이터 행들을 객체로 변환
    const characters = [];
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      
      // 빈 행 스킵
      if (!row[headerIndexes.name] || row[headerIndexes.name].toString().trim() === '') {
        continue;
      }
      
      const character = {
        name: row[headerIndexes.name]?.toString().trim() || '',
        creator: row[headerIndexes.creator]?.toString().trim() || '익명',
        introUrl: row[headerIndexes.introUrl]?.toString().trim() || '',
        photoUrl: row[headerIndexes.photoUrl]?.toString().trim() || '',
        chatbotUrl: headerIndexes.chatbotUrl !== -1 ? (row[headerIndexes.chatbotUrl]?.toString().trim() || '') : '',
        videoUrl: headerIndexes.videoUrl !== -1 ? (row[headerIndexes.videoUrl]?.toString().trim() || '') : '',
        ability: row[headerIndexes.ability]?.toString().trim() || '미지의 능력',
        weapon: row[headerIndexes.weapon]?.toString().trim() || '미지의 무기',
        age: parseInt(row[headerIndexes.age]) || 0,
        likes: parseInt(row[headerIndexes.likes]) || 0,
        rowIndex: i + 1 // 시트에서의 실제 행 번호 (1-based)
      };
      
      characters.push(character);
    }
    
    console.log(`${characters.length}개의 캐릭터를 로드했습니다.`);
    return characters;
    
  } catch (error) {
    console.error('캐릭터 데이터 로드 오류:', error);
    throw new Error(`데이터를 불러오는데 실패했습니다: ${error.message}`);
  }
}

/**
 * 헤더 배열에서 특정 이름들 중 하나와 일치하는 인덱스 찾기
 * @param {Array} headers - 헤더 배열
 * @param {Array} searchNames - 찾을 이름들
 * @return {number} 인덱스 (찾지 못하면 -1)
 */
function findHeaderIndex(headers, searchNames) {
  for (let i = 0; i < headers.length; i++) {
    const headerName = headers[i]?.toString().trim().toLowerCase();
    for (const searchName of searchNames) {
      if (headerName === searchName.toLowerCase()) {
        return i;
      }
    }
  }
  return -1;
}

/**
 * 특정 캐릭터의 좋아요 수 업데이트
 * @param {string} characterName - 캐릭터 이름
 * @return {number} 업데이트된 좋아요 수
 */
function updateLikes(characterName) {
  try {
    // 스프레드시트 열기
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error(`시트 '${SHEET_NAME}'를 찾을 수 없습니다.`);
    }
    
    // 데이터 범위 가져오기
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    if (values.length < 2) {
      throw new Error('데이터가 없습니다.');
    }
    
    // 헤더 행
    const headers = values[0];
    
    // 헤더 인덱스 찾기
    const nameIndex = findHeaderIndex(headers, ['캐릭터 이름', '이름', 'name']);
    const likesIndex = findHeaderIndex(headers, ['좋아요 수', '좋아요', 'likes']);
    
    if (nameIndex === -1 || likesIndex === -1) {
      throw new Error('필요한 열을 찾을 수 없습니다.');
    }
    
    // 해당 캐릭터 찾기
    let targetRowIndex = -1;
    for (let i = 1; i < values.length; i++) {
      if (values[i][nameIndex]?.toString().trim() === characterName.trim()) {
        targetRowIndex = i;
        break;
      }
    }
    
    if (targetRowIndex === -1) {
      throw new Error(`캐릭터 '${characterName}'를 찾을 수 없습니다.`);
    }
    
    // 현재 좋아요 수 가져오기
    const currentLikes = parseInt(values[targetRowIndex][likesIndex]) || 0;
    const newLikes = currentLikes + 1;
    
    // 좋아요 수 업데이트 (시트는 1-based 인덱스)
    const cellRange = sheet.getRange(targetRowIndex + 1, likesIndex + 1);
    cellRange.setValue(newLikes);
    
    console.log(`${characterName}의 좋아요 수를 ${currentLikes}에서 ${newLikes}로 업데이트했습니다.`);
    
    return newLikes;
    
  } catch (error) {
    console.error('좋아요 업데이트 오류:', error);
    throw new Error(`좋아요 업데이트에 실패했습니다: ${error.message}`);
  }
}

/**
 * 데이터 유효성 검사 및 초기 설정 확인
 * @return {Object} 검사 결과
 */
function validateSetup() {
  try {
    const characters = getCharacters();
    
    const result = {
      success: true,
      message: '설정이 올바릅니다.',
      characterCount: characters.length,
      characters: characters.map(char => ({
        name: char.name,
        hasIntroUrl: !!char.introUrl,
        hasPhotoUrl: !!char.photoUrl,
        hasChatbotUrl: !!char.chatbotUrl,
        hasVideoUrl: !!char.videoUrl,
        likes: char.likes
      }))
    };
    
    return result;
    
  } catch (error) {
    return {
      success: false,
      message: error.message,
      characterCount: 0,
      characters: []
    };
  }
}

/**
 * 테스트용 샘플 데이터 생성 (선택적)
 * 주의: 기존 데이터를 덮어쓸 수 있습니다.
 */
function createSampleData() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // 시트가 없으면 생성
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }
    
    // 확장된 헤더 설정
    const headers = ['캐릭터 이름', '제작자', '소개자료 URL', '사진 URL', '챗봇 URL', '소개영상 URL', '능력', '무기', '나이', '좋아요 수'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // 샘플 데이터
    const sampleData = [
      [
        '파이어 히어로',
        '김영수',
        'https://docs.google.com/presentation/d/1234567890/edit',
        'https://via.placeholder.com/200x200/f39c12/2c3e50?text=🔥',
        'https://chatgpt.com/g/g-example1',
        'https://www.youtube.com/watch?v=example1',
        '화염 조종',
        '불꽃 검',
        25,
        15
      ],
      [
        '아이스 히어로',
        '이민지',
        'https://docs.google.com/document/d/0987654321/edit',
        'https://via.placeholder.com/200x200/3498db/ecf0f1?text=❄️',
        '',
        'https://www.youtube.com/watch?v=example2',
        '얼음 마법',
        '얼음 창',
        23,
        8
      ],
      [
        '번개 히어로',
        '박준호',
        'https://docs.google.com/presentation/d/1122334455/edit',
        'https://via.placeholder.com/200x200/e74c3c/ecf0f1?text=⚡',
        'https://chatgpt.com/g/g-example3',
        '',
        '전기 조작',
        '번개 망치',
        27,
        22
      ]
    ];
    
    // 데이터 입력
    sheet.getRange(2, 1, sampleData.length, headers.length).setValues(sampleData);
    
    // 헤더 스타일링 (다크 갤럭시 테마)
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#f39c12');
    headerRange.setFontWeight('bold');
    headerRange.setFontColor('#2c3e50');
    
    console.log('샘플 데이터가 생성되었습니다.');
    return '샘플 데이터가 성공적으로 생성되었습니다.';
    
  } catch (error) {
    console.error('샘플 데이터 생성 오류:', error);
    throw new Error(`샘플 데이터 생성에 실패했습니다: ${error.message}`);
  }
}
