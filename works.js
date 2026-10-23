/*
  작품 정보를 이 파일에서 수정하세요.
  - poster: 격자와 상세 페이지에 보일 대표 이미지 경로 (예: "assets/work-01.jpg")
  - homeImage: 홈페이지에만 보일 이미지 경로. 영상 작품의 대표 이미지에 사용합니다.
  - video: YouTube/Vimeo 주소 또는 mp4 파일 경로. 비워두면 기본 영상 플레이어가 표시됩니다.
  - materials: 본문에 추가할 이미지 경로 배열
*/
window.works = [
  {
    slug: "work-01",
    title: "감각의 지도",
    year: "2024",
    archiveMaterial: "종이에 잉크, 비디오", size: "16:9 · 1920 × 1080 px", timeline: "00:08:20",
    format: "종이에 잉크, 비디오",
    role: "기획 · 촬영 · 편집",
    description: "이곳에 작업에 관한 글을 적어주세요. 짧은 소개부터 제작 배경, 작업 노트까지 자유롭게 구성할 수 있습니다.",
    poster: "",
    homeImage: "assets/work-01-map-of-senses.png",
    video: "",
    materials: [],
    medium: "video",
    artwork: "artwork-one"
  },
  {
    slug: "work-02",
    title: "뻘짓",
    year: "2024",
    archiveMaterial: "비디오", size: "Variable · 8 prints", timeline: "Series · 8 images",
    format: "비디오",
    role: "기획 · 촬영 · 편집",
    description: "작품별로 글과 자료를 다르게 구성해보세요. 텍스트가 길어져도 영상과 사진 사이에서 자연스럽게 읽히도록 배치됩니다.",
    poster: "",
    homeImage: "assets/work-02-beoljit.png",
    video: "",
    materials: [],
    medium: "video",
    artwork: "artwork-two"
  },
  {
    slug: "work-03",
    title: "디지털 환등상",
    year: "2025",
    archiveMaterial: "비디오", size: "A4 · 12 pages", timeline: "12 pages",
    format: "비디오",
    role: "기획 · 편집",
    description: "이 영역에 작업 설명을 입력하세요. 필요하지 않은 정보 항목은 works.js에서 지우거나 비워둘 수 있습니다.",
    poster: "",
    homeImage: "assets/work-03-digital-lantern.jpeg",
    video: "",
    materials: [],
    medium: "video",
    artwork: "artwork-three"
  },
  {
    slug: "work-04",
    title: "보기 경험 1",
    year: "2025",
    archiveMaterial: "비디오", size: "16:9 · 1920 × 1080 px", timeline: "00:08:20",
    format: "비디오",
    role: "연출 · 촬영",
    description: "글, 이미지, 외부 자료를 영상 아래에 이어서 배치할 수 있습니다. 각 항목은 이 작품 데이터에만 추가됩니다.",
    poster: "",
    homeImage: "assets/work-04-viewing-experience-1.jpg",
    video: "",
    materials: [],
    medium: "video",
    artwork: "artwork-four"
  },
  {
    slug: "work-05",
    title: "보기 경험 2",
    year: "2025",
    archiveMaterial: "비디오", size: "Variable · 8 prints", timeline: "Series · 8 images",
    format: "비디오",
    role: "기획 · 촬영",
    description: "작품별 정보를 이곳에 적어주세요.",
    poster: "",
    homeImage: "assets/work-05-viewing-experience-2.jpg",
    video: "",
    materials: [],
    medium: "video",
    artwork: "artwork-five"
  },
  {
    slug: "work-06", title: "미궁", year: "2025",
    archiveMaterial: "비디오", size: "16:9 · 1920 × 1080 px", timeline: "00:08:20", format: "비디오", role: "기획 · 촬영 · 편집",
    description: "작품 설명을 입력해 주세요.", poster: "", homeImage: "assets/work-06-maze.jpg", video: "", materials: [], medium: "video", artwork: "artwork-one"
  },
  {
    slug: "work-07", title: "도시가 보이는 바다", year: "2025",
    archiveMaterial: "비디오", size: "Variable · 8 prints", timeline: "Series · 8 images", format: "비디오", role: "기획 · 촬영",
    description: "작품 설명을 입력해 주세요.", poster: "", video: "", materials: [], medium: "video", artwork: "artwork-two"
  },
  {
    slug: "work-08", title: "인간 . 자연", year: "2025",
    archiveMaterial: "비디오", size: "A4 · 12 pages", timeline: "12 pages", format: "비디오", role: "글",
    description: "작품 설명을 입력해 주세요.", poster: "", homeImage: "assets/work-08-human-nature.png", video: "", materials: [], medium: "video", artwork: "artwork-three"
  },
  {
    slug: "work-09", title: "Bugbuster Heatrunner", year: "2025",
    archiveMaterial: "비디오", size: "16:9 · 1920 × 1080 px", timeline: "00:08:20", format: "비디오", role: "연출 · 편집",
    description: "작품 설명을 입력해 주세요.", poster: "", homeImage: "assets/work-09-bugbuster-heat-runner.png", video: "", materials: [], medium: "video", artwork: "artwork-four"
  },
  {
    slug: "work-10", title: "인간들의 왕국", year: "2025",
    archiveMaterial: "비디오", size: "Variable · 8 prints", timeline: "Series · 8 images", format: "비디오", role: "기획 · 촬영",
    description: "작품 설명을 입력해 주세요.", poster: "", homeImage: "assets/work-10-human-kingdom.png", video: "", materials: [], medium: "video", artwork: "artwork-five"
  },
  {
    slug: "work-11", title: "태양은 밤에도 빛난다", year: "2025",
    archiveMaterial: "비디오", size: "A4 · 12 pages", timeline: "12 pages", format: "비디오", role: "글",
    description: "작품 설명을 입력해 주세요.", poster: "", homeImage: "assets/work-11-sunlight-at-night.jpeg", video: "", materials: [], medium: "video", artwork: "artwork-one"
  },
  {
    slug: "work-12", title: "보기 경험 3", year: "2026",
    archiveMaterial: "비디오", size: "16:9 · 1920 × 1080 px", timeline: "00:08:20", format: "비디오", role: "기획 · 촬영 · 편집",
    description: "작품 설명을 입력해 주세요.", poster: "", homeImage: "assets/work-12-viewing-experience-3.jpg", video: "", materials: [], medium: "video", artwork: "artwork-two"
  },
  {
    slug: "work-13", title: "디지털 산책자", year: "2024",
    archiveMaterial: "디지털 프린트", size: "Variable · 8 prints", timeline: "Series · 8 images", format: "디지털 프린트", role: "기획 · 촬영",
    description: "작품 설명을 입력해 주세요.", poster: "assets/work-13-digital-walker.jpg", homeImage: "assets/work-13-digital-walker.jpg", video: "", materials: [], medium: "image", artwork: "artwork-three"
  },
  {
    slug: "work-14", title: "아우라 프로젝트", year: "2024",
    archiveMaterial: "디지털 프린트, 책", size: "A4 · 12 pages", timeline: "12 pages", format: "디지털 프린트, 책", role: "글",
    description: "작품 설명을 입력해 주세요.", poster: "assets/work-14-aura-project.jpg", homeImage: "assets/work-14-aura-project.jpg", video: "", materials: [], medium: "image", artwork: "artwork-four"
  },
  {
    slug: "work-15", title: "나는 시시하게 보고 지나쳤다", year: "2026",
    archiveMaterial: "디지털 프린트, 책", size: "16:9 · 1920 × 1080 px", timeline: "00:08:20", format: "디지털 프린트, 책", role: "연출 · 편집",
    description: "작품 설명을 입력해 주세요.", poster: "assets/work-15-trivial-glance.jpeg", homeImage: "assets/work-15-trivial-glance.jpeg", video: "", materials: [], medium: "image", artwork: "artwork-five"
  },
  {
    slug: "work-16", title: "작업 16", year: "2010",
    archiveMaterial: "Inkjet print · photographic series", size: "Variable · 8 prints", timeline: "Series · 8 images", format: "Photographic series", role: "기획 · 촬영",
    description: "작품 설명을 입력해 주세요.", poster: "", video: "", materials: [], medium: "image", artwork: "artwork-one"
  },
  {
    slug: "work-17", title: "작업 17", year: "2009",
    archiveMaterial: "Printed text · Korean", size: "A4 · 12 pages", timeline: "12 pages", format: "Text", role: "글",
    description: "작품 설명을 입력해 주세요.", poster: "", video: "", materials: [], medium: "text", artwork: "artwork-two"
  },
  {
    slug: "work-18", title: "작업 18", year: "2008",
    archiveMaterial: "Digital video · color · sound", size: "16:9 · 1920 × 1080 px", timeline: "00:08:20", format: "Video", role: "기획 · 촬영 · 편집",
    description: "작품 설명을 입력해 주세요.", poster: "", video: "", materials: [], medium: "video", artwork: "artwork-three"
  },
  {
    slug: "work-19", title: "작업 19", year: "2007",
    archiveMaterial: "Inkjet print · photographic series", size: "Variable · 8 prints", timeline: "Series · 8 images", format: "Photographic series", role: "기획 · 촬영",
    description: "작품 설명을 입력해 주세요.", poster: "", video: "", materials: [], medium: "image", artwork: "artwork-four"
  },
  {
    slug: "work-20", title: "작업 20", year: "2006",
    archiveMaterial: "Printed text · Korean", size: "A4 · 12 pages", timeline: "12 pages", format: "Text", role: "글",
    description: "작품 설명을 입력해 주세요.", poster: "", video: "", materials: [], medium: "text", artwork: "artwork-five"
  },
  {
    slug: "work-21", title: "작업 21", year: "2005",
    archiveMaterial: "Digital video · color · sound", size: "16:9 · 1920 × 1080 px", timeline: "00:08:20", format: "Video", role: "기획 · 촬영 · 편집",
    description: "작품 설명을 입력해 주세요.", poster: "", video: "", materials: [], medium: "video", artwork: "artwork-one"
  },
  {
    slug: "work-22", title: "작업 22", year: "2004",
    archiveMaterial: "Inkjet print · photographic series", size: "Variable · 8 prints", timeline: "Series · 8 images", format: "Photographic series", role: "기획 · 촬영",
    description: "작품 설명을 입력해 주세요.", poster: "", video: "", materials: [], medium: "image", artwork: "artwork-two"
  },
  {
    slug: "work-23", title: "작업 23", year: "2003",
    archiveMaterial: "Printed text · Korean", size: "A4 · 12 pages", timeline: "12 pages", format: "Text", role: "글",
    description: "작품 설명을 입력해 주세요.", poster: "", video: "", materials: [], medium: "text", artwork: "artwork-three"
  },
  {
    slug: "work-24", title: "작업 24", year: "2002",
    archiveMaterial: "Digital video · color · sound", size: "16:9 · 1920 × 1080 px", timeline: "00:08:20", format: "Video", role: "연출 · 편집",
    description: "작품 설명을 입력해 주세요.", poster: "", video: "", materials: [], medium: "video", artwork: "artwork-four"
  },
  {
    slug: "work-25", title: "작업 25", year: "2001",
    archiveMaterial: "Inkjet print · photographic series", size: "Variable · 8 prints", timeline: "Series · 8 images", format: "Photographic series", role: "기획 · 촬영",
    description: "작품 설명을 입력해 주세요.", poster: "", video: "", materials: [], medium: "image", artwork: "artwork-five"
  }
];

window.artistInfo = {
  name: "Song Seunghu",
  introduction: "영상과 글, 사진을 중심으로 작업합니다. 이곳에 작가 소개와 작업 관심사를 적어주세요.",
  email: "hello@example.com",
  instagram: ""
};
