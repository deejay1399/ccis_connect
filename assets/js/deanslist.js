// DEAN'S LIST MANAGEMENT SYSTEM - WITH DROPDOWN PROGRAM & YEAR LEVEL FILTERS
$(document).ready(function() {
    console.log('🎓 Dean\'s List System - Starting initialization...');

    // ✅ FIXED: ENHANCED DATA STRUCTURE WITH YEAR LEVELS
    const initializeDeansListData = function() {
        console.log('📁 Initializing Dean\'s List data with year levels...');
        
        const initialData = {
            // Academic Year 2024-2025
            '2024-2025': {
                academicYear: 'Academic Year 2024-2025',
                programs: [
                    {
                        name: 'BSCS Program',
                        achievers: [
                            {
                                id: 1,
                                name: 'Maria Cristina Santos',
                                yearLevel: '4th Year',
                                gwa: 1.25,
                                honors: 'Summa Cum Laude',
                                profilePic: '2.jpg',
                                achievements: ['President\'s Lister 3 consecutive semesters', 'Research Paper Presenter', 'Programming Competition Champion']
                            },
                            {
                                id: 2,
                                name: 'Juan Dela Cruz',
                                yearLevel: '3rd Year',
                                gwa: 1.35,
                                honors: 'Magna Cum Laude',
                                profilePic: '3.jpg',
                                achievements: ['Math Excellence Award', 'Dean\'s Lister 2 semesters']
                            },
                            {
                                id: 3,
                                name: 'Pedro Garcia',
                                yearLevel: '2nd Year',
                                gwa: 1.45,
                                honors: 'Cum Laude',
                                profilePic: '8.jpg',
                                achievements: ['Outstanding Performance in Algorithms']
                            },
                            {
                                id: 4,
                                name: 'Sophia Rodriguez',
                                yearLevel: '1st Year',
                                gwa: 1.28,
                                honors: 'Summa Cum Laude',
                                profilePic: '10.jpg',
                                achievements: ['Best Thesis Award', 'International Research Presenter']
                            }
                        ]
                    },
                    {
                        name: 'BSIT Program',
                        achievers: [
                            {
                                id: 5,
                                name: 'Amanda Grace Wilson',
                                yearLevel: '3rd Year',
                                gwa: 1.36,
                                honors: 'Magna Cum Laude',
                                profilePic: '13.jpg',
                                achievements: ['Web Development Competition Champion', 'UI/UX Design Excellence']
                            },
                            {
                                id: 6,
                                name: 'Carlos Miguel Reyes',
                                yearLevel: '4th Year',
                                gwa: 1.48,
                                honors: 'Cum Laude',
                                profilePic: '14.jpg',
                                achievements: ['Database Design Excellence', 'IT Project Management Award']
                            },
                            {
                                id: 7,
                                name: 'Elena Marie Tan',
                                yearLevel: '2nd Year',
                                gwa: 1.42,
                                honors: 'Magna Cum Laude',
                                profilePic: '18.jpg',
                                achievements: ['Network Security Excellence', 'Ethical Hacking Competition Winner']
                            },
                            {
                                id: 8,
                                name: 'James Patrick Lim',
                                yearLevel: '1st Year',
                                gwa: 1.39,
                                honors: 'Magna Cum Laude',
                                profilePic: '20.jpg',
                                achievements: ['Freshman Excellence Award', 'Programming Rookie of the Year']
                            }
                        ]
                    }
                ]
            },
            // Academic Year 2023-2024
            '2023-2024': {
                academicYear: 'Academic Year 2023-2024',
                programs: [
                    {
                        name: 'BSCS Program',
                        achievers: [
                            {
                                id: 9,
                                name: 'Stephanie Marie Wong',
                                yearLevel: '4th Year',
                                gwa: 1.31,
                                honors: 'Summa Cum Laude',
                                profilePic: '21.jpg',
                                achievements: ['Best Capstone Project', 'AI Research Paper Award']
                            },
                            {
                                id: 10,
                                name: 'Michael Johnson',
                                yearLevel: '3rd Year',
                                gwa: 1.42,
                                honors: 'Cum Laude',
                                profilePic: '22.jpg',
                                achievements: ['Mobile App Development Award', 'Startup Competition Finalist']
                            },
                            {
                                id: 11,
                                name: 'Sarah Miller',
                                yearLevel: '2nd Year',
                                gwa: 1.45,
                                honors: 'Cum Laude',
                                profilePic: '23.jpg',
                                achievements: ['Data Structures Mastery Award']
                            },
                            {
                                id: 12,
                                name: 'Robert Chen',
                                yearLevel: '1st Year',
                                gwa: 1.38,
                                honors: 'Magna Cum Laude',
                                profilePic: '24.jpg',
                                achievements: ['Mathematics Excellence Award']
                            }
                        ]
                    },
                    {
                        name: 'BSIT Program',
                        achievers: [
                            {
                                id: 13,
                                name: 'Brian Joseph Adams',
                                yearLevel: '3rd Year',
                                gwa: 1.38,
                                honors: 'Magna Cum Laude',
                                profilePic: '25.jpg',
                                achievements: ['Systems Analysis Excellence', 'Database Optimization Award']
                            },
                            {
                                id: 14,
                                name: 'David Wilson',
                                yearLevel: '4th Year',
                                gwa: 1.29,
                                honors: 'Summa Cum Laude',
                                profilePic: '26.jpg',
                                achievements: ['Outstanding IT Student Award', 'Industry Partnership Excellence']
                            },
                            {
                                id: 15,
                                name: 'Lisa Thompson',
                                yearLevel: '2nd Year',
                                gwa: 1.44,
                                honors: 'Cum Laude',
                                profilePic: '27.jpg',
                                achievements: ['Web Design Excellence Award']
                            },
                            {
                                id: 16,
                                name: 'Mark Rodriguez',
                                yearLevel: '1st Year',
                                gwa: 1.47,
                                honors: 'Cum Laude',
                                profilePic: '28.jpg',
                                achievements: ['IT Fundamentals Excellence']
                            }
                        ]
                    }
                ]
            }
        };
        
        // Save to localStorage
        localStorage.setItem('ccis_deanslist_data', JSON.stringify(initialData));
        console.log('✅ Enhanced data created and saved with year levels');
        return initialData;
    };

    // ✅ FIXED: DEAN'S LIST MANAGER WITH DROPDOWN DUAL FILTERS
    const deansListManager = {
        currentAcademicYear: '2024-2025',
        currentProgram: 'all',
        currentYearLevel: 'all',
        deansListData: {},
        
        init: function() {
            console.log('🎓 Initializing Dean\'s List Manager with dropdown filters...');
            
            // Load or initialize data
            const storedData = localStorage.getItem('ccis_deanslist_data');
            if (storedData) {
                try {
                    this.deansListData = JSON.parse(storedData);
                    console.log('📊 Data loaded from storage:', Object.keys(this.deansListData));
                } catch (parseError) {
                    console.error('❌ Error parsing stored data:', parseError);
                    this.deansListData = initializeDeansListData();
                }
            } else {
                this.deansListData = initializeDeansListData();
                console.log('📊 Fresh data initialized:', Object.keys(this.deansListData));
            }
            
            this.setupEventListeners();
            this.generateCombinedDropdownFilters();
            this.loadDeanList();
            
            console.log('✅ Dean\'s List Manager with dropdown filters initialized successfully');
        },

        setupEventListeners: function() {
            const self = this;
            
            // Academic Year dropdown change
            $(document).off('change', '#academicYearSelect').on('change', '#academicYearSelect', function() {
                const academicYear = $(this).val();
                console.log('📅 Academic Year changed:', academicYear);
                
                self.showLoadingState();
                setTimeout(() => {
                    self.handleAcademicYearChange(academicYear);
                }, 300);
            });

            // Program dropdown change
            $(document).off('change', '#programSelect').on('change', '#programSelect', function() {
                const program = $(this).val();
                console.log('🎓 Program changed:', program);
                
                self.showLoadingState();
                setTimeout(() => {
                    self.handleProgramChange(program);
                }, 300);
            });

            // Year Level dropdown change
            $(document).off('change', '#yearLevelSelect').on('change', '#yearLevelSelect', function() {
                const yearLevel = $(this).val();
                console.log('📚 Year Level changed:', yearLevel);
                
                self.showLoadingState();
                setTimeout(() => {
                    self.handleYearLevelChange(yearLevel);
                }, 300);
            });
        },

        // ✅ FIXED: Generate COMBINED DROPDOWN filters
        generateCombinedDropdownFilters: function() {
            console.log('🔘 Generating combined dropdown filters...');
            
            const filterContainer = $('.deanslist-filters');
            if (filterContainer.length === 0) {
                console.error('❌ Filter container not found!');
                return;
            }
            
            // Create the combined dropdown filters container
            filterContainer.html(`
                <div class="deanslist-filters-container">
                    <!-- Academic Year Filter -->
                    <div class="filter-group-dropdown">
                        <label class="filter-label">
                            <i class="fas fa-calendar-alt me-2"></i>Academic Year
                        </label>
                        <select id="academicYearSelect" class="form-select filter-select">
                            ${Object.keys(this.deansListData).sort().reverse().map(year => 
                                `<option value="${year}" ${year === this.currentAcademicYear ? 'selected' : ''}>
                                    ${this.deansListData[year].academicYear}
                                </option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <!-- Program Filter -->
                    <div class="filter-group-dropdown">
                        <label class="filter-label">
                            <i class="fas fa-graduation-cap me-2"></i>Program
                        </label>
                        <select id="programSelect" class="form-select filter-select">
                            <option value="all" ${this.currentProgram === 'all' ? 'selected' : ''}>All Programs</option>
                            <option value="BSCS Program" ${this.currentProgram === 'BSCS Program' ? 'selected' : ''}>BSCS Program</option>
                            <option value="BSIT Program" ${this.currentProgram === 'BSIT Program' ? 'selected' : ''}>BSIT Program</option>
                        </select>
                    </div>
                    
                    <!-- Year Level Filter -->
                    <div class="filter-group-dropdown">
                        <label class="filter-label">
                            <i class="fas fa-user-graduate me-2"></i>Year Level
                        </label>
                        <select id="yearLevelSelect" class="form-select filter-select">
                            <option value="all" ${this.currentYearLevel === 'all' ? 'selected' : ''}>All Year Levels</option>
                            <option value="1st Year" ${this.currentYearLevel === '1st Year' ? 'selected' : ''}>1st Year</option>
                            <option value="2nd Year" ${this.currentYearLevel === '2nd Year' ? 'selected' : ''}>2nd Year</option>
                            <option value="3rd Year" ${this.currentYearLevel === '3rd Year' ? 'selected' : ''}>3rd Year</option>
                            <option value="4th Year" ${this.currentYearLevel === '4th Year' ? 'selected' : ''}>4th Year</option>
                        </select>
                    </div>
                </div>
            `);
            
            console.log('✅ Combined dropdown filters generated');
        },

        handleAcademicYearChange: function(academicYear) {
            console.log('🔄 Changing academic year to:', academicYear);
            
            this.currentAcademicYear = academicYear;
            this.loadDeanList();
        },

        handleProgramChange: function(program) {
            console.log('🔄 Changing program to:', program);
            
            this.currentProgram = program;
            this.loadDeanList();
        },

        handleYearLevelChange: function(yearLevel) {
            console.log('🔄 Changing year level to:', yearLevel);
            
            this.currentYearLevel = yearLevel;
            this.loadDeanList();
        },

        loadDeanList: function() {
            console.log(`📖 Loading Dean's List with filters - Year: ${this.currentAcademicYear}, Program: ${this.currentProgram}, Year Level: ${this.currentYearLevel}`);
            
            const academicYearData = this.deansListData[this.currentAcademicYear];
            if (!academicYearData) {
                console.error('❌ No data found for academic year:', this.currentAcademicYear);
                this.showEmptyState('No Dean\'s List data available for this academic year.');
                return;
            }

            console.log('📊 Found data for:', this.currentAcademicYear);
            this.displayDeanList(academicYearData);
        },

        displayDeanList: function(academicYearData) {
            const container = $('.deanslist-content');
            container.empty();

            // Header with Academic Year ONLY (no filter display)
            container.append(`
                <div class="deanslist-header">
                    <h4>Dean's List Achievers</h4>
                    <div class="academic-year-text">${academicYearData.academicYear}</div>
                </div>
            `);

            // Filter and display achievers
            let hasAchievers = false;
            
            try {
                if (academicYearData.programs && Array.isArray(academicYearData.programs)) {
                    academicYearData.programs.forEach(program => {
                        // Filter by program if specified
                        if (this.currentProgram !== 'all' && program.name !== this.currentProgram) {
                            return; // Skip this program
                        }
                        
                        // Filter achievers by year level if specified
                        const filteredAchievers = program.achievers.filter(achiever => {
                            if (this.currentYearLevel === 'all') return true;
                            return achiever.yearLevel === this.currentYearLevel;
                        });
                        
                        if (filteredAchievers.length > 0) {
                            hasAchievers = true;
                            container.append(this.createProgramSection(program.name, filteredAchievers));
                        }
                    });
                }
            } catch (error) {
                console.error('❌ Error displaying Dean\'s List:', error);
                this.showEmptyState('Error displaying Dean\'s List data.');
                return;
            }

            if (!hasAchievers) {
                container.append(`
                    <div class="empty-state">
                        <i class="fas fa-award fa-3x mb-3"></i>
                        <h5>No Dean's List Achievers Found</h5>
                        <p>No students match the current filter criteria.</p>
                    </div>
                `);
                return;
            }

            // Congratulations message
            container.append(`
                <div class="congratulations-message">
                    <i class="fas fa-trophy"></i>
                    <h5>Congratulations to All Dean's List Achievers!</h5>
                    <p>Your hard work, dedication, and academic excellence inspire the entire CCIS community. 
                    Continue to strive for excellence and make us proud!</p>
                </div>
            `);
            
            console.log('✅ Dean\'s List displayed successfully with filters');
        },

        // ✅ FIXED: Show loading state
        showLoadingState: function() {
            const container = $('.deanslist-content');
            container.html(`
                <div class="text-center py-5">
                    <div class="spinner-border text-primary mb-3" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="text-muted">Loading Dean's List data...</p>
                </div>
            `);
        },

        createProgramSection: function(program, achievers) {
            try {
                return `
                    <div class="program-section">
                        <div class="program-header">
                            <h5>
                                <i class="fas fa-graduation-cap me-2"></i>
                                ${program}
                                <span class="badge bg-primary">${achievers.length} Achievers</span>
                            </h5>
                        </div>
                        <div class="achievers-grid">
                            ${achievers.map(achiever => this.createAchieverCard(achiever)).join('')}
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error('❌ Error creating program section:', error);
                return '<div class="alert alert-warning">Error displaying program data</div>';
            }
        },

        createAchieverCard: function(achiever) {
            try {
                const honorsClass = this.getHonorsClass(achiever.honors);
                
                return `
                    <div class="achiever-card ${honorsClass}">
                        <div class="achiever-header">
                            <div class="achiever-image">
                                <img src="${achiever.profilePic}" alt="${achiever.name}" 
                                     onerror="this.src='https://via.placeholder.com/100/4b0082/ffffff?text=${achiever.name.charAt(0)}'">
                            </div>
                            <div class="achiever-info">
                                <h6 class="achiever-name">${achiever.name}</h6>
                                <span class="achiever-year">${achiever.yearLevel}</span>
                                <div class="achiever-gwa">
                                    <strong>GWA:</strong> ${achiever.gwa}
                                </div>
                            </div>
                        </div>
                        <div class="achiever-honors">
                            <span class="honors-badge ${honorsClass}">${achiever.honors}</span>
                        </div>
                        ${achiever.achievements && achiever.achievements.length > 0 ? `
                            <div class="achiever-achievements">
                                <h6><i class="fas fa-trophy me-2"></i>Notable Achievements:</h6>
                                <ul>
                                    ${achiever.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                `;
            } catch (error) {
                console.error('❌ Error creating achiever card:', error);
                return '<div class="alert alert-warning">Error displaying achiever data</div>';
            }
        },

        getHonorsClass: function(honors) {
            switch(honors) {
                case 'Summa Cum Laude': return 'summa';
                case 'Magna Cum Laude': return 'magna';
                case 'Cum Laude': return 'cum-laude';
                default: return '';
            }
        },

        showEmptyState: function(message) {
            const container = $('.deanslist-content');
            container.html(`
                <div class="empty-state">
                    <i class="fas fa-award fa-3x mb-3"></i>
                    <h5>No Dean's List Data</h5>
                    <p>${message}</p>
                </div>
            `);
        },

        // ✅ NEW: Handle section activation
        handleSectionActivation: function() {
            console.log('🎯 Dean\'s List section activated - refreshing display');
            this.loadDeanList();
        }
    };

    // ✅ FIXED: Initialize the manager with delay to ensure DOM is ready
    setTimeout(() => {
        deansListManager.init();
    }, 500);
    
    // Make it globally accessible
    window.deansListManager = deansListManager;

    console.log('✅ Enhanced Dean\'s List System with Dropdown Filters Fully Loaded');
});