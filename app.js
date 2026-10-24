const app = document.querySelector("#app");
const DETAIL_LIST_LIMIT = 15;
const DETAIL_LAYOUT_KEY = "artist-portfolio-detail-layout-v6";
const PROJECT_LIST_SCROLL_KEY = "artist-portfolio-project-list-scroll";
const DEFAULT_DETAIL_RATIO = { list: 1.8 / 11, caption: 3 / 11 };
const CLOUDINARY_IMAGE_BASE = "https://res.cloudinary.com/iguwxlji/image/upload/f_auto,q_auto";
const defaultDetailLayout = () => {
  const splitterSpace = (window.innerWidth <= 760 ? 12 : 16) / window.innerWidth;
  const contentWidth = 1 - splitterSpace;
  return { list: contentWidth * DEFAULT_DETAIL_RATIO.list, caption: contentWidth * DEFAULT_DETAIL_RATIO.caption };
};
const listedWorks = works.slice(0, DETAIL_LIST_LIMIT);
let detailResizeHandler = null;
let activeWorkSlug = works[0]?.slug || "";

function clearDetailResizeHandler() {
  if (detailResizeHandler) window.removeEventListener("resize", detailResizeHandler);
  detailResizeHandler = null;
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
  const listMedium = (item) => (item.archiveMaterial || item.format || item.medium || "—").split(/[,，·]/)[0].trim();
  const renderListRows = () => {
    return listedWorks.map((item) => {
      const thumbnail = item.homeImage || "";
      return `<button class="project-list-item${item.slug === work.slug ? " is-current" : ""}" type="button" data-work-slug="${escapeHTML(item.slug)}" aria-label="${escapeHTML(item.title)} · ${escapeHTML(item.year || "—")} · ${escapeHTML(listMedium(item))} 상세 보기">
        <span class="project-list-thumb" aria-hidden="true">${thumbnail ? `<img src="${escapeHTML(optimizedImageURL(thumbnail, item.slug === "work-01"))}" alt="" loading="lazy" />` : ""}</span>
        <span class="project-list-meta"><span class="project-list-title">${escapeHTML(item.title)}</span><span class="project-list-year">${escapeHTML(item.year || "")}</span><span class="project-list-caption">${escapeHTML(listMedium(item))}</span></span>
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
  const centralMedia = `<div class="detail-feature"><div class="video-stage">${projectMedia(work)}</div></div>${videoPlayerMarkup}${galleryMarkup}`;
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
      <div class="pane-splitter" role="separator" aria-orientation="vertical" aria-label="캡션과 작업 이미지 사이 너비 조절" tabindex="0" data-splitter="caption" title="드래그해 너비 조절 · 더블클릭해 기본값으로"></div>
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
      if (saved && Number.isFinite(saved.list) && Number.isFinite(saved.caption)) return saved;
    } catch (_) {}
    return defaultDetailLayout();
  };
  let paneLayout = readLayout();
  const applyLayout = () => {
    projectLayout.style.setProperty("--detail-list-size", `${paneLayout.list * 100}vw`);
    projectLayout.style.setProperty("--detail-caption-size", `${paneLayout.caption * 100}vw`);
    projectLayout.querySelectorAll(".pane-splitter").forEach((splitter) => {
      const position = splitter.dataset.splitter === "list" ? paneLayout.list : paneLayout.list + paneLayout.caption;
      splitter.setAttribute("aria-valuenow", String(Math.round(position * 100)));
      splitter.setAttribute("aria-valuemin", "10");
      splitter.setAttribute("aria-valuemax", "90");
    });
  };
  const clampLayout = (list, caption) => {
    const narrow = window.innerWidth <= 760;
    const minList = (narrow ? 64 : 100) / window.innerWidth;
    const minCaption = (narrow ? 70 : 150) / window.innerWidth;
    const splitterSpace = (narrow ? 12 : 16) / window.innerWidth;
    const minImages = (narrow ? 80 : 250) / window.innerWidth + splitterSpace;
    list = Math.max(minList, Math.min(list, 1 - minImages - caption));
    caption = Math.max(minCaption, Math.min(caption, 1 - minImages - list));
    return { list, caption };
  };
  paneLayout = clampLayout(paneLayout.list, paneLayout.caption);
  applyLayout();
  detailResizeHandler = () => {
    paneLayout = clampLayout(paneLayout.list, paneLayout.caption);
    applyLayout();
  };
  window.addEventListener("resize", detailResizeHandler);
  const resetPane = (name) => {
    const defaults = defaultDetailLayout();
    paneLayout = clampLayout(
      name === "list" ? defaults.list : paneLayout.list,
      name === "caption" ? defaults.caption : paneLayout.caption
    );
    applyLayout();
    try { localStorage.setItem(DETAIL_LAYOUT_KEY, JSON.stringify(paneLayout)); } catch (_) {}
  };
  app.querySelectorAll(".pane-splitter").forEach((splitter) => {
    const name = splitter.dataset.splitter;
    splitter.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      const startX = event.clientX;
      const startList = paneLayout.list;
      const startCaption = paneLayout.caption;
      document.body.classList.add("resizing-detail-panes");
      splitter.setPointerCapture?.(event.pointerId);
      const onMove = (moveEvent) => {
        const delta = (moveEvent.clientX - startX) / window.innerWidth;
        paneLayout = clampLayout(startList + (name === "list" ? delta : 0), startCaption + (name === "caption" ? delta : 0));
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
      paneLayout = clampLayout(paneLayout.list + (name === "list" ? delta : 0), paneLayout.caption + (name === "caption" ? delta : 0));
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
    renderWorkDetail(works[0]?.slug || "");
  }
});

function renderRoute() {
  const [page, slug] = decodeURIComponent(location.hash.slice(1)).split("/");
  if (page === "info") renderInfo();
  else if (page === "archive") renderArchive();
  else if (page === "work" && slug) renderWorkDetail(slug);
  else if (!page) renderInfo();
  else renderWorkDetail(works[0]?.slug || "");
}

window.addEventListener("hashchange", renderRoute);
renderRoute();
