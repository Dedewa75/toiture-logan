/* ===== Toiture Logan — script ===== */
var CONFIG = {
  email: "toiturelogan@gmail.com",
  whatsapp: "32472014516" // 0472 01 45 16 au format international
};

/* Si une photo est en .jpeg / .png au lieu de .jpg, on essaie automatiquement */
document.addEventListener("error", function (e) {
  var img = e.target;
  if (!img || img.tagName !== "IMG") return;
  var order = [".jpg", ".jpeg", ".png", ".JPG", ".JPEG"];
  var src = img.getAttribute("src") || "";
  var m = src.match(/\.(jpg|jpeg|png|JPG|JPEG)$/);
  if (!m) return;
  var i = order.indexOf("." + m[1]);
  if (i > -1 && i < order.length - 1) {
    img.setAttribute("src", src.replace(/\.(jpg|jpeg|png|JPG|JPEG)$/, order[i + 1]));
  }
}, true);

document.addEventListener("DOMContentLoaded", function () {
  /* Menu mobile */
  var burger = document.querySelector(".burger");
  var nav = document.querySelector(".nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      burger.classList.toggle("open");
      nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", nav.classList.contains("open"));
    });
  }

  /* Année du copyright */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* Apparition au défilement */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  /* Filtres de la galerie */
  var filterBtns = document.querySelectorAll(".filters button");
  var figures = document.querySelectorAll(".gallery figure");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("on"); });
      btn.classList.add("on");
      var cat = btn.getAttribute("data-filter");
      figures.forEach(function (f) {
        var show = cat === "all" || f.getAttribute("data-cat") === cat;
        f.classList.toggle("hide", !show);
      });
    });
  });

  /* Visionneuse photos */
  var lb = document.querySelector(".lightbox");
  if (lb) {
    var lbImg = lb.querySelector("img");
    var zoomables = Array.prototype.slice.call(document.querySelectorAll(".gallery img, .pics img"));
    var current = 0;
    var visible = function () {
      return zoomables.filter(function (im) { return !im.closest("figure.hide"); });
    };
    var show = function (idx) {
      var list = visible();
      if (!list.length) return;
      current = (idx + list.length) % list.length;
      lbImg.src = list[current].currentSrc || list[current].src;
      lbImg.alt = list[current].alt;
      lb.classList.add("open");
    };
    zoomables.forEach(function (im) {
      im.addEventListener("click", function () { show(visible().indexOf(im)); });
    });
    lb.querySelector(".lb-close").addEventListener("click", function () { lb.classList.remove("open"); });
    lb.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); show(current - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); show(current + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.classList.remove("open"); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") lb.classList.remove("open");
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  }

  /* Formulaire de devis : envoi par email ou WhatsApp */
  var form = document.getElementById("devis");
  if (form) {
    var err = form.querySelector(".form-error");
    var buildMessage = function () {
      var v = function (id) { return (form.querySelector("#" + id).value || "").trim(); };
      if (!v("nom") || !v("tel") || !v("travaux")) { err.style.display = "block"; return null; }
      err.style.display = "none";
      return "Demande de devis - site Toiture Logan\n\n" +
        "Nom : " + v("nom") + "\n" +
        "Téléphone : " + v("tel") + "\n" +
        "Commune : " + (v("commune") || "-") + "\n" +
        "Type de travaux : " + v("travaux") + "\n\n" +
        "Message :\n" + (v("message") || "-");
    };
    form.querySelector("[data-send='email']").addEventListener("click", function () {
      var msg = buildMessage(); if (!msg) return;
      window.location.href = "mailto:" + CONFIG.email +
        "?subject=" + encodeURIComponent("Demande de devis - site internet") +
        "&body=" + encodeURIComponent(msg);
    });
    form.querySelector("[data-send='whatsapp']").addEventListener("click", function () {
      var msg = buildMessage(); if (!msg) return;
      window.open("https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(msg), "_blank");
    });
    form.addEventListener("submit", function (e) { e.preventDefault(); });
  }
});
