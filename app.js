const narrators = [
  {
    id: "sanshin",
    name: "산신령",
    title: "수염으로 와이파이 잡는 산속 현자",
    colors: ["#d9f99d", "#166534", "#fef3c7"],
    fallback:
      "오늘은 산길처럼 굽이치지만, 걱정 말거라. 넘어질 뻔한 순간에도 체면은 살고, 간식운은 정상까지 오른다. 중요한 말은 세 번 생각하고 한 번만 보내라. 특히 단체 채팅방에서는 도토리도 신중히 굴러가야 한다.",
  },
  {
    id: "zeus",
    name: "제우스",
    title: "번개 회의 주재자",
    colors: ["#bfdbfe", "#1d4ed8", "#facc15"],
    fallback:
      "오늘의 하늘은 네 편이다. 다만 번개 같은 결정을 내리기 전 충전기는 챙겨라. 금전운은 구름 사이로 반짝이고, 연애운은 살짝 우르릉댄다. 말투만 부드럽게 하면 올림포스 고객센터도 별 다섯 개를 준다.",
  },
  {
    id: "plato",
    name: "플라톤",
    title: "동굴 밖으로 나온 철학 선생님",
    colors: ["#c4b5fd", "#5b21b6", "#fde68a"],
    fallback:
      "오늘 너의 이상은 높고 현실은 알람처럼 시끄럽다. 그래도 괜찮다. 점심 메뉴를 고르는 순간에도 진리는 반짝인다. 해야 할 일을 그림자 취급하지 말고 하나만 붙잡아라. 그 하나가 의외로 너를 현자로 만든다.",
  },
  {
    id: "caesar",
    name: "시저",
    title: "일정을 정복하러 온 장군",
    colors: ["#fecaca", "#991b1b", "#fde68a"],
    fallback:
      "왔노라, 보았노라, 할 일을 미뤘노라. 하지만 오늘은 반격의 날이다. 작은 일 하나를 끝내면 나머지가 줄줄이 항복한다. 지출은 원로원 회의처럼 길어질 수 있으니, 장바구니 앞에서 엄숙하게 거부권을 행사하라.",
  },
  {
    id: "heracles",
    name: "헤라클레스",
    title: "근육으로 운세를 여는 영웅",
    colors: ["#fed7aa", "#9a3412", "#fef08a"],
    fallback:
      "오늘의 과업은 열두 개처럼 보여도 사실 두 개 반이다. 첫 번째는 시작하기, 두 번째는 포기하지 않기, 반 개는 물 마시기다. 체력운이 좋으니 계단에게 살짝 눈빛을 보내라. 계단은 이미 졌다.",
  },
  {
    id: "cleopatra",
    name: "클레오파트라",
    title: "나일강급 존재감의 여왕",
    colors: ["#fde68a", "#0f766e", "#f472b6"],
    fallback:
      "오늘은 매력이 먼저 입장하고 네가 뒤따라간다. 사람들은 네 말의 절반만 들어도 고개를 끄덕일 가능성이 높다. 단, 쇼핑운이 왕관을 쓰려 하니 예산이라는 신하를 곁에 세워라. 품위 있게 아끼면 더 빛난다.",
  },
  {
    id: "merlin",
    name: "멀린",
    title: "냄비 대신 운명을 젓는 마법사",
    colors: ["#bae6fd", "#4338ca", "#e879f9"],
    fallback:
      "오늘은 우연이 마법인 척 다가온다. 놓친 줄 알았던 기회가 뒤늦게 문을 두드릴 수 있다. 비밀번호를 기억하는 순간처럼 짜릿한 깨달음도 있다. 단, 마법 주문보다 일정 알림이 더 강하니 켜 두어라.",
  },
];

const subtitle = document.querySelector("#subtitle");
const portrait = document.querySelector("#portrait");
const narratorName = document.querySelector("#narratorName");
const narratorTitle = document.querySelector("#narratorTitle");
const startButton = document.querySelector("#startButton");
const againButton = document.querySelector("#againButton");
const muteButton = document.querySelector("#muteButton");

let generatedFortunes = {};
let muted = false;
let activeNarrator = pickNarrator();

init();

