(() => {
  const S = window.SITE;
  const $ = (id) => document.getElementById(id);

  // Contagem regressiva
  const target = new Date(S.eventDate).getTime();
  const cd = $("countdown");
  const tick = () => {
    const d = target - Date.now();
    if (d <= 0) { cd.textContent = ""; return; }
    const v = [["dias", 864e5], ["horas", 36e5], ["min", 6e4], ["seg", 1e3]];
    let rest = d;
    cd.innerHTML = v.map(([l, ms]) => {
      const n = Math.floor(rest / ms); rest -= n * ms;
      return `<div><b>${String(n).padStart(2, "0")}</b><span>${l}</span></div>`;
    }).join("");
  };
  tick(); setInterval(tick, 1000);

  // Galeria
  if (!S.galleryOpen) return;
  fetch("photos/photos.json").then((r) => r.json()).then((list) => {
    if (!list.length) return;
    $("soon").hidden = true;
    $("credit").textContent = S.photographer;
    $("gallery").hidden = false;
    if (S.zipFile) { $("zip").href = S.zipFile; $("zip").hidden = false; }
    const files = list.map((f) => "photos/" + f);
    $("grid").innerHTML = files.map((src, i) =>
      `<button data-i="${i}" aria-label="Abrir foto ${i + 1}"><img loading="lazy" src="${src}" alt="Foto ${i + 1}"></button>`).join("");
    document.querySelectorAll(".grid img").forEach((img) =>
      img.complete ? img.classList.add("in") : img.addEventListener("load", () => img.classList.add("in")));

    let cur = 0;
    const lb = $("lightbox");
    const show = (i) => {
      cur = (i + files.length) % files.length;
      $("lb-img").src = files[cur];
      $("lb-dl").href = files[cur];
      $("lb-dl").setAttribute("download", files[cur].split("/").pop());
    };
    $("grid").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      show(+b.dataset.i); lb.hidden = false;
    });
    const close = () => (lb.hidden = true);
    lb.querySelector(".lb-close").onclick = close;
    lb.querySelector(".prev").onclick = () => show(cur - 1);
    lb.querySelector(".next").onclick = () => show(cur + 1);
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    document.addEventListener("keydown", (e) => {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(cur - 1);
      if (e.key === "ArrowRight") show(cur + 1);
    });
  }).catch(() => {});
})();
