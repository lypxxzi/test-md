function toast(message) {
  const node = document.querySelector('.toast') || document.body.appendChild(Object.assign(document.createElement('div'), { className: 'toast' }));
  node.textContent = message;
  node.style.display = 'block';
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => node.style.display = 'none', 1800);
}

function openLayer(id) {
  const node = document.getElementById(id);
  if (node) node.classList.add('show');
}

function closeLayer(el) {
  const layer = el.closest('.modal-mask,.drawer-mask');
  if (layer) layer.classList.remove('show');
}

function filterTable(input) {
  const keyword = input.value.trim().toLowerCase();
  document.querySelectorAll('[data-filter-row]').forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(keyword) ? '' : 'none';
  });
}

function initPrototype(config = {}) {
  document.querySelectorAll('[data-menu]').forEach(link => {
    if (link.dataset.menu === config.active) link.classList.add('active');
  });
  document.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', () => openLayer(btn.dataset.open));
  });
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeLayer(btn));
  });
  document.querySelectorAll('[data-toast]').forEach(btn => {
    btn.addEventListener('click', () => toast(btn.dataset.toast));
  });
  document.querySelectorAll('[data-show-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.dataset.hideTarget?.split(',').forEach(id => document.getElementById(id.trim())?.classList.add('is-hidden'));
      btn.dataset.showTarget.split(',').forEach(id => document.getElementById(id.trim())?.classList.remove('is-hidden'));
    });
  });
  document.querySelectorAll('[data-filter]').forEach(input => {
    input.addEventListener('input', () => filterTable(input));
  });
  document.querySelectorAll('.pill-tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.parentElement.querySelectorAll('button').forEach(item => item.classList.remove('active'));
      btn.classList.add('active');
      toast(`已切换到：${btn.textContent.trim()}`);
    });
  });
  document.querySelectorAll('[data-chat-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-chat-type]').forEach(item => item.classList.remove('active'));
      btn.classList.add('active');
      const label = document.getElementById('activeChatType');
      const scope = document.getElementById('activeScope');
      if (label) label.textContent = btn.dataset.chatType === 'USER_KB' ? '用户知识库' : '运营知识库';
      if (scope) scope.textContent = btn.dataset.chatType === 'USER_KB' ? '仅检索当前用户有权限的公司文件' : '检索平台维护的系统操作说明';
      toast(`本轮对话将使用：${btn.textContent.trim()}`);
    });
  });
}

function showCitations() {
  document.getElementById('chatLayout')?.classList.remove('no-reference');
  document.getElementById('referencePanel')?.classList.remove('is-hidden');
  toast('已展开引用来源');
}

function sendMockMessage() {
  const input = document.getElementById('chatText');
  const list = document.getElementById('messageArea');
  const empty = document.getElementById('chatEmpty');
  if (!input || !list || !input.value.trim()) return;
  if (empty) empty.classList.add('is-hidden');
  const user = document.createElement('div');
  user.className = 'bubble user';
  user.textContent = input.value.trim();
  list.appendChild(user);
  input.value = '';
  const ai = document.createElement('div');
  ai.className = 'bubble ai';
  const activeType = document.querySelector('[data-chat-type].active')?.textContent.trim() || '问公司文件';
  ai.innerHTML = `根据本轮选择的 <b>${activeType}</b>，乳化搅拌温度建议控制在 <b>60-65℃</b>，搅拌完成后需静置脱泡 15 分钟。<div class="hint" style="margin-top:8px">本次消耗 1,280 token <button class="citation-btn" onclick="showCitations()">引用来源</button></div>`;
  setTimeout(() => {
    list.appendChild(ai);
    list.scrollTop = list.scrollHeight;
    toast('AI 回复已生成，token 已计入公司月汇总');
  }, 360);
}
