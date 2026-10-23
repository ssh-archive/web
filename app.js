const app = document.querySelector("#app");
const year = document.querySelector("#year");
const previewColors = ["#202020", "#383838", "#555555", "#777777", "#999999"];
const DETAIL_LIST_LIMIT = 15;
const DETAIL_LAYOUT_KEY = "artist-portfolio-detail-layout-v1";
const DEFAULT_DETAIL_LAYOUT = { list: 0.22, caption: 0.30 };
const CLOUDINARY_IMAGE_BASE = "https://res.cloudinary.com/iguwxlji/image/upload/f_auto,q_auto";
const defaultDetailLayout = () => window.innerWidth <= 760 ? { list: 0.28, caption: 0.30 } : { ...DEFAULT_DETAIL_LAYOUT };
const homeWorks = works.slice(0, DETAIL_LIST_LIMIT);
let slideshowTimer;
let slideIndex = 0;
let detailResizeHandler = null;

function clearDetailResizeHandler() {
  if (detailResizeHandler) window.removeEventListener("resize", detailResizeHandler);
  detailResizeHandler = null;
}
year.textContent = new Date().getFullYear();
document.querySelector("#artist-name").textContent = artistInfo.name;
document.querySelector("#footer-artist-name").textContent = artistInfo.name;

const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));

