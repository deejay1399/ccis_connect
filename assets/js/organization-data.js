// ORGANIZATION DATA - Complete structure with sample data

// Initialize the global data object
window.organizationData = {
    // Legion data
    legionOfficers: [],
    legionAnnouncements: [],
    legionHappenings: [],
    
    // CS Guild data
    csguildOfficers: [],
    csguildAnnouncements: [],
    csguildHappenings: []
};

// Function to initialize all organization data
function initializeAllOrganizationData() {
    console.log('📚 Initializing Organization Data...');
    
    // Initialize Legion data
    initializeLegionData();
    
    // Initialize CS Guild data
    initializeCSGuildData();
    
    console.log('✅ Organization Data Initialized');
}

// ==========================================
// THE LEGION DATA - UPDATED WITH SECTIONS AND TIME
// ==========================================

function initializeLegionData() {
    // Legion Officers
    window.organizationData.legionOfficers = [
        {
            id: 1,
            name: 'Marc Jay Magan',
            position: 'President',
            image: 'Magan.jpeg',
            type: 'student'
        },
        {
            id: 2,
            name: 'Jun Philip Poyos',
            position: 'Vice President',
            image: 'Poyos.jpeg',
            type: 'student'
        },
        {
            id: 3,
            name: 'Dexter Vale',
            position: 'Assistant Vice President',
            image: 'Vale.jpeg',
            type: 'student'
        },
        {
            id: 4,
            name: 'Mary Joanna May Gulle',
            position: 'Secretary',
            image: 'Joanna.jpeg',
            type: 'student'
        },
        {
            id: 5,
            name: 'John Romel Lucot',
            position: 'Treasurer',
            image: 'Lucot.jpeg',
            type: 'student'
        },
        {
            id: 6,
            name: 'Hayian Hrienz M. Requina',
            position: 'Auditor',
            image: 'Haylan.jpeg',
            type: 'student'
        },
        {
            id: 7,
            name: 'Raymund Bansag',
            position: 'P.R.O',
            image: 'Bansag.jpeg',
            type: 'student'
        }
    ];
    
    // Legion Announcements
    window.organizationData.legionAnnouncements = [
        {
            id: 1,
            title: 'General Assembly Meeting - October 2024',
            description: 'All Legion members are required to attend the general assembly meeting. We will discuss upcoming events, budget allocations, and officer reports. Please bring your membership IDs and be on time.',
            date: '2024-10-15',
            time: '03:00 PM',
            venue: 'CCIS Auditorium',
            createdAt: '2024-10-08'
        },
        {
            id: 2,
            title: 'Tech Talk Series: Web Development Workshop',
            description: 'Join us for an intensive 3-day workshop on modern web development. Topics include HTML5, CSS3, JavaScript ES6+, and React basics. Limited slots available. Registration fee: ₱200 for members, ₱350 for non-members.',
            date: '2024-10-20',
            time: '09:00 AM',
            venue: 'Computer Laboratory 1',
            createdAt: '2024-10-05'
        },
        {
            id: 3,
            title: 'Mobile Legends Tournament Registration Open',
            description: 'The Legion is organizing the biggest Mobile Legends tournament of the year! Form your teams (5 members each) and register now. Amazing prizes await! Registration deadline is October 18. Entry fee: ₱500 per team.',
            date: '2024-10-25',
            venue: 'CCIS Gaming Area',
            createdAt: '2024-10-01'
        },
        {
            id: 4,
            title: 'Sound System Training for New Members',
            description: 'Interested in learning how to operate professional sound systems? This training will cover setup, operation, and troubleshooting of audio equipment. Free for all Legion members. Certificates will be provided.',
            date: '2024-10-12',
            time: '01:30 PM',
            venue: 'University Gymnasium',
            createdAt: '2024-09-28'
        },
        {
            id: 5,
            title: 'Halloween Movie Night: Tech Horror Special',
            description: 'Get ready for a spooky movie marathon! We\'ll be screening technology-themed horror films including "The Ring" and "Ex Machina". Free popcorn and drinks for the first 50 attendees. Costume contest with prizes!',
            date: '2024-10-31',
            time: '06:00 PM',
            venue: 'CCIS Open Area',
            createdAt: '2024-09-25'
        }
    ];
    
    // Legion Happenings
    window.organizationData.legionHappenings = [
        {
            id: 1,
            title: 'Welcome Assembly 2024: New Students Orientation',
            description: 'The Legion successfully provided complete technical support for the CCIS Welcome Assembly. Our team handled sound system setup, lighting design, LED wall operation, and live streaming. Over 500 freshmen attended the event which featured department presentations and campus tour information.',
            date: '2024-09-05',
            images: [
                '14.jpg',
                '10.jpg',
                '20.jpg',
                '8.jpg',
                '2.jpg'
            ]
        },
        {
            id: 2,
            title: 'Intramurals Opening: Sound & Lights Spectacular',
            description: 'The Legion team delivered an impressive audio-visual experience for the university-wide intramurals opening ceremony. We managed multiple wireless microphones, programmed dynamic lighting sequences, and operated the main stage sound system for performances by various college delegations. The event was a huge success with over 2,000 attendees.',
            date: '2024-09-15',
            images: [
                '10.jpg',
                '22.jpg',
                '21.jpg'
            ]
        },
        {
            id: 3,
            title: 'Python Programming Workshop Success',
            description: 'Our first tech workshop of the semester focused on Python programming basics. 45 students participated in this hands-on training covering variables, data types, loops, and functions. Special thanks to our senior members who served as facilitators. Participants created their first Python programs and received certificates of completion.',
            date: '2024-09-20',
            images: [
                '20.jpg',
                '18.jpg'
            ]
        }
    ];
    
    console.log('✅ Legion Data Loaded');
}

