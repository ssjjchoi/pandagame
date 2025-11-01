# 🐼 판다 게임

한국 에버랜드의 판다 후이바오/루이바오를 주인공으로 한 HTML/CSS/JavaScript 게임입니다.
이 게임은 팬 게임이며, 공식 에버랜드와 관련이 없습니다.
This game is a fan-made game and is not affiliated with Everland.

## 🎮 게임 소개

판다가 대나무를 먹으며 점수를 획득하는 게임입니다. 장애물을 피하며 최대한 높은 점수를 달성해보세요!

## ✨ 게임 특징

- 🐼 **귀여운 판다 캐릭터**: 후이바오,루이바오와 전혀 다른 모습의 판다
- 🎯 **간단한 조작**: 방향키 또는 WASD로 움직임
- 📱 **모바일 지원**: 터치 조작 가능
- 🎵 **효과음**: Web Audio API를 사용한 실시간 사운드
- 🎨 **부드러운 애니메이션**: 움직임, 먹기, 충돌 효과
- 🔒 **화면 고정**: 게임 중 화면 스크롤 방지

## 🎯 게임 방법

1. **게임 시작** 버튼을 클릭하세요
2. **방향키** 또는 **WASD**로 판다를 움직이세요
3. 🎋 **대나무**를 먹어서 점수를 획득하세요 (10점씩)
4. ⚠️ **장애물**을 피하세요 (생명 감소)
5. 50점마다 **레벨업**하여 속도가 빨라집니다
6. 3번의 생명으로 최대한 높은 점수를 달성하세요!

## 🎮 조작법

### 데스크톱
- **방향키** 또는 **WASD**로 움직임
- **게임 시작/일시정지/다시 시작** 버튼 사용

### 모바일
- **터치 스와이프**로 움직임
- 화면을 터치하여 방향 조작

## 🛠️ 기술 스택

- **HTML5**: 게임 구조 및 마크업
- **CSS3**: 스타일링 및 애니메이션
- **JavaScript (ES6+)**: 게임 로직 및 상호작용
- **Web Audio API**: 실시간 효과음 생성

## 🚀 실행 방법

1. 저장소를 클론하세요:
```bash
git clone https://github.com/[사용자명]/pandagame.git
cd pandagame
```

2. `index.html` 파일을 브라우저에서 열어주세요:
```bash
open index.html
```

또는 웹 서버를 사용하여 실행:
```bash
# Python 3
python -m http.server 8000

# Node.js (http-server 설치 필요)
npx http-server
```

## 📁 프로젝트 구조

```
pandagame/
├── index.html          # 메인 HTML 파일
├── style.css           # CSS 스타일시트
├── script.js           # JavaScript 게임 로직
├── README.md           # 프로젝트 설명서
└── .gitignore          # Git 무시 파일 목록
```

## 🎨 게임 스크린샷

게임을 실행하면 다음과 같은 화면을 볼 수 있습니다:
- 귀여운 판다 캐릭터
- 대나무와 장애물
- 점수, 생명, 레벨 표시
- 게임 컨트롤 버튼

## 🎵 사운드 효과

- **먹기**: 높은 톤의 짧은 소리
- **충돌**: 낮은 톤의 긴 소리
- **레벨업**: 기쁜 톤의 소리
- **게임오버**: 슬픈 톤의 긴 소리

## 🔧 개발 정보

- **개발자**: Cursor.ai
- **버전**: 1.0.0
- **라이선스**: MIT
- **언어**: 한국어

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🙏 감사의 말

- 에버랜드의 판다 가족 (후이바오, 루이바오, 푸바오, 러바오, 아이바오)
- 모든 판다 팬과 애호가들

---

**즐거운 게임 되세요! 🐼🎮**
