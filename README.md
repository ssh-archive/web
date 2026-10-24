# 송승후 작가 포트폴리오

설치가 필요 없는 정적 사이트입니다. 작품과 작가 정보는 `works.js`, 화면 동작은 `app.js`, 스타일은 `styles.css`에서 편집합니다.

## 실행

`index.html`을 Live Server 같은 로컬 웹 서버로 여세요. `file://`로 직접 열면 YouTube가 Referer를 받지 못해 영상 재생을 막을 수 있습니다.

## 작품 추가와 수정

`works.js` 위쪽의 `window.works` 배열에 있는 작품 객체를 복사해 추가하고, 표시 순서는 배열에서 바꿉니다. 상세 왼쪽 목록에는 앞에서부터 15개가 표시됩니다. 아카이브 글은 같은 파일 아래쪽의 `window.archiveTexts` 배열에서 관리합니다.

주로 편집할 항목:

| 항목 | 설명 |
| --- | --- |
| `slug` | 작품별 고유 주소. 예: `work-16` |
| `title`, `year` | 작품 제목과 연도 |
| `archiveMaterial` | 작품 데이터의 매체 정보 |
| `format` | 상세 캡션의 매체·형식 |
| `description` | 상세 설명. 문단은 `\n\n`으로 나눕니다. |
| `medium` | 이미지 작업은 `image`, 영상 작업은 `video` |
| `homeImage` | 목록 썸네일이자 상세 대표 이미지 |
| `gallery` | 대표 이미지 다음에 표시할 상세 이미지 경로 배열 |
| `video` | 영상의 YouTube `/embed/영상ID` 주소 |
| `sections` | 작품별 글·자료 목록. 필요할 때만 추가합니다. |

예시:

```js
{
  slug: "work-16",
  title: "새 작업",
  year: "2026",
  archiveMaterial: "디지털 프린트",
  format: "디지털 프린트",
  description: "작품 설명을 입력합니다.",
  medium: "image",
  homeImage: "assets/work-16-new-work/work-16-new-work.jpg",
  gallery: [
    "assets/work-16-new-work/detail-01.jpg",
    "assets/work-16-new-work/detail-02.jpg"
  ]
}
```

작품 목록은 `app.js`의 `DETAIL_LIST_LIMIT` 값으로 조절합니다. 새 작품을 왼쪽 목록에도 표시하려면 이 값을 늘리거나 작품을 앞에서 15개 안에 배치하세요. 목록에는 이미지 아래 작품명, 연도, 매체가 작은 글씨로 표시됩니다. 왼쪽 목록, 캡션, 이미지 영역의 기본 너비 비율은 `DEFAULT_DETAIL_RATIO`에서 바꿉니다. 화면에서 경계를 드래그해 너비를 조절할 수도 있습니다.

## 이미지와 영상

이미지는 웹사이트 폴더에 복사하지 않습니다. `works.js`에는 기존처럼 경로와 파일명을 적으면 `app.js`가 파일명만 사용해 Cloudinary 주소를 만듭니다. Cloudinary에 올린 Public ID와 파일명이 정확히 일치해야 합니다. 자동 변환 주소에는 `f_auto,q_auto`가 포함되고, 이미지 태그는 `loading="lazy"`로 로드됩니다.

`homeImage`는 대표 이미지 한 장이고, `gallery`에는 추가 이미지만 넣습니다. 대표 이미지와 추가 이미지가 두 장 이상일 때 오른쪽에 5열 그리드가 나타납니다. 이미지를 누르면 팝업에서 좌우 이동할 수 있습니다. 감각의 지도와 나는 시시하게 보고 지나쳤다의 회전 표시는 `app.js`의 `rotateGalleryImage`에서 관리합니다.

영상은 아래처럼 YouTube embed 주소를 넣습니다. iframe에는 `referrerpolicy="strict-origin-when-cross-origin"`이 이미 설정되어 있습니다.

```js
medium: "video",
video: "https://www.youtube.com/embed/영상ID",
homeImage: "assets/work-16-new-work/cover.jpg"
```

작품별 캡션 위에 선택 항목을 만들려면 `sections`를 추가합니다. 각 항목에는 `title`, `text`, `images`를 넣을 수 있습니다.

```js
sections: [
  { title: "자료 제목", text: "자료 글", images: ["assets/work-16-new-work/note.jpg"] }
]
```

작가 이름과 소개, 연락처, 유튜브 주소는 `works.js` 아래쪽 `window.artistInfo`에서 수정합니다. Info를 누르면 작가 정보가 가운데 영역에 표시되고, 오른쪽에는 현재 선택된 작업 이미지가 유지됩니다.

Archive는 가운데 영역에 글 제목만 보여줍니다. 제목을 선택하면 오른쪽 작업 영역에 날짜와 본문이 표시됩니다. 글을 추가하거나 고치려면 `window.archiveTexts`에 `{ title, date, text }` 항목을 추가하세요. `text` 안의 빈 줄은 문단 구분으로 사용됩니다. 현재 예시 글은 `자연을 바라볼때면`입니다.

## 파일 안내

- `index.html`: 페이지 뼈대와 CSS·JavaScript 연결
- `works.js`: 작품 데이터와 작가 정보
- `app.js`: 3영역 레이아웃, 작품·글 화면, Cloudinary 주소 변환, 이미지 팝업
- `styles.css`: 레이아웃과 디자인
