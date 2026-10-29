const STORAGE_KEY = 'logica-spanish-state-v1';

const lessons = [
  {
    context: '讲述小时候的生活',
    sentence: 'Cuando era niño, vivía en Madrid.',
    translation: '我小时候住在马德里。',
    principleTitle: '过去不是一条线，而是一个取景框。',
    principleBody: '说话人把“小时候的生活”铺成一张背景画布：住在哪里、当时是什么状态，都在画布里持续着。未完成过去时不是“过去式清单”里的一个格子，而是<strong>把参照点放进背景里</strong>。',
    contrast: [
      ['画布', 'Cuando era niño, vivía en Madrid.', '背景状态'],
      ['一点', 'Ayer viví un momento increíble.', '一次完整事件']
    ],
    memory: '<strong>只留一组触发器：</strong>背景 → 未完成；落点 → 简单过去。词尾先从例子里长出来。',
    callout: '如果你要说“昨天我住在塞维利亚”，你会怎么摆放事件？',
    support: '先选视角，再找词尾。不要求一次说对。',
    choices: [['背景画布', '昨天的居住状态作为背景'], ['完整落点', '把“住过/住了一段”看成一个封闭事实']],
    correct: 1,
    feedback: '对。这里先把“昨天”视为一个已封闭的时间段：Ayer viví en Sevilla.'
  },
  {
    context: '表达一个还未发生的愿望',
    sentence: 'Quiero que vengas mañana.',
    translation: '我希望你明天来。',
    principleTitle: '语气不是态度标签，而是对现实的承诺程度。',
    principleBody: '“你来”在这句话里还不是说话人确认的事实，而是被愿望推动的可能世界。主句先放出愿望，后面的动作就不再由说话人直接断言。<strong>先判断：我是在陈述，还是在推动一个可能？</strong>',
    contrast: [['事实', 'Sé que vienes mañana.', '我知道你明天来'], ['愿望', 'Quiero que vengas mañana.', '我希望你明天来']],
    memory: '<strong>只留一个触发器：</strong>主句表达愿望、命令或评价时，后面的动作不当作已确认事实。',
    callout: '如果你确定“她明天来”，与“我希望她明天来”会用同一个视角吗？',
    support: '先看说话人的确定性，不要先翻变位表。',
    choices: [['同一个视角', '只要时间相同，形式就相同'], ['不同视角', '事实与愿望把动作放在不同的现实层']],
    correct: 1,
    feedback: '对。事实与愿望不是同一层现实，所以后面的动词会改变形态。'
  },
  {
    context: '说明“谁”承受动作',
    sentence: 'Le doy el libro a Ana.',
    translation: '我把书给安娜。',
    principleTitle: '代词先标记关系，再替代名词。',
    principleBody: '在这句话里，<em>le</em> 不是“多余的小词”。它先把“接收者”这个关系钉在动词上；<em>a Ana</em> 再把这个接收者说清楚。西语常常先用代词搭骨架，再用名词补充身份。',
    contrast: [['动作', 'Doy el libro.', '我给出这本书'], ['关系', 'Le doy el libro a Ana.', '动作落到安娜']],
    memory: '<strong>只留一个触发器：</strong>先问“动作落到谁/为谁”，再选择关系代词；不要把代词当成中文式的可有可无。',
    callout: '如果把“书”给安娜，你要先标记物品，还是先标记接收者？',
    support: '把句子想成箭头：谁发出，动作经过谁，落到谁。',
    choices: [['只标记物品', 'el libro 已经足够表达关系'], ['先标记接收者', 'le 先把动作的落点钉住']],
    correct: 1,
    feedback: '对。关系先被标记：Le doy…，然后再说清楚接收者是 Ana。'
  },
  {
    context: '把新信息放进共同画面',
    sentence: 'En la mesa hay un libro.',
    translation: '桌上有一本书。',
    principleTitle: '语序在管理注意力，不是在交换零件。',
    principleBody: '西语可以先把地点画出来，再把新出现的东西放进去。<em>En la mesa</em> 是共同画面，<em>un libro</em> 是此刻新增的信息。<strong>句子顺序服务于“听者现在需要知道什么”</strong>，不是机械地把中文顺序逐字搬过去。',
    contrast: [['共同画面', 'En la mesa…', '先建立地点'], ['新信息', '…hay un libro.', '再放入新对象']],
    memory: '<strong>只留一个触发器：</strong>已知场景先行，新信息后落地；需要强调时，再改变信息的焦点。',
    callout: '你要告诉朋友“厨房里有一杯咖啡”，先把哪里摆出来，还是先把物品摆出来？',
    support: '先给听者一个可以挂住新信息的场景。',
    choices: [['先说场景', 'En la cocina hay un café.'], ['先说物品', 'Un café hay en la cocina.']],
    correct: 0,
    feedback: '对。先给共同场景，再放新对象：En la cocina hay un café.'
  }
];

const defaultState = { understood: [], review: [], current: 0 };
let state = loadState();
let selectedChoice = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...defaultState, ...saved } : { ...defaultState };
  } catch { return { ...defaultState }; }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateProgress();
}

