$(document).ready(function () {
    initChatbotKnowledge();
    initChatbot();
    loadFaqContext();
});

const chatbotConfig = {
    botName: 'CCIS Assistant',
    welcomeMessage: "Hello! I'm CCIS Assistant. How can I help you today?",
    defaultResponse: 'I could not match that yet. You can ask about programs, curriculum, forms, faculty, updates, alumni, organizations, or contact details.',
    thinkingTime: 700
};

const chatbotState = {
    topicsFromApi: [],
    quickQuestions: []
};

let chatbotKnowledge = {};

function initChatbot() {
    const $chatbot = $('#ccis-chatbot');
    const $chatbotToggle = $('#chatbot-toggle');
    const $chatbotClose = $('#chatbot-close');
    const $chatbotSend = $('#chatbot-send');
    const $chatbotInput = $('#chatbot-input');
    const $chatbotMessages = $('#chatbot-messages');

    $chatbotToggle.on('click', function () {
        $chatbot.toggleClass('open');
        $chatbotToggle.find('.chatbot-notification').fadeOut();
        $chatbotInput.focus();
    });

    $chatbotClose.on('click', function () {
        $chatbot.removeClass('open');
    });

    $chatbotSend.on('click', function () {
        sendUserMessage();
    });

    $chatbotInput.on('keypress', function (e) {
        if (e.which === 13) {
            sendUserMessage();
        }
    });

    $(document).on('click', '.quick-question', function () {
        const question = ($(this).data('question') || '').toString().trim();
        if (!question) return;
        $chatbotInput.val(question);
        sendUserMessage();
    });

    function sendUserMessage() {
        const message = $chatbotInput.val().trim();
        if (!message) return;

        addMessageToChat(message, 'user');
        $chatbotInput.val('');
        showTypingIndicator();

        window.setTimeout(function () {
            resolveBotResponse(message)
                .then(function (response) {
                    removeTypingIndicator();
                    addMessageToChat(response, 'bot');
                    scrollChatToBottom();
                })
                .catch(function () {
                    removeTypingIndicator();
                    addMessageToChat(chatbotConfig.defaultResponse, 'bot');
                    scrollChatToBottom();
                });
        }, chatbotConfig.thinkingTime);
    }

    function addMessageToChat(message, sender) {
        const messageClass = sender === 'user' ? 'user-message' : 'bot-message';
        const content = sender === 'user' ? escapeHtml(message) : String(message);

        const messageHtml = [
            '<div class="chatbot-message ' + messageClass + '">',
            '<div class="message-content">' + content + '</div>',
            '</div>'
        ].join('');

        $chatbotMessages.append(messageHtml);
        scrollChatToBottom();
    }

    function showTypingIndicator() {
        const typingHtml = [
            '<div class="typing-indicator" id="typing-indicator">',
            '<div class="typing-dot"></div>',
            '<div class="typing-dot"></div>',
            '<div class="typing-dot"></div>',
            '</div>'
        ].join('');

        $chatbotMessages.append(typingHtml);
        scrollChatToBottom();
    }

    function removeTypingIndicator() {
        $('#typing-indicator').remove();
    }

    function scrollChatToBottom() {
        if (!$chatbotMessages.length) return;
        $chatbotMessages.scrollTop($chatbotMessages[0].scrollHeight);
    }

    const hasSeenChatbot = localStorage.getItem('ccis_chatbot_seen');
    if (!hasSeenChatbot) {
        window.setTimeout(function () {
            $chatbot.addClass('open');
            $chatbotToggle.find('.chatbot-notification').text('1').show();
            localStorage.setItem('ccis_chatbot_seen', 'true');
        }, 3000);
    }
}

function initChatbotKnowledge() {
    chatbotKnowledge = {
        greetings: {
            patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
            responses: ['Hello! How can I help you with CCIS information today?']
        },
        thanks: {
            patterns: ['thank you', 'thanks', 'thank'],
            responses: ['You are welcome.']
        },
        goodbyes: {
            patterns: ['bye', 'goodbye', 'see you'],
            responses: ['Goodbye. You can chat again anytime.']
        }
    };
}

