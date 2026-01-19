$(document).ready(function() {
    console.log('🤖 CCIS Chatbot initializing...');
    
    // Initialize chatbot
    initChatbot();
    
    // Setup chatbot knowledge base
    initChatbotKnowledge();
});

// Chatbot configuration
const chatbotConfig = {
    botName: "CCIS Assistant",
    botAvatar: "🤖",
    welcomeMessage: "Hello! I'm CCIS Assistant. How can I help you today?",
    defaultResponse: "I'm not sure about that. You can try asking about curriculum, faculty, alumni, or contact information.",
    thinkingTime: 800 // ms delay before bot responds
};

// Chatbot knowledge base
let chatbotKnowledge = {};

function initChatbot() {
    console.log('🤖 Initializing chatbot...');
    
    // Chatbot elements
    const $chatbot = $('#ccis-chatbot');
    const $chatbotToggle = $('#chatbot-toggle');
    const $chatbotClose = $('#chatbot-close');
    const $chatbotSend = $('#chatbot-send');
    const $chatbotInput = $('#chatbot-input');
    const $chatbotMessages = $('#chatbot-messages');
    
    // Toggle chatbot visibility
    $chatbotToggle.click(function() {
        $chatbot.toggleClass('open');
        $chatbotToggle.find('.chatbot-notification').fadeOut();
        $chatbotInput.focus();
    });
    
    // Close chatbot
    $chatbotClose.click(function() {
        $chatbot.removeClass('open');
    });
    
    // Send message on button click
    $chatbotSend.click(function() {
        sendUserMessage();
    });
    
    // Send message on Enter key
    $chatbotInput.keypress(function(e) {
        if (e.which === 13) { // Enter key
            sendUserMessage();
        }
    });
    
    // Quick question buttons
    $(document).on('click', '.quick-question', function() {
        const question = $(this).data('question');
        $chatbotInput.val(question);
        sendUserMessage();
    });
    
    // Function to send user message
    function sendUserMessage() {
        const message = $chatbotInput.val().trim();
        
        if (message) {
            // Add user message to chat
            addMessageToChat(message, 'user');
            
            // Clear input
            $chatbotInput.val('');
            
            // Show typing indicator
            showTypingIndicator();
            
            // Get bot response after delay
            setTimeout(() => {
                // Remove typing indicator
                removeTypingIndicator();
                
                // Get and display bot response
                const response = getBotResponse(message);
                addMessageToChat(response, 'bot');
                
                // Scroll to bottom of chat
                scrollChatToBottom();
            }, chatbotConfig.thinkingTime);
        }
    }
    
    // Function to add message to chat
    function addMessageToChat(message, sender) {
        const messageClass = sender === 'user' ? 'user-message' : 'bot-message';
        const messageHtml = `
            <div class="chatbot-message ${messageClass}">
                <div class="message-content">${message}</div>
            </div>
        `;
        
        $chatbotMessages.append(messageHtml);
        scrollChatToBottom();
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
        const typingHtml = `
            <div class="typing-indicator" id="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        $chatbotMessages.append(typingHtml);
        scrollChatToBottom();
    }
    
    // Function to remove typing indicator
    function removeTypingIndicator() {
        $('#typing-indicator').remove();
    }
    
    // Function to scroll chat to bottom
    function scrollChatToBottom() {
        $chatbotMessages.scrollTop($chatbotMessages[0].scrollHeight);
    }
    
    // Auto-open chatbot on first visit
    const hasSeenChatbot = localStorage.getItem('ccis_chatbot_seen');
    if (!hasSeenChatbot) {
        setTimeout(() => {
            $chatbot.addClass('open');
            $chatbotToggle.find('.chatbot-notification').text('1').show();
            localStorage.setItem('ccis_chatbot_seen', 'true');
        }, 3000);
    }
    
    console.log('✅ Chatbot initialized successfully');
}

function initChatbotKnowledge() {
    // Define chatbot responses
    chatbotKnowledge = {
        // Greetings
        greetings: {
            patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
            responses: [
                "Hello! How can I help you today?",
                "Hi there! What can I do for you?",
                "Greetings! I'm here to help with CCIS information."
            ]
        },
        
        // Goodbyes
        goodbyes: {
            patterns: ['bye', 'goodbye', 'see you', 'farewell'],
            responses: [
                "Goodbye! Feel free to ask if you have more questions.",
                "See you later! Don't hesitate to come back.",
                "Bye! Have a great day!"
            ]
        },
        
        // Thanks
        thanks: {
            patterns: ['thank you', 'thanks', 'thank', 'appreciate'],
            responses: [
                "You're welcome!",
                "Glad I could help!",
                "Happy to assist!"
            ]
        },
        
        // Curriculum queries
        curriculum: {
            patterns: ['curriculum', 'syllabus', 'course outline', 'subjects', 'courses'],
            responses: [
                "You can find curriculum PDFs under <strong>Academics → Curriculum</strong>. They are available for viewing and downloading.",
                "The curriculum for all programs is available in the Academics section. Look for the Curriculum link in the dropdown menu.",
                "Check the Academics page for curriculum details. All program curricula are available as PDF downloads."
            ]
        },
        
        // Faculty queries
        faculty: {
            patterns: ['faculty', 'professor', 'teacher', 'instructor', 'staff'],
            responses: [
                "Faculty profiles are available in the <strong>Faculty</strong> section. You'll find their names, positions, and information there.",
                "You can view all CCIS faculty members on the Faculty page.",
                "Our faculty directory is accessible from the main navigation under 'Faculty'."
            ]
        },
        
        // Alumni queries
        alumni: {
            patterns: ['alumni', 'graduates', 'former students', 'alumnus', 'alumna'],
            responses: [
                "Alumni information is available in the <strong>Alumni</strong> section. You can find featured alumni, success stories, and events there.",
                "Check out our Alumni page for information about successful graduates and upcoming alumni events.",
                "The Alumni section contains directory, success stories, and events information."
            ]
        },
        
        // Programs queries
        programs: {
            patterns: ['programs', 'degrees', 'courses offered', 'academic programs'],
            responses: [
                "CCIS offers three programs: <strong>BSCS, BSIT, and BSIS</strong>. Details are in the Academics section.",
                "We offer Bachelor of Science in Computer Science (BSCS), Information Technology (BSIT), and Information Systems (BSIS).",
                "Program offerings include Computer Science, Information Technology, and Information Systems. See Academics for details."
            ]
        },
        
        // Contact queries
        contact: {
            patterns: ['contact', 'email', 'phone', 'address', 'location', 'where'],
            responses: [
                "CCIS is located at <strong>Magsija, Balilihan, Bohol - BISU Balilihan Campus</strong>. Phone: (038) 422-0712. Email: ccisbalilihan@bisu.edu.ph",
                "Contact info: BISU Balilihan Campus, Magsija, Balilihan. Phone (038) 422-0712. Email ccisbalilihan@bisu.edu.ph",
                "Find us at BISU Balilihan Campus. Call (038) 422-0712 or email ccisbalilihan@bisu.edu.ph"
            ]
        },
        
        // Office hours
        office: {
            patterns: ['office hours', 'open', 'hours', 'when is it open', 'business hours'],
            responses: [
                "CCIS office hours are <strong>Monday to Friday, 8:00 AM to 5:00 PM</strong>.",
                "The office is open from 8 AM to 5 PM, Monday through Friday.",
                "Office hours: Weekdays 8:00 AM - 5:00 PM."
            ]
        },
        
        // Organizations queries
        organizations: {
            patterns: ['organization', 'club', 'student organization', 'legion', 'cs guild'],
            responses: [
                "CCIS has two organizations: <strong>The Legion and CS Guild</strong>. More info in the Organization section.",
                "We have The Legion and CS Guild student organizations. Visit the Organization page for details.",
                "Check out The Legion and CS Guild in the Organization section of the website."
            ]
        },
        
        // Forms queries
        forms: {
            patterns: ['forms', 'documents', 'download', 'pdf', 'application'],
            responses: [
                "All forms are available in the <strong>Forms</strong> section. They can be previewed or downloaded as PDFs.",
                "You can find various forms in the Forms page. They're all in PDF format for easy download.",
                "Visit the Forms section to access and download CCIS-related documents."
            ]
        },
        
        // Events queries
        events: {
            patterns: ['events', 'activities', 'news', 'updates', 'announcements'],
            responses: [
                "Check <strong>News & Updates</strong> for announcements, events, achievements, and Dean's List.",
                "Latest news and events are posted in the News & Updates section.",
                "For events and announcements, visit the News & Updates page."
            ]
        },
        
        // Help queries
        help: {
            patterns: ['help', 'what can you do', 'assist', 'support'],
            responses: [
                "I can help you find information about: curriculum, faculty, alumni, programs, contact info, office hours, organizations, forms, and events. Just ask!",
                "I'm here to help with CCIS information. Try asking about faculty, curriculum, alumni, or any other topic.",
                "I can assist with CCIS-related queries. What would you like to know about?"
            ]
        }
    };
    
    console.log('🧠 Chatbot knowledge base loaded');
}

function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Check for matches in knowledge base
    for (const category in chatbotKnowledge) {
        const categoryData = chatbotKnowledge[category];
        
        // Check if any pattern matches
        const hasMatch = categoryData.patterns.some(pattern => {
            return message.includes(pattern.toLowerCase());
        });
        
        if (hasMatch) {
            // Return a random response from the category
            const responses = categoryData.responses;
            const randomIndex = Math.floor(Math.random() * responses.length);
            return responses[randomIndex];
        }
    }
    
    // Default response if no match found
    return chatbotConfig.defaultResponse;
}

// Function to manually trigger chatbot from other pages (optional)
window.openChatbot = function(prefillMessage = '') {
    const $chatbot = $('#ccis-chatbot');
    const $chatbotInput = $('#chatbot-input');
    const $chatbotToggle = $('#chatbot-toggle');
    
    // Open chatbot
    $chatbot.addClass('open');
    
    // Prefill message if provided
    if (prefillMessage) {
        $chatbotInput.val(prefillMessage);
        $chatbotInput.focus();
    }
    
    // Hide notification
    $chatbotToggle.find('.chatbot-notification').fadeOut();
};

// Function to add custom response (for future expansion)
window.addChatbotResponse = function(category, patterns, responses) {
    if (!chatbotKnowledge[category]) {
        chatbotKnowledge[category] = {
            patterns: patterns,
            responses: responses
        };
        console.log(`✅ Added new chatbot category: ${category}`);
    }
};

// Add CSS for chatbot (if not already added)
if (!$('#chatbot-styles').length) {
    const chatbotStyles = `
        /* Additional chatbot styles if needed */
        .quick-question {
            font-size: 0.85rem !important;
            padding: 0.5rem 0.8rem !important;
        }
        
        .chatbot-message {
            max-width: 85% !important;
        }
    `;
    
    $('head').append(`<style id="chatbot-styles">${chatbotStyles}</style>`);
}

// Export chatbot functions for global use
window.chatbot = {
    open: window.openChatbot,
    addResponse: window.addChatbotResponse,
    getResponse: getBotResponse
};