async function init() {
  renderNarrator(activeNarrator);
  await loadGeneratedFortunes();
  startButton.addEventListener("click", playFortune);
  againButton.addEventListener("click", () => {
    speechSynthesis.cancel();
    activeNarrator = pickNarrator(activeNarrator.id);
    renderNarrator(activeNarrator);
    subtitle.textContent = `${activeNarrator.name} 님이 목을 가다듬는 중입니다.`;
  });
  muteButton.addEventListener("click", () => {
    muted = !muted;
    muteButton.textContent = muted ? "🔇" : "🔊";
    if (muted) speechSynthesis.cancel();
  });
}

async function loadGeneratedFortunes() {
  try {
    const response = await fetch(`data/fortune.json?date=${new Date().toISOString().slice(0, 10)}`, { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    generatedFortunes = data.fortunes || {};
  } catch {
    generatedFortunes = {};
  }
}

function pickNarrator(exceptId) {
  const pool = narrators.filter((item) => item.id !== exceptId);
  return pool[Math.floor(Math.random() * pool.length)];
}

function renderNarrator(narrator) {
  narratorName.textContent = narrator.name;
  narratorTitle.textContent = narrator.title;
  portrait.innerHTML = makePortrait(narrator);
}

function playFortune() {
  const text = generatedFortunes[activeNarrator.id] || activeNarrator.fallback;
  speechSynthesis.cancel();
  subtitle.textContent = "운명의 자막을 펼치는 중...";
  portrait.classList.add("speaking");
  showSubtitles(text);
  if (!muted) speak(text);
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = 0.95;
  utterance.pitch = activeNarrator.id === "zeus" || activeNarrator.id === "heracles" ? 0.82 : 1.05;
  utterance.onend = () => portrait.classList.remove("speaking");
  utterance.onerror = () => portrait.classList.remove("speaking");
  speechSynthesis.speak(utterance);
}

function showSubtitles(text) {
  const chunks = text.match(/[^.!?。]+[.!?。]?/g) || [text];
  let index = 0;
  const tick = () => {
    subtitle.textContent = chunks[index].trim();
    index += 1;
    if (index < chunks.length) {
      window.setTimeout(tick, Math.max(2100, chunks[index - 1].length * 95));
    } else {
      window.setTimeout(() => portrait.classList.remove("speaking"), 1200);
    }
  };
  tick();
}

function makePortrait(narrator) {
  const [skin, robe, accent] = narrator.colors;
  const accessory = {
    sanshin: `<path d="M80 86c24-52 76-52 100 0-27-18-73-18-100 0z" fill="#14532d"/><circle cx="82" cy="74" r="18" fill="#84cc16"/><circle cx="178" cy="74" r="18" fill="#84cc16"/>`,
    zeus: `<path d="M139 22l-22 54h25l-24 58 59-78h-28l19-34z" fill="${accent}"/>`,
    plato: `<path d="M76 72c22-38 86-52 112-8-33-10-74-7-112 8z" fill="#e5e7eb"/>`,
    caesar: `<path d="M72 68c20-34 82-48 116-4-40 4-75 2-116 4z" fill="#facc15"/><path d="M76 56c33 14 67 14 104 0" stroke="#65a30d" stroke-width="12" stroke-linecap="round"/>`,
    heracles: `<path d="M62 88c15-45 43-64 68-64s53 19 68 64c-35-19-101-19-136 0z" fill="#78350f"/>`,
    cleopatra: `<path d="M72 86c12-42 104-42 116 0V54H72z" fill="#111827"/><path d="M95 52h70l-14-22h-42z" fill="${accent}"/>`,
    merlin: `<path d="M130 14l-58 96h116z" fill="#312e81"/><circle cx="130" cy="58" r="7" fill="${accent}"/>`,
  }[narrator.id];

  return `
    <svg viewBox="0 0 260 260" role="img" aria-label="${narrator.name} 캐리커처">
      <circle cx="130" cy="130" r="116" fill="rgba(255,255,255,.12)" />
      ${accessory}
      <path d="M62 224c10-48 39-76 68-76s58 28 68 76z" fill="${robe}" />
      <circle cx="130" cy="112" r="58" fill="${skin}" />
      <circle cx="108" cy="106" r="7" fill="#111827" />
      <circle cx="152" cy="106" r="7" fill="#111827" />
      <path d="M112 136c14 12 32 12 46 0" fill="none" stroke="#111827" stroke-width="7" stroke-linecap="round" />
      <path d="M130 112l-8 18h16z" fill="rgba(15,23,42,.22)" />
      <path d="M72 162c16 30 100 30 116 0" fill="rgba(255,255,255,.22)" />
    </svg>
  `;
}
