# 송승후 포트폴리오 편집 안내

이 사이트는 **HTML과 CSS만 사용하는 정적 웹사이트**입니다. 화면은 왼쪽 작품 목록, 가운데 소개/캡션, 오른쪽 이미지/영상의 세 영역으로 구성되어 있습니다.

## 파일 구성

- `index.html`: 작품 제목, 연도·매체, 설명, 이미지 주소, 영상 주소
- `styles.css`: 레이아웃, 글꼴, 간격, 슬라이드와 팝업 스타일

작가 정보나 작품 설명을 바꾸려면 `index.html`에서 해당 제목을 검색하세요. 스타일을 바꾸려면 `styles.css`에서 같은 영역 이름을 찾으면 됩니다.

## 작품 캡션 편집

`index.html`에서 `캡션`이라고 검색하면 작품별 구역으로 이동합니다. 각 구역 위에는 번호와 작품 이름이 주석으로 표시되어 있습니다.

```html
<!-- 01 · 감각의 지도 캡션 -->
<section class="caption" data-project="map-of-senses" aria-label="감각의 지도 캡션">
  <h2>감각의 지도</h2>
  <p class="caption-meta">2025 · 종이에 잉크와 먹</p>
  <div class="project-description">
    <p>작품 설명의 첫 문단을 여기에 적습니다.</p>
    <p>새 문단은 p 태그를 하나 더 만들어 작성합니다.</p>
  </div>
</section>
```

- 제목은 `<h2>`, 연도와 매체는 `<p class="caption-meta">` 안에서 수정합니다.
- 본문은 `<div class="project-description">` 안에 적습니다. 문단을 나누려면 `<p>...</p>`를 추가합니다.
- 설명이 없는 작품은 `project-description` 블록이 없어도 됩니다.
- 작품을 선택하는 데 쓰이는 `data-project` 값은 작품의 다른 구역과 같게 유지하세요.

## 작품 이미지와 영상 편집

캡션과 같은 작품 이름이 붙은 `<!-- 작품 이름 이미지와 영상 -->` 주석을 찾으세요. 바로 아래의 `<section class="project-media" data-project="...">` 안에서 해당 작품의 이미지와 영상을 편집합니다.

- 영상 주소는 해당 구역의 `<iframe src="...">`에서 바꿉니다. iframe의 `referrerpolicy` 속성은 유지하세요.
- 이미지 주소는 `<img src="...">`에서 바꿉니다. Cloudinary 주소에는 `f_auto,q_auto` 옵션을 유지하고 `loading="lazy"`도 남겨두세요.
- 대표 이미지는 왼쪽 썸네일, 작가노트 슬라이드, 상세 이미지 그리드에서도 사용될 수 있습니다. 대표 이미지를 바꿀 때 같은 작품 이름의 이미지 주소도 확인하세요.
- 상세 이미지가 두 장 이상이면 `detail-gallery` 안에 이미지 항목을 추가합니다. 팝업 링크의 `href`와 해당 `image-lightbox`의 `id`는 서로 일치해야 합니다.

## 작품을 새로 추가할 때

작품 식별자는 번호 대신 제목을 알아볼 수 있는 짧은 영문 이름을 사용합니다. 예: `viewing-experience-1`.

1. `name="page"`인 화면 선택 입력에 `id="view-project-식별자"`를 추가합니다.
2. 왼쪽 작품 목록에 썸네일 `label`을 추가하고, `for` 값을 위의 입력 id와 연결합니다.
3. 가운데 캡션에 `data-project="식별자"`를 사용합니다.
4. 오른쪽 미디어 구역에도 같은 `data-project` 값을 사용합니다.
5. `styles.css`의 **CSS-only 화면 선택** 구역 맨 아래 선택 규칙에 새 입력 id와 두 `data-project` 구역을 추가합니다. 이 연결이 빠지면 작품을 선택해도 캡션과 미디어가 표시되지 않습니다.
6. 작가노트 슬라이드에 포함할 이미지가 있으면 `.home-slideshow` 안에 이미지를 추가하고, 슬라이드 설정에도 해당 이미지의 순서를 반영합니다.

목록 순서는 `.project-list-rows` 안의 라벨 순서로 바꿉니다. 작품 이미지를 넣지 않을 경우에도 왼쪽 목록용 썸네일은 연결할 수 있지만, 오른쪽에는 미디어 구역을 만들지 않아도 됩니다.

## 작가 정보와 아카이브 글

- 작가 이름, 학력, 소개, 연락처: `.embedded-info`
- 아카이브 제목 목록: `.archive-text-list`
- 아카이브 본문: `.archive-articles` 안의 `.archive-article`
- 작가노트 자동 슬라이드 이미지: `.home-slideshow`

아카이브 항목의 라벨 `for`, 화면 선택 입력 `id`, 본문 `data-entry` 번호가 서로 연결되어야 합니다.

## 화면 스타일 조절

CSS는 영역별 이름으로 나뉘어 있습니다. 기본 화면 비율과 간격은 `styles.css`의 `.project-layout`과 `:root` 변수에서 조절합니다. 작품 캡션 글꼴과 여백은 `.caption`, `.caption-meta`, `.project-description` 규칙에서 찾을 수 있습니다.

모바일에서는 왼쪽 작품 목록이 화면 가장자리에 스크롤 레일로 남고, 오른쪽에는 이미지/영상이 먼저, 캡션이 아래에 이어집니다. 목록과 페이지 본문은 각각 스크롤할 수 있습니다. 모바일 배치는 `@media (max-width: 760px)` 안의 `.project-layout`, `.project-list`, `.project-main`, `.project-info` 규칙에서 조절합니다.

JavaScript 없이 구성되어 작품 선택, 이미지 팝업, 자동 슬라이드를 HTML/CSS로 처리합니다. 따라서 영역 폭을 드래그해 바꾸거나 선택 상태를 저장하는 동작은 지원하지 않습니다.
