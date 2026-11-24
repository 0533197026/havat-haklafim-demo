const loginTabs = document.querySelectorAll('.tab-btn');
const loginPanels = document.querySelectorAll('.login-panel');
const studentSuggestions = document.getElementById('studentSuggestions');
const studentSearchInput = document.getElementById('studentSearch');
const studentNames = ['נועה כהן', 'איתן לוי', 'ליאון כהן', 'מיה שמיר', 'יונתן בר', 'דניאל גולן', 'עילי נבו', 'רוני יוסף'];

const showLoginTab = (tab) => {
  loginTabs.forEach((button) => {
    button.classList.toggle('active', button.dataset.tab === tab);
  });

  loginPanels.forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.panel === tab);
  });
};

loginTabs.forEach((button) => {
  button.addEventListener('click', () => showLoginTab(button.dataset.tab));
});

const handleStudentSearch = () => {
  const value = studentSearchInput.value.trim();
  if (!value) {
    studentSuggestions.classList.remove('show');
    studentSuggestions.innerHTML = '';
    return;
  }

  const matches = studentNames.filter((name) => name.includes(value));
  studentSuggestions.innerHTML = matches
    .map((name) => `<div class="suggestion-item" data-name="${name}">${name}</div>`)
    .join('') || '<div class="suggestion-item">לא נמצאו תוצאות</div>';

  studentSuggestions.classList.add('show');

  studentSuggestions.querySelectorAll('.suggestion-item').forEach((item) => {
    item.addEventListener('click', () => {
      studentSearchInput.value = item.dataset.name;
      studentSuggestions.classList.remove('show');
    });
  });
};

studentSearchInput.addEventListener('input', handleStudentSearch);

const loginButton = document.querySelector('.student-btn');
loginButton.addEventListener('click', () => {
  const name = studentSearchInput.value.trim();
  if (!name) {
    alert('אנא בחר שם לתצוגת ההדגמה');
    return;
  }

  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
});

document.querySelector('.admin-btn').addEventListener('click', () => {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  document.getElementById('admin-panel').classList.remove('hidden');
});

document.querySelector('.teacher-btn').addEventListener('click', () => {
  const grade = document.getElementById('teacherGrade').value;
  if (!grade) {
    alert('בחר כיתה לתצוגת ההדגמה');
    return;
  }

  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
});

const adminTabs = document.querySelectorAll('.admin-tab');
const adminPanels = document.querySelectorAll('.admin-tab-content');

adminTabs.forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.tab;
    adminTabs.forEach((btn) => btn.classList.toggle('active', btn === button));
    adminPanels.forEach((panel) => {
      panel.classList.toggle('hidden', panel.dataset.panel !== target);
    });
  });
});

const studentTableBody = document.querySelector('#admin-students tbody');
const adminSearch = document.getElementById('admin-search');
const classFilters = document.querySelectorAll('.chip');

const filterStudents = () => {
  const searchTerm = adminSearch.value.trim().toLocaleLowerCase();
  const selectedGrade = document.querySelector('.chip.active')?.dataset.grade || '';

  studentTableBody.querySelectorAll('tr').forEach((row) => {
    const matchesName = row.dataset.name.toLocaleLowerCase().includes(searchTerm);
    const matchesGrade = !selectedGrade || row.dataset.grade === selectedGrade;
    row.hidden = !matchesName || !matchesGrade;
  });
};

adminSearch.addEventListener('input', filterStudents);
classFilters.forEach((button) => {
  button.addEventListener('click', () => {
    classFilters.forEach((filter) => filter.classList.toggle('active', filter === button));
    filterStudents();
  });
});

document.getElementById('add-student-button').addEventListener('click', () => {
  const nameInput = document.getElementById('new-student-name');
  const gradeInput = document.getElementById('new-student-grade');
  const name = nameInput.value.trim();
  const grade = gradeInput.value;

  if (!name || !grade) {
    alert('יש למלא שם ולבחור כיתה');
    return;
  }

  const row = document.createElement('tr');
  row.dataset.name = name;
  row.dataset.grade = grade;
  row.innerHTML = `<td></td><td></td><td>1</td><td>0</td><td><span class="status ok">פעיל</span></td>`;
  row.cells[0].textContent = name;
  row.cells[1].textContent = grade;
  studentTableBody.append(row);
  nameInput.value = '';
  gradeInput.value = '';
  showAdminTab('students');
  filterStudents();
});