function updateProgress() {
  const done = state.understood.length;
  $('#progress-number').textContent = done;
  $('#progress-bar').style.width = `${(done / lessons.length) * 100}%`;
  $('#review-count').textContent = state.review.length;
  $('#progress-note').textContent = done === lessons.length ? '四个底层关系已经走过一遍。' : '先完成一个理解，不急着背。';
  $$('.map-row').forEach((row, index) => row.classList.toggle('done', state.understood.includes(index)));
}

function renderLesson(index = state.current) {
  state.current = (index + lessons.length) % lessons.length;
  selectedChoice = null;
  const lesson = lessons[state.current];
  $('#lesson-index').textContent = String(state.current + 1).padStart(2, '0');
  $('#lesson-context').textContent = lesson.context;
  $('#sentence').textContent = lesson.sentence;
  $('#translation').textContent = lesson.translation;
  $('#principle-title').textContent = lesson.principleTitle;
  $('#principle-body').innerHTML = lesson.principleBody;
  $('#memory-copy').innerHTML = lesson.memory;
  $('#callout-title').textContent = lesson.callout;
  $('#callout-support').textContent = lesson.support;
  $('#principle-drawer').hidden = true;
  $('#reveal-button').setAttribute('aria-expanded', 'false');
  $('#callout-zone').hidden = true;
  $('#feedback').textContent = '';
  $('#next-button').disabled = true;
  $('#understand-button').textContent = state.understood.includes(state.current) ? '已理解这一层' : '我大致看懂了';
  const contrast = $('#contrast-strip');
  contrast.innerHTML = lesson.contrast.map((item, i) => `${i ? '<div class="contrast-divider">对照</div>' : ''}<div><span>${item[0]}</span><em>${item[1]}</em><small>${item[2]}</small></div>`).join('');
  const row = $('#choice-row');
  row.innerHTML = lesson.choices.map((choice, i) => `<button class="choice" data-choice="${i}"><strong>${choice[0]}</strong><br><small>${choice[1]}</small></button>`).join('');
  $$('.choice').forEach((button) => button.addEventListener('click', () => choose(button)));
  updateProgress();
}

function choose(button) {
  selectedChoice = Number(button.dataset.choice);
  $$('.choice').forEach((item) => item.classList.toggle('selected', item === button));
  const lesson = lessons[state.current];
  $('#feedback').textContent = selectedChoice === lesson.correct ? lesson.feedback : '先别急着找词尾。再问一次：说话人把这个动作放在哪一层关系里？';
  $('#next-button').disabled = selectedChoice !== lesson.correct;
}

function markUnderstood() {
  if (!state.understood.includes(state.current)) state.understood.push(state.current);
  saveState();
  $('#understand-button').textContent = '已理解这一层';
  $('#principle-drawer').hidden = false;
  $('#reveal-button').setAttribute('aria-expanded', 'true');
  $('#callout-zone').hidden = false;
}

function showView(viewName) {
  const labels = { learn: '继续学习', map: '底层路线', review: '最小回看' };
  $$('.view').forEach((view) => { view.hidden = view.id !== `${viewName}-view`; view.classList.toggle('active', view.id === `${viewName}-view`); });
  $$('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.view === viewName));
  $('#view-title').textContent = labels[viewName];
  if (viewName === 'review') renderReview();
}

function renderReview() {
  const empty = $('#empty-review');
  const list = $('#review-list');
  empty.hidden = state.review.length > 0;
  list.hidden = state.review.length === 0;
  list.innerHTML = state.review.map((index) => `<div class="review-card"><div><h2>${lessons[index].principleTitle}</h2><p>${lessons[index].sentence}</p></div><button class="button button-quiet" data-review-index="${index}">再看一次</button></div>`).join('');
  $$('[data-review-index]').forEach((button) => button.addEventListener('click', () => { state.current = Number(button.dataset.reviewIndex); saveState(); showView('learn'); renderLesson(); }));
}

$('#understand-button').addEventListener('click', markUnderstood);
$('#reveal-button').addEventListener('click', () => {
  const drawer = $('#principle-drawer');
  drawer.hidden = !drawer.hidden;
  $('#reveal-button').setAttribute('aria-expanded', String(!drawer.hidden));
});
$('#next-button').addEventListener('click', () => {
  if (!state.understood.includes(state.current)) state.understood.push(state.current);
  saveState();
  renderLesson(state.current + 1);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
$('#skip-button').addEventListener('click', () => {
  if (!state.review.includes(state.current)) state.review.push(state.current);
  saveState();
  showView('review');
});
$$('.nav-item').forEach((item) => item.addEventListener('click', () => showView(item.dataset.view)));
$$('[data-view-target]').forEach((button) => button.addEventListener('click', () => showView(button.dataset.viewTarget)));
$$('.map-row').forEach((row) => row.addEventListener('click', () => { state.current = Number(row.dataset.lesson); saveState(); renderLesson(); showView('learn'); }));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && document.activeElement?.classList.contains('lesson-console')) markUnderstood();
});

renderLesson();
