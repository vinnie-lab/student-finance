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




    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const form = document.getElementById('registrationForm');
    const formSections = Array.from(document.querySelectorAll('.form-section'));
    const steps = Array.from(document.querySelectorAll('.step'));
    const modal = document.getElementById('successModal');
    const closeModalBtn = document.querySelector('.modal-close-btn');
    
    let currentStep = 0;

    const updateFormState = () => {
        // Hide all sections
        formSections.forEach(section => section.classList.remove('active'));
        // Show current section
        formSections[currentStep].classList.add('active');

        // Update stepper
        steps.forEach((step, index) => {
            if (index < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });

        // Update button visibility and text
        prevBtn.style.display = currentStep > 0 ? 'block' : 'none';
        nextBtn.textContent = currentStep === formSections.length - 1 ? 'Submit' : 'Next';
    };
    
    nextBtn.addEventListener('click', () => {
        // A simple validation for the current step
        const currentSection = formSections[currentStep];
        const inputs = currentSection.querySelectorAll('input[required], select[required]');
        let isValid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'red'; // Highlight invalid fields
            } else {
                input.style.borderColor = ''; // Reset border color
            }
        });

        if (!isValid) {
            alert('Please fill all required fields in this section.');
            return;
        }

        if (currentStep < formSections.length - 1) {
            currentStep++;
            updateFormState();
        } else {
            // This is the submit button
            form.dispatchEvent(new Event('submit'));
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateFormState();
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission and page refresh
        
        // 1. Collect form data
        const formData = new FormData(form);
        const studentData = {};
        for (const [key, value] of formData.entries()) {
            // For file inputs, we just store the filename
            if (value instanceof File) {
                studentData[key] = value.name ? value.name : 'No file selected';
            } else {
                studentData[key] = value;
            }
        }

        // 2. Add System-Level Metadata
        studentData.admissionNumber = `ADM-${Date.now()}`;
        studentData.dateOfAdmission = new Date().toISOString();
        studentData.registeredBy = 'System/Self-Registration';

        // 3. Simulate saving to a JSON file (by triggering a download)
        const jsonString = JSON.stringify(studentData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'student_data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // 4. Show success modal
        modal.style.display = 'flex';
    });

    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        //Optional: reset form to the beginning
        currentStep = 0;
        form.reset();
        updateFormState();
    });

    // Initial setup
    updateFormState();
});


