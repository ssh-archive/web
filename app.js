const app = document.querySelector("#app");
const DETAIL_LIST_LIMIT = 15;
const DETAIL_LAYOUT_KEY = "artist-portfolio-detail-layout-v9";
const PROJECT_LIST_SCROLL_KEY = "artist-portfolio-project-list-scroll";
const CLOUDINARY_IMAGE_BASE = "https://res.cloudinary.com/iguwxlji/image/upload/f_auto,q_auto";
const defaultDetailLayout = () => {
  return { list: (window.innerWidth <= 760 ? 64 : 100) / window.innerWidth };
};
const listedWorks = works.slice(0, DETAIL_LIST_LIMIT);
let detailResizeHandler = null;
let homeSlideTimer = null;
let activeWorkSlug = works[0]?.slug || "";

function clearDetailResizeHandler() {
  if (detailResizeHandler) window.removeEventListener("resize", detailResizeHandler);
  detailResizeHandler = null;
  if (homeSlideTimer) window.clearInterval(homeSlideTimer);
  homeSlideTimer = null;
}

const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));

function optimizedImageURL(src = "", rotate = false) {
  if (!src) return "";
  const value = String(src);
  if (value.includes("res.cloudinary.com/") && value.includes("/image/upload/")) {
    if (value.includes("/image/upload/f_auto,q_auto")) {
      return rotate && !value.includes("a_90") ? value.replace("/image/upload/f_auto,q_auto", "/image/upload/f_auto,q_auto,a_90") : value;
    }
    return value.replace("/image/upload/", `/image/upload/f_auto,q_auto${rotate ? ",a_90" : ""}/`);
  }
  if (!/^https?:\/\//i.test(value)) {
    const filename = value.split(/[?#]/, 1)[0].split("/").pop();
    return filename ? `${CLOUDINARY_IMAGE_BASE}${rotate ? ",a_90" : ""}/${filename}` : "";
  }
  return value;
}

function imageMarkup(image, rotate = false) {
  return `<img class="work-image" src="${escapeHTML(optimizedImageURL(image, rotate))}" alt="" aria-hidden="true" loading="lazy" />`;
}

function videoEmbed(url, work) {
  return `<iframe class="video-frame" src="${escapeHTML(url)}" title="${escapeHTML(work.title)} 영상" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
}

function projectMedia(work) {
  return `<div class="still-stage">${work.homeImage ? imageMarkup(work.homeImage, work.slug === "work-01") : ""}</div>`;
}

function renderWorkDetail(slug) {
  clearDetailResizeHandler();
  const work = works.find((item) => item.slug === slug);
  if (!work) return renderNotFound();
  activeWorkSlug = work.slug;
  document.body.classList.add("detail-open");
  document.title = `${work.title} — ${artistInfo.name}`;
  const contentSections = work.sections || [];
  const gallery = work.gallery || [];
  const renderListRows = () => {
    return listedWorks.map((item) => {
      const thumbnail = item.homeImage || "";
      return `<button class="project-list-item${item.slug === work.slug ? " is-current" : ""}" type="button" data-work-slug="${escapeHTML(item.slug)}" aria-label="${escapeHTML(item.title)} 상세 보기">
        <span class="project-list-thumb" aria-hidden="true">${thumbnail ? `<img src="${escapeHTML(optimizedImageURL(thumbnail, item.slug === "work-01"))}" alt="" loading="lazy" />` : ""}</span>
      </button>`;
    }).join("");
  };
  const primaryImage = work.homeImage || "";
  const imageItems = primaryImage
    ? [{ src: primaryImage, name: "대표 이미지" }, ...gallery.filter((src) => src !== primaryImage).map((item) => {
      const src = typeof item === "string" ? item : item.src;
      const suppliedName = typeof item === "string" ? "" : item.name;
      const filename = (src || "").split("/").pop().replace(/\.[^.]+$/, "");
      const name = suppliedName || filename.replace(/^work-\d+-/, "").replace(/^map-of-senses-/, "").replace(/-/g, " ");
      return { src, name };
    })]
    : gallery.map((item) => {
      const src = typeof item === "string" ? item : item.src;
      const suppliedName = typeof item === "string" ? "" : item.name;
      const filename = (src || "").split("/").pop().replace(/\.[^.]+$/, "");
      return { src, name: suppliedName || filename.replace(/^work-\d+-/, "").replace(/^map-of-senses-/, "").replace(/-/g, " ") };
    });
  const hasImageGrid = imageItems.length >= 2;
  const rotateGalleryImage = (src, index) => (work.slug === "work-01" && index === 0)
    || (work.slug === "work-15" && /work-15-view-(03|04|05|06|07|08|14)\./i.test(String(src)));
  const galleryMarkup = hasImageGrid ? `<div class="detail-gallery" aria-label="작업 이미지">
    ${imageItems.map((item, index) => `<button class="detail-grid-item" type="button" data-image-index="${index}" aria-label="${escapeHTML(item.name)} 크게 보기">
      <span class="detail-grid-image"><img src="${escapeHTML(optimizedImageURL(item.src, rotateGalleryImage(item.src, index)))}" alt="" loading="lazy" /></span>
    </button>`).join("")}
  </div>` : "";
  const lightboxMarkup = hasImageGrid ? `<div class="image-lightbox" id="image-lightbox" role="dialog" aria-modal="true" aria-label="작업 이미지 보기" hidden>
    <button class="lightbox-close" type="button" aria-label="닫기">×</button>
    <button class="lightbox-nav lightbox-prev" type="button" aria-label="이전 이미지">←</button>
    <figure class="lightbox-figure"><img class="lightbox-image" alt="" loading="lazy" /><figcaption class="lightbox-caption"></figcaption></figure>
    <button class="lightbox-nav lightbox-next" type="button" aria-label="다음 이미지">→</button>
  </div>` : "";
  const videoPlayerMarkup = work.video && work.medium === "video" ? `<div class="detail-video-player">${videoEmbed(work.video, work)}</div>` : "";
  const centralMedia = work.video && work.medium === "video"
    ? `${videoPlayerMarkup}${galleryMarkup}`
    : `<div class="detail-feature"><div class="video-stage">${projectMedia(work)}</div></div>${galleryMarkup}`;
  const existingProjectList = app.querySelector(".project-list");
  let existingListScrollTop = existingProjectList?.scrollTop;
  if (!Number.isFinite(existingListScrollTop)) {
    try { existingListScrollTop = Number(sessionStorage.getItem(PROJECT_LIST_SCROLL_KEY)) || 0; } catch (_) { existingListScrollTop = 0; }
  }
  app.innerHTML = `
    <section class="project-layout" aria-label="${escapeHTML(work.title)}">
      <nav class="project-list" aria-label="작품 목록">
        <div class="project-list-rows">${renderListRows()}</div>
      </nav>
      <div class="pane-splitter" role="separator" aria-orientation="vertical" aria-label="목록과 캡션 사이 너비 조절" tabindex="0" data-splitter="list" title="드래그해 너비 조절 · 더블클릭해 기본값으로"></div>
      <aside class="project-info" aria-label="작품 자료와 캡션">
        ${contentSections.length ? `<section class="project-content" aria-label="작품별 글과 자료">
          <div class="project-content-list" role="tablist" aria-label="글과 자료 항목">
            ${contentSections.map((section, index) => `<button class="project-list-item project-content-item${index === 0 ? " is-current" : ""}" type="button" role="tab" aria-selected="${index === 0}" aria-controls="project-content-display" data-section-index="${index}">
              <span class="project-list-title">${escapeHTML(section.title)}</span>
            </button>`).join("")}
          </div>
          <div class="project-content-display" id="project-content-display" role="tabpanel" tabindex="0"></div>
        </section>` : ""}
        <header class="caption">
          <h1>${escapeHTML(work.title)}</h1>
          <p class="caption-meta">${escapeHTML(work.year)}${work.format ? ` · ${escapeHTML(work.format)}` : ""}</p>
          ${work.description ? `<div class="project-description">${work.description.split(/\n\s*\n/).map((paragraph) => `<p>${escapeHTML(paragraph).replace(/\n/g, " ")}</p>`).join("")}</div>` : ""}
        </header>
      </aside>
      <div class="pane-splitter pane-splitter-fixed" aria-hidden="true" data-splitter="caption"></div>
      <section class="project-main" aria-label="작업 이미지">
        ${centralMedia}
      </section>
    </section>
    ${lightboxMarkup}`;
  const newProjectList = app.querySelector(".project-list");
  if (existingProjectList) {
    newProjectList.replaceWith(existingProjectList);
    existingProjectList.scrollTop = existingListScrollTop;
    existingProjectList.querySelectorAll("[data-work-slug]").forEach((button) => {
      button.classList.toggle("is-current", button.dataset.workSlug === work.slug);
    });
    requestAnimationFrame(() => { existingProjectList.scrollTop = existingListScrollTop; });
  } else {
    newProjectList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-work-slug]");
      if (button) {
        try { sessionStorage.setItem(PROJECT_LIST_SCROLL_KEY, String(newProjectList.scrollTop)); } catch (_) {}
        location.hash = `#work/${encodeURIComponent(button.dataset.workSlug)}`;
      }
    });
  }
  if (contentSections.length) {
    const contentDisplay = app.querySelector("#project-content-display");
    const contentButtons = [...app.querySelectorAll(".project-content-item")];
    const showContentSection = (index) => {
      const section = contentSections[index];
      contentButtons.forEach((button, buttonIndex) => {
        const selected = buttonIndex === index;
        button.classList.toggle("is-current", selected);
        button.setAttribute("aria-selected", String(selected));
      });
      const text = section.text
        ? `<div class="project-content-text">${escapeHTML(section.text).replace(/\n/g, "<br>")}</div>`
        : "";
      const images = (section.images || []).map((image) => {
        const src = typeof image === "string" ? image : image.src;
        const alt = typeof image === "string" ? section.title : image.alt || section.title;
        return `<img class="project-content-image" src="${escapeHTML(optimizedImageURL(src))}" alt="${escapeHTML(alt)}" loading="lazy" />`;
      }).join("");
      contentDisplay.innerHTML = text || images
        ? `${text}${images}`
        : `<p class="project-content-empty">이 항목에 글이나 자료를 추가할 수 있습니다.</p>`;
    };
    contentButtons.forEach((button) => {
      button.addEventListener("click", () => showContentSection(Number(button.dataset.sectionIndex)));
    });
    showContentSection(0);
  }
  const projectLayout = app.querySelector(".project-layout");
  const readLayout = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(DETAIL_LAYOUT_KEY) || "null");
      if (saved && Number.isFinite(saved.list)) return { list: saved.list };
    } catch (_) {}
    return defaultDetailLayout();
  };
  let paneLayout = readLayout();
  const applyLayout = () => {
    projectLayout.style.setProperty("--detail-list-size", `${paneLayout.list * 100}vw`);
    document.documentElement.style.setProperty("--detail-list-size", `${paneLayout.list * 100}vw`);
    projectLayout.querySelectorAll(".pane-splitter").forEach((splitter) => {
      if (splitter.dataset.splitter === "list") {
        splitter.setAttribute("aria-valuenow", String(Math.round(paneLayout.list * 100)));
        splitter.setAttribute("aria-valuemin", "6");
        splitter.setAttribute("aria-valuemax", "25");
      }
    });
  };
  const clampLayout = (list) => {
    const narrow = window.innerWidth <= 760;
    const minList = (narrow ? 64 : 100) / window.innerWidth;
    const splitterSpace = (narrow ? 28 : 48) / window.innerWidth;
    const minCaption = (narrow ? 0 : 150) / window.innerWidth;
    const fixedImageSize = .6;
    const maxList = Math.max(minList, 1 - splitterSpace - minCaption - fixedImageSize);
    return { list: Math.max(minList, Math.min(list, maxList)) };
  };
  paneLayout = clampLayout(paneLayout.list);
  applyLayout();
  detailResizeHandler = () => {
    paneLayout = clampLayout(paneLayout.list);
    applyLayout();
  };
  window.addEventListener("resize", detailResizeHandler);
  const resetPane = (name) => {
    if (name !== "list") return;
    const defaults = defaultDetailLayout();
    paneLayout = clampLayout(defaults.list);
    applyLayout();
    try { localStorage.setItem(DETAIL_LAYOUT_KEY, JSON.stringify(paneLayout)); } catch (_) {}
  };
  app.querySelectorAll(".pane-splitter").forEach((splitter) => {
    const name = splitter.dataset.splitter;
    if (name === "caption") return;
    splitter.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      const startX = event.clientX;
      const startList = paneLayout.list;
      document.body.classList.add("resizing-detail-panes");
      splitter.setPointerCapture?.(event.pointerId);
      const onMove = (moveEvent) => {
        const delta = (moveEvent.clientX - startX) / window.innerWidth;
        paneLayout = clampLayout(startList + delta);
        applyLayout();
      };
      const onUp = () => {
        document.body.classList.remove("resizing-detail-panes");
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
        document.removeEventListener("pointercancel", onUp);
        try { localStorage.setItem(DETAIL_LAYOUT_KEY, JSON.stringify(paneLayout)); } catch (_) {}
      };
      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp, { once: true });
      document.addEventListener("pointercancel", onUp, { once: true });
    });
    splitter.addEventListener("dblclick", () => resetPane(name));
    splitter.addEventListener("keydown", (event) => {
      if (event.key === "Home") {
        event.preventDefault();
        resetPane(name);
        return;
      }
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const delta = (event.key === "ArrowRight" ? 1 : -1) * 12 / window.innerWidth;
      paneLayout = clampLayout(paneLayout.list + delta);
      applyLayout();
      try { localStorage.setItem(DETAIL_LAYOUT_KEY, JSON.stringify(paneLayout)); } catch (_) {}
    });
  });
  if (hasImageGrid) {
    const lightbox = document.querySelector("#image-lightbox");
    const lightboxImage = lightbox.querySelector(".lightbox-image");
    const lightboxCaption = lightbox.querySelector(".lightbox-caption");
    let activeImageIndex = 0;
    let returnFocus = null;
    const showImage = (index) => {
      activeImageIndex = (index + imageItems.length) % imageItems.length;
      const item = imageItems[activeImageIndex];
      lightboxImage.src = optimizedImageURL(item.src, rotateGalleryImage(item.src, activeImageIndex));
      lightboxImage.alt = item.name;
      lightboxCaption.textContent = `${item.name} · ${activeImageIndex + 1} / ${imageItems.length}`;
    };
    const closeLightbox = () => {
      lightbox.hidden = true;
      document.removeEventListener("keydown", handleLightboxKeydown);
      returnFocus?.focus();
    };
    const handleLightboxKeydown = (event) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showImage(activeImageIndex - 1);
      if (event.key === "ArrowRight") showImage(activeImageIndex + 1);
    };
    app.querySelectorAll(".detail-grid-item").forEach((button) => {
      button.addEventListener("click", () => {
        returnFocus = button;
        showImage(Number(button.dataset.imageIndex));
        lightbox.hidden = false;
        lightbox.querySelector(".lightbox-close").focus();
        document.addEventListener("keydown", handleLightboxKeydown);
      });
    });
    lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showImage(activeImageIndex - 1));
    lightbox.querySelector(".lightbox-next").addEventListener("click", () => showImage(activeImageIndex + 1));
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }
  setActiveNav("work");
}