function optimizedImageURL(src = "") {
  if (!src) return "";
  const value = String(src);
  if (value.includes("res.cloudinary.com/") && value.includes("/image/upload/")) {
    if (value.includes("/image/upload/f_auto,q_auto/")) return value;
    return value.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
  }
  if (!/^https?:\/\//i.test(value)) {
    const filename = value.split(/[?#]/, 1)[0].split("/").pop();
    return filename ? `${CLOUDINARY_IMAGE_BASE}/${filename}` : "";
  }
  return value;
}

function posterMarkup(work, extraClass = "", image = work.poster) {
  const classes = `poster ${escapeHTML(work.artwork || "")}${image ? " has-poster" : ""}${extraClass ? ` ${extraClass}` : ""}`;
  if (image) return `<img class="${classes}" src="${escapeHTML(optimizedImageURL(image))}" alt="" aria-hidden="true" />`;
  return `<div class="${classes}" aria-hidden="true"></div>`;
}

function captionFields(work) {
  const material = work.archiveMaterial || work.format || work.medium || "—";
  return `${escapeHTML(work.year || "—")} · ${escapeHTML(material)}`;
}

function fileRow(work, className = "file-row") {
  return `<a class="${className}" href="#work/${encodeURIComponent(work.slug)}"><span>${escapeHTML(work.title)}</span><span class="row-meta">${captionFields(work)}</span></a>`;
}

function renderWorkIndex() {
  clearDetailResizeHandler();
  document.title = `${artistInfo.name} — Works`;
  document.body.classList.remove("detail-open");
  document.body.classList.remove("home-scrolled");
  document.body.classList.add("home-page");
  clearTimeout(slideshowTimer);
  slideIndex = 0;
  app.innerHTML = `
    <section class="index-layout" aria-label="작품 목록">
      <section class="hero-section" aria-label="작품 이미지 슬라이드">
        <button class="hero-slide" id="hero-slide" type="button" aria-label="다음 작품 이미지">
          <img class="hero-image" id="hero-image" alt="" hidden />
          <span class="hero-placeholder" id="hero-placeholder" aria-hidden="true"></span>
        </button>
      </section>
      <section class="work-section" aria-label="작업 그리드">
        <div class="work-grid">
          ${homeWorks.map((work, index) => `
            <a class="work-card" style="--tile-color:${previewColors[index % previewColors.length]}" href="#work/${encodeURIComponent(work.slug)}" aria-label="${escapeHTML(work.title)}, ${escapeHTML(work.year)}">
            ${posterMarkup(work, "", work.homeImage || work.poster)}
            </a>`).join("")}
        </div>
      </section>
    </section>`;
  const hero = document.querySelector("#hero-slide");
  const heroImage = document.querySelector("#hero-image");
  const placeholder = document.querySelector("#hero-placeholder");
  function showSlide(index) {
    slideIndex = index % homeWorks.length;
    const work = homeWorks[slideIndex];
    hero.style.setProperty("--slide-color", previewColors[slideIndex % previewColors.length]);
    hero.setAttribute("aria-label", `다음 이미지 · ${work.title}`);
    const image = work.homeImage || work.poster;
    if (image) {
      heroImage.src = optimizedImageURL(image);
      heroImage.alt = work.title;
      heroImage.hidden = false;
      placeholder.hidden = true;
    } else {
      heroImage.removeAttribute("src");
      heroImage.hidden = true;
      placeholder.textContent = String(slideIndex + 1).padStart(2, "0");
      placeholder.hidden = false;
    }
  }
  function resetSlideTimer() {
    clearTimeout(slideshowTimer);
    slideshowTimer = setTimeout(() => {
      showSlide(slideIndex + 1);
      resetSlideTimer();
    }, 10000);
  }
  hero.addEventListener("click", () => {
    showSlide(slideIndex + 1);
    resetSlideTimer();
  });
  showSlide(slideIndex);
  resetSlideTimer();
  syncHomeTheme();
  setActiveNav("work");
}

function syncHomeTheme() {
  if (!document.body.classList.contains("home-page")) return;
  const hero = document.querySelector(".hero-section");
  document.body.classList.toggle("home-scrolled", Boolean(hero && hero.getBoundingClientRect().bottom <= 0));
}

function videoEmbed(url, work) {
  if (!url) {
    const poster = work.poster ? ` poster="${escapeHTML(work.poster)}"` : "";
    return `<video class="video-frame"${poster} controls playsinline preload="metadata" aria-label="${escapeHTML(work.title)} 영상"></video>`;
  }
  if (/\.(mp4|m4v|mov|webm|ogg)(?:$|[?#])/i.test(url)) {
    return `<video class="video-frame" src="${escapeHTML(url)}" controls playsinline preload="metadata" aria-label="${escapeHTML(work.title)} 영상"></video>`;
  }
  let embed = url;
  const youtube = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (youtube) embed = `https://www.youtube-nocookie.com/embed/${youtube[1]}`;
  else if (vimeo) embed = `https://player.vimeo.com/video/${vimeo[1]}`;
  return `<iframe class="video-frame" src="${escapeHTML(embed)}" title="${escapeHTML(work.title)} 영상" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
}

function projectMedia(work) {
  if (work.medium === "video" || work.video) return videoEmbed(work.video, work);
  return `<div class="still-stage">${posterMarkup(work, "still-poster")}</div>`;
}

function renderWorkDetail(slug) {
  clearDetailResizeHandler();
  const work = works.find((item) => item.slug === slug);
  if (!work) return renderNotFound();
  document.body.classList.add("detail-open");
  document.body.classList.remove("home-page", "home-scrolled");
  clearTimeout(slideshowTimer);
  document.title = `${work.title} — ${artistInfo.name}`;
  const materials = (work.materials || []).slice(0, 4).map((src) => `<figure class="material"><img src="${escapeHTML(optimizedImageURL(src))}" alt="${escapeHTML(work.title)} 작업 자료" /></figure>`).join("");
  const contentSections = work.sections || [];
  const gallery = work.gallery || [];
  const primaryImage = work.poster || work.homeImage || "";
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
  const galleryMarkup = hasImageGrid ? `<div class="detail-gallery" aria-label="작업 이미지">
    ${imageItems.map((item, index) => `<button class="detail-grid-item" type="button" data-image-index="${index}" aria-label="${escapeHTML(item.name)} 크게 보기">
      <span class="detail-grid-image"><img src="${escapeHTML(optimizedImageURL(item.src))}" alt="" loading="lazy" /></span>
      <span class="detail-grid-name">${escapeHTML(item.name)}</span>
    </button>`).join("")}
  </div>` : "";
  const lightboxMarkup = hasImageGrid ? `<div class="image-lightbox" id="image-lightbox" role="dialog" aria-modal="true" aria-label="작업 이미지 보기" hidden>
    <button class="lightbox-close" type="button" aria-label="닫기">×</button>
    <button class="lightbox-nav lightbox-prev" type="button" aria-label="이전 이미지">←</button>
    <figure class="lightbox-figure"><img class="lightbox-image" alt="" /><figcaption class="lightbox-caption"></figcaption></figure>
    <button class="lightbox-nav lightbox-next" type="button" aria-label="다음 이미지">→</button>
  </div>` : "";
  const centralMedia = `<div class="detail-feature"><div class="video-stage">${projectMedia(work)}</div></div>${galleryMarkup}`;
  app.innerHTML = `
    <section class="project-layout" aria-label="${escapeHTML(work.title)}">
      <nav class="project-list" aria-label="작품 목록">
        ${homeWorks.map((item) => {
          const thumbnail = item.homeImage || item.poster || "";
          const mediumSource = item.archiveMaterial || item.format || item.medium || "—";
          const medium = mediumSource.split(/[,，·]/)[0].trim();
          return `<button class="project-list-item${item.slug === work.slug ? " is-current" : ""}" type="button" data-work-slug="${escapeHTML(item.slug)}" aria-label="${escapeHTML(item.title)} 상세 보기. 더블클릭하여 열기" title="더블클릭하여 작품 열기">
            <span class="project-list-thumb" aria-hidden="true">${thumbnail ? `<img src="${escapeHTML(optimizedImageURL(thumbnail))}" alt="" loading="lazy" />` : ""}</span>
            <span class="project-list-title">${escapeHTML(item.title)}</span>
            <span class="project-list-year">${escapeHTML(item.year || "—")}</span>
            <span class="project-list-medium">${escapeHTML(medium)}</span>
          </button>`;
        }).join("")}
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
          ${work.role ? `<p class="caption-meta">${escapeHTML(work.role)}</p>` : ""}
          ${work.description ? `<p class="project-description">${escapeHTML(work.description).replace(/\n/g, "<br>")}</p>` : ""}
        </header>
        ${materials ? `<div class="materials">${materials}</div>` : ""}
      </aside>
      <div class="pane-splitter" role="separator" aria-orientation="vertical" aria-label="캡션과 작업 이미지 사이 너비 조절" tabindex="0" data-splitter="caption" title="드래그해 너비 조절 · 더블클릭해 기본값으로"></div>
      <section class="project-main gallery-scroll" aria-label="작업 이미지">
        ${centralMedia}
      </section>
    </section>
    ${lightboxMarkup}`;
  const openProject = (targetSlug) => {
    const target = `#work/${encodeURIComponent(targetSlug)}`;
    if (location.hash === target) renderWorkDetail(targetSlug);
    else location.hash = target;
  };
  app.querySelectorAll(".project-list-item").forEach((button) => {
    button.addEventListener("dblclick", () => openProject(button.dataset.workSlug));
    button.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        openProject(button.dataset.workSlug);
      }
    });
  });
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
    const minList = (narrow ? 64 : 160) / window.innerWidth;
    const minCaption = (narrow ? 70 : 220) / window.innerWidth;
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
      lightboxImage.src = optimizedImageURL(item.src);
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
  clearDetailResizeHandler();
  document.body.classList.remove("detail-open");
  document.body.classList.remove("home-page", "home-scrolled");
  clearTimeout(slideshowTimer);
  document.title = `Info — ${artistInfo.name}`;
  const instagram = artistInfo.instagram ? `<a href="${escapeHTML(artistInfo.instagram)}" target="_blank" rel="noreferrer">Instagram ↗</a>` : "";
  app.innerHTML = `
    <section class="info-page">
      <h1>${escapeHTML(artistInfo.infoName || artistInfo.name)}</h1>
      <div class="info-content">
        <p>${escapeHTML(artistInfo.education)}<br><br>${escapeHTML(artistInfo.introduction).replace(/\n/g, "<br>")}</p>
        <div class="contact-links"><a href="mailto:${escapeHTML(artistInfo.email)}">${escapeHTML(artistInfo.email)} ↗</a>${instagram}</div>
      </div>
    </section>`;
  setActiveNav("info");
}

