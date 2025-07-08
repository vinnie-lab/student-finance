// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Sidebar Toggle Functionality ---
    const menuToggle = document.getElementById('menu-toggle');
    const sidebarCloseBtn = document.getElementById('sidebar-close');
    const body = document.body;

    // Hamburger menu opens the sidebar
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            body.classList.remove('sidebar-collapsed');
        });
    }

    // 'X' button closes the sidebar
    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', () => {
            body.classList.add('sidebar-collapsed');
        });
    }

    // --- Student View Modal Functionality (Unchanged) ---
    const modalOverlay = document.getElementById('student-modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close');
    const viewStudentBtns = document.querySelectorAll('.view-student-btn');

    const openModal = (studentData) => {
        if (!modalOverlay) return;
        document.getElementById('modal-student-name').textContent = studentData.name;
        document.getElementById('modal-student-id').textContent = studentData.id;
        document.getElementById('modal-student-email').textContent = studentData.email;
        document.getElementById('modal-student-course').textContent = studentData.course;
        document.getElementById('modal-student-balance').textContent = studentData.balance;
        document.getElementById('modal-student-status').textContent = studentData.status;
        const balanceEl = document.getElementById('modal-student-balance');
        balanceEl.style.color = parseFloat(studentData.balance.replace('$', '')) > 0 ? 'var(--error)' : 'var(--success)';
        modalOverlay.classList.add('visible');
    };

    const closeModal = () => {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('visible');
    };

    viewStudentBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const studentRow = btn.closest('tr');
            const studentData = {
                name: studentRow.dataset.name, id: studentRow.dataset.id, email: studentRow.dataset.email,
                course: studentRow.dataset.course, balance: studentRow.dataset.balance, status: studentRow.dataset.status
            };
            openModal(studentData);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
});