function renderInfo() {
  renderWorkDetail(activeWorkSlug);
  document.title = `Info — ${artistInfo.name}`;
  const instagram = artistInfo.instagram ? `<a href="${escapeHTML(artistInfo.instagram)}" target="_blank" rel="noreferrer">Instagram ↗</a>` : "";
  const youtube = artistInfo.youtube ? `<a href="${escapeHTML(artistInfo.youtube)}" target="_blank" rel="noreferrer">YouTube ↗</a>` : "";
  app.querySelector(".project-info").innerHTML = `
    <section class="embedded-info" aria-label="작가 정보">
      <h1>${escapeHTML(artistInfo.infoName)}</h1>
      <p class="embedded-info-education">${escapeHTML(artistInfo.education)}</p>
      <p>${escapeHTML(artistInfo.introduction)}</p>
      <div class="contact-links"><a href="mailto:${escapeHTML(artistInfo.email)}">${escapeHTML(artistInfo.email)} ↗</a>${instagram}${youtube}</div>
    </section>`;
  const slides = works.filter((work) => work.homeImage);
  const mainPane = app.querySelector(".project-main");
  if (slides.length) {
    mainPane.innerHTML = `<div class="home-slideshow" aria-label="작품 이미지 슬라이드">
      ${slides.map((work, index) => `<img class="home-slide${index === 0 ? " is-active" : ""}" src="${escapeHTML(optimizedImageURL(work.homeImage, work.slug === "work-01"))}" alt="${escapeHTML(work.title)}" loading="lazy" />`).join("")}
    </div>`;
    const slideImages = [...mainPane.querySelectorAll(".home-slide")];
    let slideIndex = 0;
    homeSlideTimer = window.setInterval(() => {
      slideImages[slideIndex].classList.remove("is-active");
      slideIndex = (slideIndex + 1) % slideImages.length;
      slideImages[slideIndex].classList.add("is-active");
    }, 10000);
  }
  setActiveNav("info");
}