// ==========================================
// CS GUILD DATA - UPDATED WITH SECTIONS AND TIME
// ==========================================

function initializeCSGuildData() {
    // CS Guild Officers
    window.organizationData.csguildOfficers = [
        {
            id: 1,
            name: 'Justine Andrie Abella',
            position: 'President',
            image: 'Justine.jpeg',
            type: 'student'
        },
        {
            id: 2,
            name: 'James Paul Dacaldacal',
            position: 'Vice President',
            image: 'Paul.jpeg',
            type: 'student'
        },
        {
            id: 3,
            name: 'Riza Refamonte',
            position: 'Secretary',
            image: 'Riza.jpg',
            type: 'student'
        },
        {
            id: 4,
            name: 'Riza Janiola',
            position: 'Treasurer',
            image: 'Janiola.jpeg',
            type: 'student'
        },
        {
            id: 5,
            name: 'Laira Angela Bustillos',
            position: 'Auditor',
            image: 'Angela.jpg',
            type: 'student'
        },
        {
            id: 6,
            name: 'Glenn Luspoc',
            position: 'P.I.O',
            image: 'Glenn.jpeg',
            type: 'student'
        },
        {
            id: 7,
            name: 'Joshua Hinay',
            position: 'P.I.O',
            image: 'Joshua.jpeg',
            type: 'student'
        },
        {
            id: 8,
            name: 'John Reno D. Villapana',
            position: 'Layout Artist',
            image: 'Reno.png',
            type: 'student'
        },
        {
            id: 9,
            name: 'Mic Dahryl Caybin',
            position: 'Tutor',
            image: 'Dahryll.jpeg',
            type: 'student'
        },
        {
            id: 10,
            name: 'Karl Jacquin Ag-ag',
            position: 'Tutor',
            image: 'Karl.png',
            type: 'student'
        },
        {
            id: 11,
            name: 'Aga O. Abarquez',
            position: 'Business OP',
            image: 'Aga.jpeg',
            type: 'student'
        },
        {
            id: 12,
            name: 'Annabel Galarido',
            position: 'Asst. Business OP',
            image: 'Annabel.jpg',
            type: 'student'
        },
    ];
    
    // CS Guild Announcements
    window.organizationData.csguildAnnouncements = [
        {
            id: 1,
            title: 'Peer Tutoring Schedule Released',
            description: 'CS Guild peer tutoring sessions are now scheduled! Get help with Data Structures, Algorithms, Database Management, and other CS subjects. Sessions run Monday to Friday, 4-6 PM at the CS Lab. First come, first served basis. Bring your questions and laptop!',
            date: '2024-10-14',
            time: '04:00 PM',
            venue: 'CS Laboratory',
            createdAt: '2024-10-07'
        },
        {
            id: 2,
            title: 'Algorithm Study Group Formation',
            description: 'Struggling with algorithm design and analysis? Join our study group! We\'ll solve LeetCode problems together, discuss algorithm strategies, and prepare for technical interviews. Meets every Wednesday at 3 PM. Perfect for beginners and intermediate learners.',
            date: '2024-10-16',
            time: '03:00 PM',
            venue: 'CS Guild Room',
            createdAt: '2024-10-04'
        },
        {
            id: 3,
            title: 'Git & GitHub Workshop for Beginners',
            description: 'Learn version control the right way! This hands-on workshop covers Git basics, GitHub essentials, branching strategies, pull requests, and collaborative coding. Bring your laptop with Git installed. Free for all CS students. Limited to 30 participants.',
            date: '2024-10-22',
            venue: 'Computer Laboratory 2',
            createdAt: '2024-10-02'
        },
        {
            id: 4,
            title: 'Weekly Code Review Sessions',
            description: 'Improve your coding skills through peer code reviews! Share your projects, get constructive feedback, and learn best practices from senior students. Every Friday at 2 PM. All programming languages welcome. Great opportunity to learn from each other!',
            date: '2024-10-11',
            time: '02:00 PM',
            venue: 'CS Guild Room',
            createdAt: '2024-09-29'
        }
    ];
    
    // CS Guild Happenings
    window.organizationData.csguildHappenings = [
        {
            id: 1,
            title: 'Data Structures Crash Course',
            description: 'CS Guild conducted a comprehensive 4-hour crash course on fundamental data structures. Topics covered included arrays, linked lists, stacks, queues, trees, and graphs. 32 students attended, and each received a reference guide booklet. Many students reported feeling more confident about their upcoming exams.',
            date: '2024-09-18',
            images: [
                '3.jpg',
                '2.jpg',
                '8.jpg'
            ]
        },
        {
            id: 2,
            title: 'Study Marathon: Midterm Preparation',
            description: 'To help students prepare for midterm exams, CS Guild organized an 8-hour study marathon. Members provided on-demand tutoring for various CS subjects including Programming Fundamentals, Database Systems, and Discrete Mathematics. Over 50 students benefited from the free tutoring sessions, with many achieving improved exam scores.',
            date: '2024-09-12',
            images: [
                '10.jpg',
                '13.jpg'
            ]
        },
        {
            id: 3,
            title: 'Coding Challenge Competition',
            description: 'CS Guild hosted its first internal coding challenge with 25 participants competing individually. Contestants solved algorithmic problems within a 2-hour time limit. The competition tested problem-solving skills, coding speed, and algorithm optimization. Winners received certificates and tech-themed prizes.',
            date: '2024-09-08',
            images: [
                '14.jpg',
                '18.jpg',
                '20.jpg',
                '21.jpg'
            ]
        }
    ];
    
    console.log('✅ CS Guild Data Loaded');
}

// Initialize data when the script loads
initializeAllOrganizationData();