document.addEventListener("DOMContentLoaded", async () => {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes waveIn {
      0% {
        clip-path: circle(0% at 50% 50%);
        opacity: 0;
      }
      50% {
        clip-path: circle(50% at 50% 50%);
        opacity: 0.7;
      }
      100% {
        clip-path: circle(100% at 50% 50%);
        opacity: 1;
      }
    }

  @keyframes waveOut {
    0% {
      clip-path: circle(100% at 50% 50%);
      opacity: 1;
    }
    40% { 
     clip-path: circle(50% at 50% 50%);
      opacity: 0.7;
    }
    60% {  
      clip-path: circle(20% at 50% 50%);
     opacity: 0.5;
   }
    100% {
     clip-path: circle(0% at 50% 50%);
     opacity: 0;
   }
  }

  @keyframes circleOut {
    0% {
     opacity: 1;
     transform: translate(-50%, -50%) scale(1);
    }
    100% {
     opacity: 0;
     transform: translate(-50%, -50%) scale(0);
    }
  }



    .transition-screen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 999;
      display: none;
      animation-timing-function: ease-in-out;
      background-color: black;
      clip-path: circle(0% at 50% 50%);
      opacity: 0;
    }

    .circle {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 60px;
      height: 60px;
      background-color: black;
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
      animation: popIn 0.5s forwards;
      z-index: 1000;
    }

    .oval {
      position: absolute;
      top: 50%;
     left: 50%;
     width: 150px;
     height: 100px;
     background-color: transparent;
      border-radius: 50% / 40%;
      border: 5px solid black;
     transform: translate(-50%, -50%);
     z-index: 999;
     opacity: 0;
     transition: opacity 0.5s;
    }

        .eyelash {
      position: absolute;
      width: 100px;
      height: 10px;
      background-color: black;
      top: 45%;
      z-index: 998;
      opacity: 0;
      transition: opacity 0.5s;
    }

    .eyelash.left {
      left: calc(100% - 90px);
      transform: rotate(-20deg);
    }

    .eyelash.right {
      left: calc(10% + 10px);
      transform: rotate(20deg);
    }

    .eyelash.visible {
      opacity: 1;
    }



    @keyframes popIn {
      0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
      }
      100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
    }
.fiche {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: flex-start;
}

.fiche img {
  max-width: 400px;
  height: auto;
}

.fiche .description {
  max-width: 1000px;
  width: auto;
}

.fiche h2 {
  font-size: 4rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
}

