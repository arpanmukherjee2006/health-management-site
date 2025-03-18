// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('.sidebar nav ul li a');
    const sections = document.querySelectorAll('section');
    
    // Form elements
    const healthDataForm = document.getElementById('health-data-form');
    const facilitySelect = document.getElementById('facility');
    const departmentSelect = document.getElementById('department');
    const programSelect = document.getElementById('program');
    const metricSelect = document.getElementById('metric');
    const valueInput = document.getElementById('value');
    const dateInput = document.getElementById('date');
    
    // Tables
    const recentActivityTable = document.getElementById('recent-activity-data');
    const recentlyAddedTable = document.getElementById('recently-added-data');
    
    // Toast
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    // Sample Data
    let healthData = [
        { id: 1, facility: 'City General Hospital', department: 'Pediatrics', program: 'Immunization', metric: 'Vaccinations', value: 256, date: '2025-03-10' },
        { id: 2, facility: 'Rural Health Center', department: 'Maternal Health', program: 'Prenatal Care', metric: 'Checkups', value: 189, date: '2025-03-12' },
        { id: 3, facility: 'Community Clinic', department: 'Nutrition', program: 'Nutrition Support', metric: 'Beneficiaries', value: 142, date: '2025-03-15' },
        { id: 4, facility: 'City General Hospital', department: 'Immunization', program: 'Immunization', metric: 'Sessions', value: 45, date: '2025-03-16' },
        { id: 5, facility: 'Rural Health Center', department: 'Pediatrics', program: 'Health Screening', metric: 'Beneficiaries', value: 210, date: '2025-03-17' }
    ];
    
    // Set current date as default for date input
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    
    // Navigation functionality
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active link
            navLinks.forEach(link => {
                link.parentElement.classList.remove('active');
            });
            this.parentElement.classList.add('active');
            
            // Show active section
            const targetId = this.getAttribute('href').substring(1);
            sections.forEach(section => {
                section.classList.remove('active-section');
                if (section.id === targetId) {
                    section.classList.add('active-section');
                }
            });
        });
    });
    
    // Populate tables with initial data
    function populateTables() {
        // Sort data by date (most recent first)
        const sortedData = [...healthData].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Clear tables
        recentActivityTable.innerHTML = '';
        recentlyAddedTable.innerHTML = '';
        
        // Populate recent activity table (dashboard)
        sortedData.slice(0, 5).forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.facility}</td>
                <td>${item.department}</td>
                <td>${item.program}</td>
                <td>${item.metric}</td>
                <td>${item.value}</td>
                <td>${formatDate(item.date)}</td>
            `;
            recentActivityTable.appendChild(row);
        });
        
        // Populate recently added table (data entry)
        sortedData.slice(0, 7).forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.facility}</td>
                <td>${item.department}</td>
                <td>${item.program}</td>
                <td>${item.metric}</td>
                <td>${item.value}</td>
                <td>${formatDate(item.date)}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            recentlyAddedTable.appendChild(row);
        });
        
        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                editRecord(id);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deleteRecord(id);
            });
        });
    }
    
    // Format date for display
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    // Handle form submission
    healthDataForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const newData = {
            id: Date.now(), // Use timestamp as ID
            facility: getFacilityName(facilitySelect.value),
            department: departmentSelect.options[departmentSelect.selectedIndex].text,
            program: programSelect.options[programSelect.selectedIndex].text,
            metric: metricSelect.options[metricSelect.selectedIndex].text,
            value: parseInt(valueInput.value),
            date: dateInput.value,
            notes: document.getElementById('notes').value
        };
        
        // Add new data
        healthData.unshift(newData);
        
        // Update tables
        populateTables();
        
        // Reset form
        healthDataForm.reset();
        dateInput.value = today;
        
        // Show success toast
        showToast('Data submitted successfully!');
    });
    
    // Get facility name from value
    function getFacilityName(value) {
        const facilityMap = {
            'city-general': 'City General Hospital',
            'rural-health': 'Rural Health Center',
            'community-clinic': 'Community Clinic'
        };
        return facilityMap[value] || 'Unknown Facility';
    }
    
    // Edit record
    function editRecord(id) {
        const record = healthData.find(item => item.id === id);
        if (!record) return;
        
        // Map facility name back to value
        const facilityValue = Object.entries({
            'city-general': 'City General Hospital',
            'rural-health': 'Rural Health Center',
            'community-clinic': 'Community Clinic'
        }).find(([key, value]) => value === record.facility)?.[0] || '';
        
        // Populate form with record data
        facilitySelect.value = facilityValue;
        
        // Find options by text
        setSelectByText(departmentSelect, record.department);
        setSelectByText(programSelect, record.program);
        setSelectByText(metricSelect, record.metric);
        
        valueInput.value = record.value;
        dateInput.value = record.date;
        document.getElementById('notes').value = record.notes || '';
        
        // Remove record from array (will be added back on submit)
        healthData = healthData.filter(item => item.id !== id);
        
        // Scroll to form
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
        
        // Show toast
        showToast('Record loaded for editing');
    }
    
    // Set select by option text
    function setSelectByText(select, text) {
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].text === text) {
                select.selectedIndex = i;
                return;
            }
        }
    }
    
    // Delete record
    function deleteRecord(id) {
        if (confirm('Are you sure you want to delete this record?')) {
            healthData = healthData.filter(item => item.id !== id);
            populateTables();
            showToast('Record deleted successfully');
        }
    }
    
    // Show toast notification
    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Initialize charts
    function initCharts() {
        // Simple placeholder charts using canvas
        const performanceChart = document.getElementById('performance-chart');
        const geoChart = document.getElementById('geo-chart');
        
        if (performanceChart) {
            performanceChart.innerHTML = `
                <div style="height: 250px; display: flex; flex-direction: column; justify-content: space-between;">
                    <div style="height: 80%; display: flex; align-items: flex-end; justify-content: space-around;">
                        <div style="width: 10%; height: 65%; background: var(--primary-gradient); border-radius: 5px 5px 0 0;"></div>
                        <div style="width: 10%; height: 80%; background: var(--primary-gradient); border-radius: 5px 5px 0 0;"></div>
                        <div style="width: 10%; height: 75%; background: var(--primary-gradient); border-radius: 5px 5px 0 0;"></div>
                        <div style="width: 10%; height: 85%; background: var(--primary-gradient); border-radius: 5px 5px 0 0;"></div>
                        <div style="width: 10%; height: 70%; background: var(--primary-gradient); border-radius: 5px 5px 0 0;"></div>
                        <div style="width: 10%; height: 90%; background: var(--primary-gradient); border-radius: 5px 5px 0 0;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-around; color: var(--text-light); font-size: 0.8rem;">
                        <div>Immunization</div>
                        <div>Prenatal</div>
                        <div>Nutrition</div>
                        <div>Screening</div>
                        <div>Maternal</div>
                        <div>Pediatric</div>
                    </div>
                </div>
            `;
        }
        
        if (geoChart) {
            geoChart.innerHTML = `
                <div style="height: 250px; display: flex; justify-content: center; align-items: center;">
                    <svg width="220" height="220" viewBox="0 0 220 220">
                        <circle cx="110" cy="110" r="100" fill="#f5f5f5" stroke="#ddd" />
                        <path d="M110,110 L110,10 A100,100 0 0,1 193,150 z" fill="#ff7b00" opacity="0.8" />
                        <path d="M110,110 L193,150 A100,100 0 0,1 27,150 z" fill="#ff9d45" opacity="0.8" />
                        <path d="M110,110 L27,150 A100,100 0 0,1 110,10 z" fill="#ffb067" opacity="0.8" />
                        <circle cx="110" cy="110" r="40" fill="white" />
                        <text x="22" y="110" fill="Black" font-weight="bold">Urban </text>
                        <text x="152" y="110" fill="Black" font-weight="bold">Rural</text>
                        <text x="72" y="170" fill="Black" font-weight="bold">Semi-Urban</text>
                    </svg>
                </div>
            `;
        }
    }
    
    // Calendar picker setup (simplified version)
    function setupDatePickers() {
        // This would typically use a date picker library
        // For simplicity, we're using the native date input
    }
    
    // Add dynamic behavior to form selects
    function setupFormDependencies() {
        departmentSelect.addEventListener('change', function() {
            // Update available programs based on department
            const department = this.value;
            programSelect.innerHTML = '<option value="">Select Program</option>';
            
            // Different program options based on department
            let programs = [];
            
            switch(department) {
                case 'pediatrics':
                    programs = [
                        { value: 'immunization', text: 'Immunization' },
                        { value: 'nutrition', text: 'Nutrition Support' },
                        { value: 'screening', text: 'Health Screening' }
                    ];
                    break;
                case 'maternal':
                    programs = [
                        { value: 'prenatal', text: 'Prenatal Care' },
                        { value: 'postnatal', text: 'Postnatal Care' },
                        { value: 'nutrition', text: 'Nutrition Support' }
                    ];
                    break;
                case 'immunization':
                    programs = [
                        { value: 'immunization', text: 'Immunization' },
                        { value: 'awareness', text: 'Awareness Programs' }
                    ];
                    break;
                case 'nutrition':
                    programs = [
                        { value: 'nutrition', text: 'Nutrition Support' },
                        { value: 'education', text: 'Nutrition Education' },
                        { value: 'screening', text: 'Malnutrition Screening' }
                    ];
                    break;
                default:
                    programs = [
                        { value: 'immunization', text: 'Immunization' },
                        { value: 'prenatal', text: 'Prenatal Care' },
                        { value: 'nutrition', text: 'Nutrition Support' },
                        { value: 'screening', text: 'Health Screening' }
                    ];
            }
            
            // Add program options
            programs.forEach(program => {
                const option = document.createElement('option');
                option.value = program.value;
                option.textContent = program.text;
                programSelect.appendChild(option);
            });
        });
        
        programSelect.addEventListener('change', function() {
            // Update available metrics based on program
            const program = this.value;
            metricSelect.innerHTML = '<option value="">Select Metric</option>';
            
            // Different metric options based on program
            let metrics = [];
            
            switch(program) {
                case 'immunization':
                    metrics = [
                        { value: 'vaccinations', text: 'Vaccinations' },
                        { value: 'sessions', text: 'Sessions' },
                        { value: 'coverage', text: 'Coverage Rate (%)' }
                    ];
                    break;
                case 'prenatal':
                case 'postnatal':
                    metrics = [
                        { value: 'checkups', text: 'Checkups' },
                        { value: 'beneficiaries', text: 'Beneficiaries' },
                        { value: 'complications', text: 'Complications Reported' }
                    ];
                    break;
                case 'nutrition':
                    metrics = [
                        { value: 'beneficiaries', text: 'Beneficiaries' },
                        { value: 'supplements', text: 'Supplements Distributed' },
                        { value: 'screening', text: 'Screenings Performed' }
                    ];
                    break;
                case 'screening':
                    metrics = [
                        { value: 'sessions', text: 'Sessions' },
                        { value: 'beneficiaries', text: 'Beneficiaries' },
                        { value: 'referrals', text: 'Referrals' }
                    ];
                    break;
                default:
                    metrics = [
                        { value: 'vaccinations', text: 'Vaccinations' },
                        { value: 'checkups', text: 'Checkups' },
                        { value: 'beneficiaries', text: 'Beneficiaries' },
                        { value: 'sessions', text: 'Sessions' }
                    ];
            }
            
            // Add metric options
            metrics.forEach(metric => {
                const option = document.createElement('option');
                option.value = metric.value;
                option.textContent = metric.text;
                metricSelect.appendChild(option);
            });
        });
    }
    
    // Function to simulate real-time data updates
    function setupDataSimulation() {
        // Every minute, add a random data point to simulate real-time updates
        setInterval(() => {
            const facilities = ['City General Hospital', 'Rural Health Center', 'Community Clinic'];
            const departments = ['Pediatrics', 'Maternal Health', 'Immunization', 'Nutrition'];
            const programs = ['Immunization', 'Prenatal Care', 'Nutrition Support', 'Health Screening'];
            const metrics = ['Vaccinations', 'Checkups', 'Beneficiaries', 'Sessions'];
            
            // Generate random data
            const newData = {
                id: Date.now(),
                facility: facilities[Math.floor(Math.random() * facilities.length)],
                department: departments[Math.floor(Math.random() * departments.length)],
                program: programs[Math.floor(Math.random() * programs.length)],
                metric: metrics[Math.floor(Math.random() * metrics.length)],
                value: Math.floor(Math.random() * 100) + 50,
                date: new Date().toISOString().split('T')[0]
            };
            
            // Add to data array
            healthData.unshift(newData);
            
            // Keep array at reasonable size
            if (healthData.length > 100) {
                healthData.pop();
            }
            
            // Update tables
            populateTables();
            
            // Show toast for super admin view
            if (document.querySelector('.section-header h1').textContent.includes('Dashboard')) {
                showToast('New data received from ' + newData.facility);
            }
        }, 60000); // Every minute
    }
    
    // Initialize the application
    function init() {
        populateTables();
        initCharts();
        setupDatePickers();
        setupFormDependencies();
        setupDataSimulation();
        
        // Set dashboard as active by default
        document.querySelector('section#dashboard').classList.add('active-section');
        document.querySelector('.sidebar nav ul li:first-child').classList.add('active');
    }
    
    // Start the application
    init();
});

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const menuToggle = document.querySelector('.menu-toggle');
    
    // Create sidebar overlay for mobile
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    // Toggle sidebar function
    function toggleSidebar() {
        sidebar.classList.toggle('expanded');
        mainContent.classList.toggle('expanded');
        overlay.classList.toggle('show');
    }
    
    // Add event listener to menu toggle button
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }
    
    // Close sidebar when clicking on overlay
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('expanded');
        mainContent.classList.remove('expanded');
        overlay.classList.remove('show');
    });
    
    // Add ability to close sidebar by swiping left on mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    sidebar.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    sidebar.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        if (touchStartX - touchEndX > 50) {
            // Swiped left
            sidebar.classList.remove('expanded');
            mainContent.classList.remove('expanded');
            overlay.classList.remove('show');
        }
    }
    
    // Close sidebar when a menu item is clicked on mobile
    const menuItems = document.querySelectorAll('.sidebar nav ul li a');
    if (window.innerWidth <= 576) {
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                sidebar.classList.remove('expanded');
                mainContent.classList.remove('expanded');
                overlay.classList.remove('show');
            });
        });
    }
    
    // Adjust layout on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('expanded');
            mainContent.classList.remove('expanded');
            overlay.classList.remove('show');
        }
    });
});