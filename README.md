# 영상 기반 포트폴리오 사이트

이 프로젝트는 RTF 파일의 디자인을 기반으로 한 영상 기반 포트폴리오 웹사이트입니다. 각 프로젝트는 유튜브 비디오로 표시되며, 클릭하면 확장되어 비디오와 상세 정보를 보여줍니다.

## 주요 기능

- **3D Star Wars 효과**: 프로젝트를 클릭하면 다른 프로젝트들이 3D 공간에서 회전하며 멀어집니다
- **부드러운 애니메이션**: GSAP를 사용한 고품질 애니메이션
- **반응형 디자인**: 모바일과 데스크톱에서 모두 최적화
- **호버 효과**: 제목에 마우스를 올리면 양쪽에 인디케이터가 나타납니다
- **유튜브 임베드**: 각 프로젝트에 유튜브 비디오가 임베드됩니다

## 파일 구조

```
portfolio/
├── start.html          # 시작 페이지 (타이틀 이미지)
├── start-styles.css    # 시작 페이지 CSS
├── start-script.js     # 시작 페이지 JavaScript
├── index.html          # 메인 포트폴리오 HTML 파일
├── styles.css          # 포트폴리오 CSS 스타일시트
├── script.js           # 포트폴리오 JavaScript 애니메이션
├── README.md           # 프로젝트 설명서
└── WebSite.rtf         # 원본 디자인 파일
```

## 사용법

### 1. 로컬에서 실행

```bash
# 프로젝트 폴더로 이동
cd portfolio

# 로컬 서버 실행 (Python 3)
python -m http.server 8000

# 또는 Node.js http-server 사용
npx http-server
```

브라우저에서 `http://localhost:8000/start.html`로 접속하세요.

### 2. 타이틀 이미지 설정

시작 페이지의 타이틀 이미지를 설정하려면 `start.html` 파일을 편집하세요:

```html
<!-- 실제 타이틀 이미지를 사용하려면 아래 주석을 해제하고 이미지 경로를 설정하세요 -->
<img src="path/to/your/title-image.jpg" alt="Portfolio Title">

<!-- 임시 플레이스홀더는 주석 처리하세요 -->
<!-- <div class="image-placeholder">
    <div class="placeholder-text">TITLE IMAGE</div>
</div> -->
```

이미지 권장 크기: 400x300px (반응형으로 자동 조정됨)

### 3. 유튜브 비디오 변경

각 프로젝트의 유튜브 비디오를 변경하려면 `index.html` 파일에서 iframe의 `src` 속성을 수정하세요:

```html
<!-- 현재 예시 -->
<iframe 
    src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
    title="Essential light video"
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
</iframe>

<!-- 변경하려면 dQw4w9WgXcQ 부분을 원하는 유튜브 비디오 ID로 교체 -->
<iframe 
    src="https://www.youtube.com/embed/YOUR_VIDEO_ID" 
    title="Your video title"
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
</iframe>
```

### 4. 프로젝트 정보 수정

각 프로젝트의 제목과 설명을 수정하려면 `index.html`에서 해당 부분을 편집하세요:

```html
<h2 class="project-title">YOUR PROJECT TITLE</h2>
<div class="project-details left">
    <p class="detail-label">YOUR DESCRIPTION 1</p>
    <p class="detail-label">YOUR DESCRIPTION 2</p>
    <p class="detail-label">YOUR DESCRIPTION 3</p>
</div>
<div class="project-details right">
    <p class="detail-label">YOUR DESCRIPTION 4</p>
    <p class="detail-label">YOUR DESCRIPTION 5</p>
    <p class="detail-label">YOUR DESCRIPTION 6</p>
    <p class="detail-year">/2024</p>
</div>
```

## 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: 모던 스타일링과 반응형 디자인
- **JavaScript (ES6+)**: 인터랙티브 기능
- **GSAP**: 고성능 애니메이션 라이브러리
- **PP Neue Montreal**: 타이포그래피

## 브라우저 지원

- Chrome (권장)
- Firefox
- Safari
- Edge

## 커스터마이징

### 색상 변경

`styles.css`에서 색상을 변경할 수 있습니다:

```css
body {
    background-color: #f5f3ee; /* 배경색 */
    color: #000; /* 텍스트 색상 */
}

.hover-indicator {
    background-color: #000; /* 호버 인디케이터 색상 */
}
```

### 애니메이션 속도 조정

`script.js`에서 애니메이션 지속 시간을 조정할 수 있습니다:

```javascript
// 프로젝트 확장 애니메이션
duration: 0.4, // 0.4초

// 텍스트 나타남 애니메이션
duration: 0.45, // 0.45초
```

## 라이선스

이 프로젝트는 개인 및 상업적 용도로 자유롭게 사용할 수 있습니다.

## 문의

프로젝트에 대한 질문이나 개선 사항이 있으시면 언제든지 연락주세요. 