.fiche p {
  font-size: 1rem;
  line-height: 1.5;
}

  `;
  document.head.appendChild(style);

  const sheets = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRwAKvQ7YQRgA-TYNqVb38ZrspQVCF-EtRuQOr_GJvvS-VWY66tv6rXKZwkjn9KvkJ69xkzoMkh47b7/pub?output=csv";
  const response = await fetch(sheets);
  const csvText = await response.text();

  function csvToJson(csv) {
    const lines = csv.trim().split("\n");
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    return lines.slice(1).map(line => {
      const values = line.split(",").map(v => v.trim());
      return headers.reduce((acc, h, i) => ({ ...acc, [h]: values[i] }), {});
    });
  }
  const json = csvToJson(csvText);
  const $projets = document.querySelector(".projets");
  const movingCircle = document.createElement("div");
  movingCircle.classList.add("moving-circle");
  document.body.appendChild(movingCircle);
  

  const movingSquare = document.createElement("div");
  movingSquare.classList.add("moving-square");
  document.body.appendChild(movingSquare);


  $projets.style.display = "flex";
  $projets.style.flexDirection = "column";
  $projets.style.alignItems = "center";
  $projets.style.justifyContent = "center";
  $projets.style.minHeight = "100vh";
  $projets.style.gap = "1rem";
  $projets.style.fontFamily = "sans-serif";

  const modal = document.createElement("div");
  modal.classList.add("overlay");
  modal.style.display = "none";
  document.body.appendChild(modal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  const fiche = document.createElement("div");
  fiche.classList.add("fiche");
  fiche.innerHTML = `
    <div class="title-image">
      <h2 id="modal-title"></h2>
      <img id="modal-img" src="" alt="Project Image">
    </div>
    <div class="description">
      <p id="modal-description"></p>
    </div>
  `;
  modal.appendChild(fiche);

  function showModal(item) {
    document.getElementById("modal-title").textContent = item.titre;
    document.getElementById("modal-img").src = `img/${item.titre}.jpg`;
    document.getElementById("modal-description").textContent = item.description ;
    
    const descriptionElement = document.querySelector("#modal-description");
    descriptionElement.style.maxWidth = "100%";
    descriptionElement.style.wordWrap = "break-word";
    descriptionElement.style.whiteSpace = "normal";
    descriptionElement.style.overflowY = "visible"; 
  
    modal.style.display = "block";
  }
  
  
  function getSoftColor() {
    const hue = Math.floor(Math.random() * 60) + 280;
    const saturation = Math.floor(Math.random() * 20) + 30;
    const lightness = Math.floor(Math.random() * 30) + 50;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
  
  function createGradientLayer() {
    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.top = "0";
    div.style.left = "0";
    div.style.width = "100vw";
    div.style.height = "100vh";
    div.style.zIndex = "-1";
    div.style.boxSizing = "border-box";
    div.style.transition = "opacity 10s ease";
    div.style.opacity = "0";
    div.style.pointerEvents = "none";
    document.body.appendChild(div);
    return div;
  }
  
  const layer1 = createGradientLayer();
  const layer2 = createGradientLayer();
  let showingLayer1 = true;
  
  function updateGradient(layer) {
    const color1 = getSoftColor();
    const color2 = getSoftColor();
    layer.style.background = `radial-gradient(circle at center, ${color1}, ${color2})`;
  }
  
  function crossfadeGradients() {
    const top = showingLayer1 ? layer2 : layer1;
    const bottom = showingLayer1 ? layer1 : layer2;
  
    updateGradient(top);
    top.style.opacity = "1";
    bottom.style.opacity = "0";
    showingLayer1 = !showingLayer1;
  }
  
  updateGradient(layer1);
  layer1.style.opacity = "1";
  
  setInterval(crossfadeGradients, 8000);
  

  

  const transition = document.createElement("div");
  transition.classList.add("transition-screen");
  transition.style.display = "none";
  document.body.appendChild(transition);

  function getRandomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b})`;
  }

  function showTransition(callback) {
    const violetShades = ["#AA60C8", "#D69ADE", "#EABDE6", "#FFDFEF", "#69247C"];
  const color = violetShades[Math.floor(Math.random() * violetShades.length)];
  transition.style.backgroundColor = color;
  transition.style.display = "block";
  transition.style.animation = "waveIn 1s forwards";
  
    const movingCircle = document.createElement("div");
    movingCircle.classList.add("circle");
    document.body.appendChild(movingCircle);
  
    const oval = document.createElement("div");
    oval.classList.add("oval");
    document.body.appendChild(oval);
    requestAnimationFrame(() => {
      oval.style.opacity = "1";
    });
  
    const createCil = (x, y, rotation) => {
      const cil = document.createElement("div");
      cil.style.position = "absolute";
      cil.style.width = "24px";
      cil.style.height = "5px";
      cil.style.backgroundColor = "black";
      cil.style.top = `calc(50% + ${y}px)`;
      cil.style.left = `calc(50% + ${x}px)`;
      cil.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
      cil.style.zIndex = "1000";
      cil.style.opacity = "1";
      return cil;
    };
  
    const cilTopLeft = createCil(-40, -60, -100);
    const cilTopRight = createCil(40, -60, 100);
    const cilBottomLeft = createCil(-40, 60, 100);
    const cilBottomRight = createCil(40, 60, -100);
  
    document.body.appendChild(cilTopLeft);
    document.body.appendChild(cilTopRight);
    document.body.appendChild(cilBottomLeft);
    document.body.appendChild(cilBottomRight);
  
    let direction = 1;
    let position = 0;
    const speed = 2;
    const maxDistance = 50;
  
    function moveCircle() {
      position += direction * speed;
  
      if (position > maxDistance || position < -maxDistance) {
        direction *= -1;
      }
  
      movingCircle.style.left = `calc(50% + ${position}px)`;
      requestAnimationFrame(moveCircle);
    }
  
    moveCircle();
  
    setTimeout(() => {
      movingCircle.style.animation = "circleOut 0.5s forwards";
      oval.style.opacity = "0";
  
      cilTopLeft.style.opacity = "0";
      cilTopRight.style.opacity = "0";
      cilBottomLeft.style.opacity = "0";
      cilBottomRight.style.opacity = "0";
  
      setTimeout(() => {
        transition.style.animation = "waveOut 1s forwards";
  
        setTimeout(() => {
          callback();
        }, 50);
  
        setTimeout(() => {
          transition.style.display = "none";
          movingCircle.remove();
          oval.remove();
          cilTopLeft.remove();
          cilTopRight.remove();
          cilBottomLeft.remove();
          cilBottomRight.remove();
        }, 1000);
      }, 500);
    }, 3500);
  }
  
  

  json.forEach((item, index) => {
    const titre = item.titre || item.nom || item["nom du projet"] || item["project name"] || `Projet ${index + 1}`;

    const title = document.createElement("h2");
    title.textContent = titre;
    title.style.cursor = "pointer";
    title.style.transition = "color 0.2s ease";
    title.style.fontSize = "7rem";
    title.style.margin = "0.1rem 0";
    title.style.lineHeight = "1";
    title.style.fontFamily = "'Mansalva', sans-serif";
    title.style.letterSpacing = "0.2rem";

    function animateDistortion(el) {
      const offsetX = Math.random() * 1000;
      const offsetY = Math.random() * 1000;
      const offsetSkew = Math.random() * 1000;
      const offsetRot = Math.random() * 1000;

      const distort = () => {
        const now = Date.now();
        const scaleX = 1.5 + Math.sin((now + offsetX) * 0.002) * 0.2;
        const scaleY = 1.2 + Math.cos((now + offsetY) * 0.003) * 0.1;
        const skewX = Math.sin((now + offsetSkew) * 0.001) * 2;
        const rotate = Math.sin((now + offsetRot) * 0.0007) * 2;
        el.style.transform = `scaleX(${scaleX}) scaleY(${scaleY}) skewX(${skewX}deg) rotate(${rotate}deg)`;
        requestAnimationFrame(distort);
      };
      distort();
    }

    animateDistortion(title);

    title.addEventListener("mouseenter", () => {
      title.style.color = "#666";
      title.style.fontFamily = "'Explora', sans-serif"; 
    });
    title.addEventListener("mouseleave", () => {
      title.style.color = "";
      title.style.fontFamily = "'Mansalva', sans-serif";
    });
    title.addEventListener("click", () => {
      showTransition(() => showModal(item));
    });

    $projets.appendChild(title);
  });
});