function loadFaqContext() {
    return $.getJSON(buildApiUrl('chatbot/api/faq'))
        .done(function (response) {
            if (!response || !response.success || !response.data) return;
            chatbotState.topicsFromApi = Array.isArray(response.data.topics) ? response.data.topics : [];
            chatbotState.quickQuestions = Array.isArray(response.data.quick_questions) ? response.data.quick_questions : [];
            applyQuickQuestions(chatbotState.quickQuestions);
        })
        .fail(function () {
            chatbotState.topicsFromApi = [];
            chatbotState.quickQuestions = [];
        });
}

function applyQuickQuestions(questions) {
    if (!Array.isArray(questions) || questions.length === 0) return;

    const $buttons = $('.quick-questions .quick-question');
    if (!$buttons.length) return;

    $buttons.each(function (index) {
        if (!questions[index]) return;
        const question = String(questions[index]);
        $(this).attr('data-question', question).data('question', question);
        $(this).text(question.length > 28 ? question.substring(0, 28) + '...' : question);
        $(this).attr('title', question);
    });
}

function resolveBotResponse(message) {
    return fetchBotResponseFromApi(message)
        .then(function (answer) {
            if (answer) return answer;
            return getLocalFallbackResponse(message);
        })
        .catch(function () {
            return getLocalFallbackResponse(message);
        });
}

function fetchBotResponseFromApi(message) {
    return $.ajax({
        url: buildApiUrl('chatbot/api/ask'),
        method: 'POST',
        dataType: 'json',
        data: { question: message }
    }).then(function (response) {
        if (response && response.success && response.data && response.data.answer) {
            return String(response.data.answer);
        }
        return '';
    });
}

function getLocalFallbackResponse(userMessage) {
    const normalized = normalizeText(userMessage);

    if (Array.isArray(chatbotState.topicsFromApi) && chatbotState.topicsFromApi.length > 0) {
        const apiTopic = matchFromTopicList(normalized, chatbotState.topicsFromApi);
        if (apiTopic) {
            return apiTopic.answer || chatbotConfig.defaultResponse;
        }
    }

    for (const category in chatbotKnowledge) {
        if (!Object.prototype.hasOwnProperty.call(chatbotKnowledge, category)) continue;
        const categoryData = chatbotKnowledge[category];
        const hasMatch = (categoryData.patterns || []).some(function (pattern) {
            return normalized.indexOf(normalizeText(pattern)) !== -1;
        });

        if (hasMatch && categoryData.responses && categoryData.responses.length) {
            const randomIndex = Math.floor(Math.random() * categoryData.responses.length);
            return categoryData.responses[randomIndex];
        }
    }

    return chatbotConfig.defaultResponse;
}

function matchFromTopicList(normalizedQuestion, topics) {
    let bestTopic = null;
    let bestScore = 0;

    topics.forEach(function (topic) {
        const keywords = Array.isArray(topic.keywords) ? topic.keywords : [];
        let score = 0;

        keywords.forEach(function (keyword) {
            const normalizedKeyword = normalizeText(keyword);
            if (!normalizedKeyword) return;
            if (normalizedQuestion.indexOf(normalizedKeyword) !== -1) {
                score += normalizedKeyword.indexOf(' ') !== -1 ? 4 : 2;
            }
        });

        if (score > bestScore) {
            bestScore = score;
            bestTopic = topic;
        }
    });

    return bestScore >= 2 ? bestTopic : null;
}

function buildApiUrl(path) {
    const base = (window.BASE_URL || '/').replace(/\/+$/, '');
    const cleanPath = String(path || '').replace(/^\/+/, '');
    return base + '/' + cleanPath;
}

function normalizeText(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

window.openChatbot = function (prefillMessage) {
    const text = prefillMessage || '';
    const $chatbot = $('#ccis-chatbot');
    const $chatbotInput = $('#chatbot-input');
    const $chatbotToggle = $('#chatbot-toggle');

    $chatbot.addClass('open');
    if (text) {
        $chatbotInput.val(text);
    }
    $chatbotInput.focus();
    $chatbotToggle.find('.chatbot-notification').fadeOut();
};

window.addChatbotResponse = function (category, patterns, responses) {
    if (!category || chatbotKnowledge[category]) return;
    chatbotKnowledge[category] = {
        patterns: Array.isArray(patterns) ? patterns : [],
        responses: Array.isArray(responses) ? responses : []
    };
};

window.chatbot = {
    open: window.openChatbot,
    addResponse: window.addChatbotResponse,
    getResponse: getLocalFallbackResponse,
    refreshFaq: loadFaqContext
};