function showAdminTab(tab) {
  adminTabs.forEach((button) => button.classList.toggle('active', button.dataset.tab === tab));
  adminPanels.forEach((panel) => panel.classList.toggle('hidden', panel.dataset.panel !== tab));
}

const bagDialog = document.getElementById('bag-dialog');
document.getElementById('open-bag').addEventListener('click', () => bagDialog.classList.remove('hidden'));
document.getElementById('bag-action').addEventListener('click', () => bagDialog.classList.remove('hidden'));
document.getElementById('close-bag').addEventListener('click', () => bagDialog.classList.add('hidden'));
bagDialog.addEventListener('click', (event) => {
  if (event.target === bagDialog) bagDialog.classList.add('hidden');
});

const shopDialog = document.getElementById('shop-dialog');
document.getElementById('shop-action').addEventListener('click', () => shopDialog.classList.remove('hidden'));
document.querySelectorAll('[data-close-dialog]').forEach((button) => {
  button.addEventListener('click', () => {
    document.getElementById(button.dataset.closeDialog).classList.add('hidden');
  });
});
shopDialog.addEventListener('click', (event) => {
  if (event.target === shopDialog) shopDialog.classList.add('hidden');
});

const gameNotice = document.getElementById('game-notice');
let noticeTimeout;
const showGameNotice = (message) => {
  gameNotice.textContent = message;
  gameNotice.classList.remove('hidden');
  window.clearTimeout(noticeTimeout);
  noticeTimeout = window.setTimeout(() => gameNotice.classList.add('hidden'), 4200);
};

let battleMode = false;
document.getElementById('battle-action').addEventListener('click', () => {
  battleMode = !battleMode;
  document.querySelectorAll('.game-card').forEach((card) => card.classList.toggle('pick-mode', battleMode));
  showGameNotice(battleMode ? 'בחרו קלף לאתגר הדגמה ⚔️' : 'מצב הקרב נסגר');
});
document.querySelectorAll('.game-card').forEach((card) => {
  card.addEventListener('click', () => {
    if (battleMode) {
      battleMode = false;
      document.querySelectorAll('.game-card').forEach((item) => item.classList.remove('pick-mode'));
      showGameNotice(`האתגר נגד ${card.querySelector('.card-front h3').textContent} מוכן! (הדגמה)`);
      return;
    }
    card.classList.toggle('flipped');
  });
});
document.getElementById('skills-action').addEventListener('click', () => {
  showGameNotice('מיומנות זמינה: קפיצה חכמה ✨ (הדגמה)');
});

document.getElementById('save-campaign').addEventListener('click', () => {
  const message = document.getElementById('campaign-message').value.trim();
  if (!message) {
    alert('כתבו הודעת מבצע לפני הפרסום');
    return;
  }
  localStorage.setItem('farm_campaign_demo', message);
  showAdminTab('students');
  showGameNotice(`🏆 מבצע חדש: ${message}`);
});

document.getElementById('send-flash').addEventListener('click', () => {
  const message = document.getElementById('flash-message').value.trim();
  if (!message) {
    alert('כתבו הודעה לפני השליחה');
    return;
  }
  showAdminTab('students');
  showGameNotice(`📢 ${message}`);
  document.getElementById('flash-message').value = '';
});

document.querySelectorAll('.nav-dot').forEach((dot, index) => {
  dot.addEventListener('click', () => {
    document.querySelectorAll('.nav-dot').forEach((item) => item.classList.toggle('active', item === dot));
    document.querySelector('.creature-image').textContent = ['🐸', '🦊', '🦉'][index];
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    bagDialog.classList.add('hidden');
    shopDialog.classList.add('hidden');
  }
});

window.logout = function logout() {
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('admin-panel').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('studentSearch').value = '';
  studentSuggestions.classList.remove('show');
  studentSuggestions.innerHTML = '';
  document.getElementById('admin-panel').classList.add('hidden');
  bagDialog.classList.add('hidden');
  shopDialog.classList.add('hidden');
  battleMode = false;
  document.querySelectorAll('.game-card').forEach((card) => card.classList.remove('pick-mode'));
};

window.addEventListener('click', (event) => {
  if (!studentSuggestions.contains(event.target) && event.target !== studentSearchInput) {
    studentSuggestions.classList.remove('show');
  }
});
