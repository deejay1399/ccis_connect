<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class ChatbotController extends CI_Controller {

    public function __construct()
    {
        parent::__construct();
        $this->load->helper(array('url', 'auth'));

        if (function_exists('restrict_public_for_admin_roles')) {
            restrict_public_for_admin_roles();
        }
    }

    public function faq()
    {
        header('Content-Type: application/json');

        try {
            $knowledge = $this->build_faq_knowledge();
            echo json_encode(array(
                'success' => true,
                'data' => array(
                    'bot_name' => 'CCIS Assistant',
                    'quick_questions' => $knowledge['quick_questions'],
                    'topics' => $knowledge['topics']
                )
            ));
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(array(
                'success' => false,
                'message' => 'Unable to load FAQ content: ' . $e->getMessage()
            ));
        }
        exit;
    }

    public function ask()
    {
        header('Content-Type: application/json');

        if ($this->input->method() !== 'post') {
            http_response_code(405);
            echo json_encode(array('success' => false, 'message' => 'Method not allowed'));
            exit;
        }

        $question = trim((string) $this->input->post('question'));
        if ($question === '') {
            http_response_code(400);
            echo json_encode(array('success' => false, 'message' => 'Question is required'));
            exit;
        }

        try {
            $knowledge = $this->build_faq_knowledge();
            $match = $this->match_question($question, $knowledge['topics']);

            $this->log_chatbot_inquiry($question, $match['category']);

            echo json_encode(array(
                'success' => true,
                'data' => array(
                    'answer' => $match['answer'],
                    'category' => $match['category'],
                    'confidence' => $match['score'],
                    'quick_questions' => $knowledge['quick_questions']
                )
            ));
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(array(
                'success' => false,
                'message' => 'Unable to answer question: ' . $e->getMessage()
            ));
        }
        exit;
    }

    private function build_faq_knowledge()
    {
        $program_names = array();
        $curriculum_rows = array();
        $forms_rows = array();
        $faculty_rows = array();
        $announcements = array();
        $events = array();
        $deans_list = array();
        $featured_alumni = array();
        $alumni_events = array();

        try {
            $this->load->model('Programs_model');
            $programs = $this->Programs_model->get_all_programs();
            foreach ($programs as $program) {
                if (!empty($program['program_name'])) {
                    $program_names[] = trim($program['program_name']);
                }
            }
        } catch (Exception $e) {
            log_message('error', 'Chatbot programs load failed: ' . $e->getMessage());
        }

        try {
            $this->load->model('Curriculum_model');
            $curriculum_rows = $this->Curriculum_model->get_all();
        } catch (Exception $e) {
            log_message('error', 'Chatbot curriculum load failed: ' . $e->getMessage());
        }

        try {
            $this->load->model('Forms_model');
            $forms_rows = $this->Forms_model->get_all_forms();
        } catch (Exception $e) {
            log_message('error', 'Chatbot forms load failed: ' . $e->getMessage());
        }

        try {
            $this->load->model('Faculty_users_model');
            $faculty_rows = $this->Faculty_users_model->get_all_faculty();
        } catch (Exception $e) {
            log_message('error', 'Chatbot faculty load failed: ' . $e->getMessage());
        }

        try {
            $this->load->model('Announcements_model');
            $announcements = $this->Announcements_model->get_all();
        } catch (Exception $e) {
            log_message('error', 'Chatbot announcements load failed: ' . $e->getMessage());
        }

        try {
            $this->load->model('Events_achievements_model');
            $events = $this->Events_achievements_model->get_all();
        } catch (Exception $e) {
            log_message('error', 'Chatbot events load failed: ' . $e->getMessage());
        }

        try {
            $this->load->model('Deans_list_model');
            $deans_list = $this->Deans_list_model->get_all();
        } catch (Exception $e) {
            log_message('error', 'Chatbot deans list load failed: ' . $e->getMessage());
        }

        try {
            $this->load->model('Alumni_model');
            $featured_alumni = $this->Alumni_model->get_all_featured();
            $alumni_events = $this->Alumni_model->get_all_events();
        } catch (Exception $e) {
            log_message('error', 'Chatbot alumni load failed: ' . $e->getMessage());
        }

        $active_forms = array();
        foreach ($forms_rows as $form) {
            if (!array_key_exists('is_active', $form) || (int) $form['is_active'] === 1) {
                $active_forms[] = $form;
            }
        }

        $curriculum_programs = array();
        foreach ($curriculum_rows as $row) {
            if (!empty($row['program'])) {
                $curriculum_programs[] = trim($row['program']);
            }
        }
        $curriculum_programs = array_values(array_unique($curriculum_programs));

        $faculty_names = array();
        foreach ($faculty_rows as $row) {
            $full_name = trim(((isset($row['firstname']) ? $row['firstname'] : '') . ' ' . (isset($row['lastname']) ? $row['lastname'] : '')));
            if ($full_name !== '') {
                $faculty_names[] = $full_name;
            }
        }

        $programs_text = count($program_names) > 0
            ? implode(', ', $program_names)
            : 'BSCS and BSIT';

        $curriculum_text = count($curriculum_rows) > 0
            ? 'There are currently ' . count($curriculum_rows) . ' curriculum file(s) in the system'
            : 'Curriculum files are managed in the Academics section';

        if (count($curriculum_programs) > 0) {
            $curriculum_text .= ' covering: ' . implode(', ', $curriculum_programs) . '.';
        } else {
            $curriculum_text .= '.';
        }

        $forms_titles = array();
        foreach (array_slice($active_forms, 0, 3) as $form) {
            if (!empty($form['title'])) {
                $forms_titles[] = trim($form['title']);
            }
        }
        $forms_text = count($active_forms) > 0
            ? 'There are currently ' . count($active_forms) . ' active form(s).'
            : 'There are no active forms at the moment.';
        if (count($forms_titles) > 0) {
            $forms_text .= ' Recent forms include: ' . implode(', ', $forms_titles) . '.';
        }

        $latest_announcement = count($announcements) > 0 ? $announcements[0] : null;
        $latest_event = count($events) > 0 ? $events[0] : null;
        $latest_deans = count($deans_list) > 0 ? $deans_list[0] : null;

        $updates_text = 'For latest updates, open News & Updates.';
        if ($latest_announcement && !empty($latest_announcement['title'])) {
            $updates_text .= ' Latest announcement: "' . $latest_announcement['title'] . '"';
            if (!empty($latest_announcement['announcement_date'])) {
                $updates_text .= ' (' . $this->format_date($latest_announcement['announcement_date']) . ')';
            }
            $updates_text .= '.';
        }
        if ($latest_event && !empty($latest_event['title'])) {
            $updates_text .= ' Latest event/achievement: "' . $latest_event['title'] . '".';
        }

        $deans_text = $latest_deans
            ? 'Latest Dean\'s List in the system: ' . (isset($latest_deans['academic_year']) ? $latest_deans['academic_year'] : '-') . ' ' . (isset($latest_deans['semester']) ? $latest_deans['semester'] : '') . '.'
            : 'Dean\'s List is available in News & Updates > Dean\'s List.';

        $faculty_text = 'Faculty information is available on the Faculty page.';
        if (count($faculty_rows) > 0) {
            $faculty_text = 'There are currently ' . count($faculty_rows) . ' faculty record(s) in the system.';
            if (count($faculty_names) > 0) {
                $faculty_text .= ' Sample faculty: ' . implode(', ', array_slice($faculty_names, 0, 3)) . '.';
            }
            $faculty_text .= ' You can view all on the Faculty page.';
        }

        $alumni_text = 'Alumni details are in the Alumni page.';
        $alumni_text .= ' Featured alumni: ' . count($featured_alumni) . '.';
        $alumni_text .= ' Alumni events: ' . count($alumni_events) . '.';

        $topics = array(
            array(
                'id' => 'greetings',
                'question' => 'Hello',
                'keywords' => array('hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'),
                'answer' => 'Hello! I can answer FAQs about CCIS programs, curriculum, forms, faculty, updates, alumni, organizations, and contact details.'
            ),
            array(
                'id' => 'programs',
                'question' => 'What programs are offered?',
                'keywords' => array('program', 'programs', 'degree', 'degrees', 'bscs', 'bsit', 'bsis', 'course offered', 'academic program'),
                'answer' => 'CCIS currently offers: ' . $programs_text . '. You can check Academics > Programs for full details.'
            ),
            array(
                'id' => 'curriculum',
                'question' => 'Where can I find the curriculum?',
                'keywords' => array('curriculum', 'syllabus', 'course outline', 'subjects', 'curricula'),
                'answer' => $curriculum_text . ' You can find them in Academics > Curriculum.'
            ),
            array(
                'id' => 'forms',
                'question' => 'What forms are available?',
                'keywords' => array('form', 'forms', 'pdf', 'document', 'documents', 'download'),
                'answer' => $forms_text . ' Open the Forms page to preview or download files.'
            ),
            array(
                'id' => 'faculty',
                'question' => 'Who are the faculty members?',
                'keywords' => array('faculty', 'teacher', 'teachers', 'professor', 'instructor', 'staff', 'dean'),
                'answer' => $faculty_text
            ),
            array(
                'id' => 'updates',
                'question' => 'What are the latest updates?',
                'keywords' => array('update', 'updates', 'announcement', 'announcements', 'event', 'events', 'achievement', 'news'),
                'answer' => $updates_text
            ),
            array(
                'id' => 'deans_list',
                'question' => 'Is there a Dean\'s List update?',
                'keywords' => array('dean', 'deans list', 'dean list', 'honor', 'honors'),
                'answer' => $deans_text
            ),
            array(
                'id' => 'alumni',
                'question' => 'What is in the alumni section?',
                'keywords' => array('alumni', 'graduate', 'graduates', 'success story', 'mentor', 'give back'),
                'answer' => $alumni_text
            ),
            array(
                'id' => 'organizations',
                'question' => 'What organizations are available?',
                'keywords' => array('organization', 'organizations', 'club', 'clubs', 'legion', 'cs guild', 'csguild'),
                'answer' => 'CCIS organizations include The Legion and CS Guild. Open the Organization page for officers, advisers, announcements, and happenings.'
            ),
            array(
                'id' => 'contact',
                'question' => 'How can I contact CCIS?',
                'keywords' => array('contact', 'phone', 'email', 'address', 'location', 'office', 'hours'),
                'answer' => 'Contact details: Magsija, Balilihan, Bohol - BISU Balilihan Campus. Phone: (038) 422-0712. Email: ccisbalilihan@bisu.edu.ph. Office hours: Monday to Friday, 8:00 AM to 5:00 PM.'
            ),
            array(
                'id' => 'thanks',
                'question' => 'Thanks',
                'keywords' => array('thank you', 'thanks', 'thank'),
                'answer' => 'You are welcome. Ask me anytime about CCIS system information.'
            ),
            array(
                'id' => 'goodbye',
                'question' => 'Goodbye',
                'keywords' => array('bye', 'goodbye', 'see you'),
                'answer' => 'Goodbye. You can open the chatbot again anytime.'
            )
        );

        return array(
            'quick_questions' => array(
                'What programs are offered in CCIS?',
                'Where can I find the curriculum?',
                'Where can I download forms?',
                'What are the office hours?'
            ),
            'topics' => $topics
        );
    }

    private function match_question($question, $topics)
    {
        $normalized_question = $this->normalize_text($question);
        $best_topic = null;
        $best_score = 0;

        foreach ($topics as $topic) {
            $score = 0;
            foreach ($topic['keywords'] as $keyword) {
                $normalized_keyword = $this->normalize_text($keyword);
                if ($normalized_keyword === '') {
                    continue;
                }
                if (strpos($normalized_question, $normalized_keyword) !== false) {
                    $score += (strpos($normalized_keyword, ' ') !== false) ? 4 : 2;
                }
            }

            if ($score > $best_score) {
                $best_score = $score;
                $best_topic = $topic;
            }
        }

        if ($best_topic && $best_score >= 2) {
            return array(
                'category' => $best_topic['id'],
                'answer' => $best_topic['answer'],
                'score' => $best_score
            );
        }

        return array(
            'category' => 'fallback',
            'answer' => 'I could not match that yet. You can ask about programs, curriculum, forms, faculty, updates, alumni, organizations, or contact details.',
            'score' => 0
        );
    }

    private function normalize_text($text)
    {
        $text = strtolower((string) $text);
        $text = preg_replace('/[^a-z0-9\s]/', ' ', $text);
        $text = preg_replace('/\s+/', ' ', $text);
        return trim($text);
    }

    private function format_date($value)
    {
        if (empty($value)) {
            return '';
        }

        $timestamp = strtotime($value);
        if ($timestamp === false) {
            return (string) $value;
        }

        return date('M j, Y', $timestamp);
    }

    private function log_chatbot_inquiry($question, $category)
    {
        try {
            $this->load->model('Alumni_model');
            if (method_exists($this->Alumni_model, 'insert_chatbot_inquiry')) {
                $this->Alumni_model->insert_chatbot_inquiry(array(
                    'name' => 'Website Visitor',
                    'question' => (string) $question,
                    'category' => (string) $category,
                    'status' => 'pending'
                ));
            }
        } catch (Exception $e) {
            log_message('error', 'Chatbot inquiry log failed: ' . $e->getMessage());
        }
    }
}