function renderArchive() {
  clearDetailResizeHandler();
  document.body.classList.remove("detail-open");
  document.body.classList.remove("home-page", "home-scrolled");
  clearTimeout(slideshowTimer);
  document.title = `Archive — ${artistInfo.name}`;
  app.innerHTML = `
    <section class="archive-page" aria-label="작업 아카이브">
      <div class="archive-list">
        ${works.map((work) => `
          <a class="archive-row" href="#work/${encodeURIComponent(work.slug)}">
            <span>${escapeHTML(work.title)}</span>
            <span>${escapeHTML(work.year || "—")}</span>
            <span>${escapeHTML(work.archiveMaterial || work.format || "—")}</span>
            <span>${escapeHTML(work.size || "—")}</span>
            <span>${escapeHTML(work.timeline || "—")}</span>
          </a>`).join("")}
      </div>
    </section>`;
  setActiveNav("archive");
}

function renderNotFound() {
  clearDetailResizeHandler();
  document.body.classList.remove("detail-open");
  document.body.classList.remove("home-page", "home-scrolled");
  clearTimeout(slideshowTimer);
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
    renderWorkIndex();
  }
});

function renderRoute() {
  const [page, slug] = decodeURIComponent(location.hash.slice(1)).split("/");
  if (page === "info") renderInfo();
  else if (page === "archive") renderArchive();
  else if (page === "work" && slug) renderWorkDetail(slug);
  else renderWorkIndex();
}

window.addEventListener("hashchange", renderRoute);
window.addEventListener("scroll", syncHomeTheme, { passive: true });
renderRoute();
