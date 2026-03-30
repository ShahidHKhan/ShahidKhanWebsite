const explorerToggle = document.getElementById('explorerToggle');
const explorerPanel = document.getElementById('explorerPanel');
const explorerLinks = document.querySelectorAll('.explorer-link');
const terminalLog = document.getElementById('terminalLog');
const revealItems = document.querySelectorAll('.reveal');
const projectHeaders = document.querySelectorAll('.project-header');

const currentPage = window.location.pathname.split('/').pop() || 'index.html';

if (explorerToggle && explorerPanel) {
  explorerToggle.addEventListener('click', () => {
    explorerPanel.classList.toggle('open');
  });
}

// Project dropdown functionality
projectHeaders.forEach((header) => {
  header.addEventListener('click', () => {
    const projectId = header.dataset.project;
    const projectContent = document.getElementById(projectId);
    
    if (projectContent) {
      // Close all other projects
      projectHeaders.forEach((otherHeader) => {
        if (otherHeader !== header) {
          otherHeader.classList.remove('active');
          const otherId = otherHeader.dataset.project;
          const otherContent = document.getElementById(otherId);
          if (otherContent) {
            otherContent.classList.remove('active');
          }
        }
      });
      
      // Toggle current project
      header.classList.toggle('active');
      projectContent.classList.toggle('active');
    }
  });
});

const appendTerminalLine = (text, className = '') => {
  if (!terminalLog) {
    return;
  }

  const line = document.createElement('p');
  if (className) {
    line.classList.add(className);
  }
  line.textContent = text;
  terminalLog.appendChild(line);
  terminalLog.scrollTop = terminalLog.scrollHeight;
};

explorerLinks.forEach((link) => {
  const href = link.getAttribute('href');
  if (href === currentPage) {
    link.classList.add('active');
  }

  link.addEventListener('click', (event) => {
    const cmd = link.dataset.cmd || `open ${href}`;
    sessionStorage.setItem('lastExplorerCommand', cmd);

    if (href === currentPage) {
      event.preventDefault();
      appendTerminalLine(`guest@portfolio:~$ ${cmd}`);
      appendTerminalLine('already open', 'success');
    }
  });
});

const lastCommand = sessionStorage.getItem('lastExplorerCommand');
if (lastCommand) {
  appendTerminalLine(`guest@portfolio:~$ ${lastCommand}`);
  appendTerminalLine('opened successfully', 'success');
  sessionStorage.removeItem('lastExplorerCommand');
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));