function renderArchive() {
  renderWorkDetail(activeWorkSlug);
  document.title = `Archive — ${artistInfo.name}`;
  const index = app.querySelector(".project-info");
  const articlePane = app.querySelector(".project-main");
  const renderArticle = (selectedIndex) => {
    const article = archiveTexts[selectedIndex];
    index.querySelectorAll("[data-article-index]").forEach((button, buttonIndex) => {
      button.classList.toggle("is-current", buttonIndex === selectedIndex);
      button.setAttribute("aria-current", String(buttonIndex === selectedIndex));
    });
    articlePane.innerHTML = `<article class="archive-article" aria-label="${escapeHTML(article.title)}">
      <time datetime="20${escapeHTML(article.date.replaceAll(".", "-"))}">${escapeHTML(article.date)}</time>
      <div class="archive-article-body">${article.text.split(/\n\s*\n/).map((paragraph) => `<p>${escapeHTML(paragraph).replace(/\n/g, " ")}</p>`).join("")}</div>
    </article>`;
    articlePane.scrollTop = 0;
  };
  index.innerHTML = `<nav class="archive-text-list" aria-label="글 목록">
    ${archiveTexts.map((article, articleIndex) => `<button class="archive-text-item${articleIndex === 0 ? " is-current" : ""}" type="button" data-article-index="${articleIndex}" aria-current="${articleIndex === 0}">${escapeHTML(article.title)}</button>`).join("")}
  </nav>`;
  index.addEventListener("click", (event) => {
    const button = event.target.closest("[data-article-index]");
    if (button) renderArticle(Number(button.dataset.articleIndex));
  });
  renderArticle(0);
  setActiveNav("archive");
}

function renderNotFound() {
  clearDetailResizeHandler();
  document.body.classList.remove("detail-open");
  app.innerHTML = `<section class="not-found"><p class="eyebrow">404</p><h1>작품을 찾을 수 없습니다.</h1><a class="back-link" href="#work">← 작품 목록으로</a></section>`;
  setActiveNav("work");
}

function setActiveNav(name) {
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === name) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

document.querySelector('[data-nav="work"]').addEventListener("click", (event) => {
  if (location.hash === "#work") {
    event.preventDefault();
    renderInfo();
  }
});

function renderRoute() {
  const [page, slug] = decodeURIComponent(location.hash.slice(1)).split("/");
  if (page === "info") renderInfo();
  else if (page === "archive") renderArchive();
  else if (page === "work" && slug) renderWorkDetail(slug);
  else if (!page || page === "work") renderInfo();
  else renderWorkDetail(works[0]?.slug || "");
}

window.addEventListener("hashchange", renderRoute);
renderRoute();
