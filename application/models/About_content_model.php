<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class About_content_model extends CI_Model
{
    private $table = 'about_content';
    private $row_id = 1;

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
        $this->create_table_if_missing();
        $this->ensure_columns();
        $this->ensure_default_row();
    }

    private function create_table_if_missing()
    {
        $this->db->query("
            CREATE TABLE IF NOT EXISTS {$this->table} (
                id INT PRIMARY KEY,
                history_content LONGTEXT NULL,
                vision_text LONGTEXT NULL,
                mission_text LONGTEXT NULL,
                goals_json LONGTEXT NULL,
                core_values_json LONGTEXT NULL,
                hymn_verse1 LONGTEXT NULL,
                hymn_chorus LONGTEXT NULL,
                hymn_finale LONGTEXT NULL,
                jingle_verse1 LONGTEXT NULL,
                jingle_chorus LONGTEXT NULL,
                jingle_verse2 LONGTEXT NULL,
                jingle_repeat_chorus LONGTEXT NULL,
                jingle_bridge LONGTEXT NULL,
                jingle_final_chorus LONGTEXT NULL,
                hymn_video_path VARCHAR(255) NULL,
                jingle_video_path VARCHAR(255) NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ");
    }

    private function ensure_columns()
    {
        $this->ensure_column_exists('jingle_verse1', 'LONGTEXT NULL');
        $this->ensure_column_exists('jingle_chorus', 'LONGTEXT NULL');
        $this->ensure_column_exists('jingle_verse2', 'LONGTEXT NULL');
        $this->ensure_column_exists('jingle_repeat_chorus', 'LONGTEXT NULL');
        $this->ensure_column_exists('jingle_bridge', 'LONGTEXT NULL');
        $this->ensure_column_exists('jingle_final_chorus', 'LONGTEXT NULL');
    }

    private function ensure_column_exists($column_name, $column_definition)
    {
        $query = $this->db->query("SHOW COLUMNS FROM {$this->table} LIKE " . $this->db->escape($column_name));
        if ($query->num_rows() > 0) {
            return;
        }

        $this->db->query("ALTER TABLE {$this->table} ADD COLUMN {$column_name} {$column_definition}");
    }

    private function ensure_default_row()
    {
        $exists = $this->db->where('id', $this->row_id)->get($this->table)->row_array();
        if ($exists) {
            return;
        }

        $defaults = $this->default_content();
        $this->db->insert($this->table, [
            'id' => $this->row_id,
            'history_content' => $defaults['history']['content'],
            'vision_text' => $defaults['vmgo']['vision'],
            'mission_text' => $defaults['vmgo']['mission'],
            'goals_json' => json_encode($defaults['vmgo']['goals']),
            'core_values_json' => json_encode($defaults['vmgo']['coreValues']),
            'hymn_verse1' => $defaults['hymn']['verse1'],
            'hymn_chorus' => $defaults['hymn']['chorus'],
            'hymn_finale' => $defaults['hymn']['finale'],
            'jingle_verse1' => $defaults['hymn']['jingleVerse1'],
            'jingle_chorus' => $defaults['hymn']['jingleChorus'],
            'jingle_verse2' => $defaults['hymn']['jingleVerse2'],
            'jingle_repeat_chorus' => $defaults['hymn']['jingleRepeatChorus'],
            'jingle_bridge' => $defaults['hymn']['jingleBridge'],
            'jingle_final_chorus' => $defaults['hymn']['jingleFinalChorus'],
            'hymn_video_path' => $defaults['hymn']['hymnVideo'],
            'jingle_video_path' => $defaults['hymn']['jingleVideo']
        ]);
    }

    public function get_content()
    {
        $row = $this->db->where('id', $this->row_id)->get($this->table)->row_array();
        $defaults = $this->default_content();

        if (!$row) {
            return $defaults;
        }

        $goals = json_decode((string) $row['goals_json'], true);
        if (!is_array($goals)) {
            $goals = $defaults['vmgo']['goals'];
        }

        $core_values = json_decode((string) $row['core_values_json'], true);
        if (!is_array($core_values)) {
            $core_values = $defaults['vmgo']['coreValues'];
        }

        return [
            'history' => [
                'content' => (string) ($row['history_content'] !== null ? $row['history_content'] : $defaults['history']['content'])
            ],
            'vmgo' => [
                'vision' => (string) ($row['vision_text'] !== null ? $row['vision_text'] : $defaults['vmgo']['vision']),
                'mission' => (string) ($row['mission_text'] !== null ? $row['mission_text'] : $defaults['vmgo']['mission']),
                'goals' => $goals,
                'coreValues' => $core_values
            ],
            'hymn' => [
                'verse1' => (string) ($row['hymn_verse1'] !== null ? $row['hymn_verse1'] : $defaults['hymn']['verse1']),
                'chorus' => (string) ($row['hymn_chorus'] !== null ? $row['hymn_chorus'] : $defaults['hymn']['chorus']),
                'finale' => (string) ($row['hymn_finale'] !== null ? $row['hymn_finale'] : $defaults['hymn']['finale']),
                'jingleVerse1' => (string) ((isset($row['jingle_verse1']) && $row['jingle_verse1'] !== null) ? $row['jingle_verse1'] : $defaults['hymn']['jingleVerse1']),
                'jingleChorus' => (string) ((isset($row['jingle_chorus']) && $row['jingle_chorus'] !== null) ? $row['jingle_chorus'] : $defaults['hymn']['jingleChorus']),
                'jingleVerse2' => (string) ((isset($row['jingle_verse2']) && $row['jingle_verse2'] !== null) ? $row['jingle_verse2'] : $defaults['hymn']['jingleVerse2']),
                'jingleRepeatChorus' => (string) ((isset($row['jingle_repeat_chorus']) && $row['jingle_repeat_chorus'] !== null) ? $row['jingle_repeat_chorus'] : $defaults['hymn']['jingleRepeatChorus']),
                'jingleBridge' => (string) ((isset($row['jingle_bridge']) && $row['jingle_bridge'] !== null) ? $row['jingle_bridge'] : $defaults['hymn']['jingleBridge']),
                'jingleFinalChorus' => (string) ((isset($row['jingle_final_chorus']) && $row['jingle_final_chorus'] !== null) ? $row['jingle_final_chorus'] : $defaults['hymn']['jingleFinalChorus']),
                'hymnVideo' => $row['hymn_video_path'],
                'jingleVideo' => $row['jingle_video_path']
            ]
        ];
    }

    public function save_history($content)
    {
        return $this->db->where('id', $this->row_id)->update($this->table, [
            'history_content' => $content,
            'updated_at' => date('Y-m-d H:i:s')
        ]);
    }

    public function save_vmgo($vision, $mission, array $goals, array $core_values)
    {
        return $this->db->where('id', $this->row_id)->update($this->table, [
            'vision_text' => $vision,
            'mission_text' => $mission,
            'goals_json' => json_encode(array_values($goals)),
            'core_values_json' => json_encode(array_values($core_values)),
            'updated_at' => date('Y-m-d H:i:s')
        ]);
    }

    public function save_hymn(
        $verse1,
        $chorus,
        $finale,
        $jingle_verse1,
        $jingle_chorus,
        $jingle_verse2,
        $jingle_repeat_chorus,
        $jingle_bridge,
        $jingle_final_chorus,
        $hymn_video_path = null,
        $jingle_video_path = null
    )
    {
        $payload = [
            'hymn_verse1' => $verse1,
            'hymn_chorus' => $chorus,
            'hymn_finale' => $finale,
            'jingle_verse1' => $jingle_verse1,
            'jingle_chorus' => $jingle_chorus,
            'jingle_verse2' => $jingle_verse2,
            'jingle_repeat_chorus' => $jingle_repeat_chorus,
            'jingle_bridge' => $jingle_bridge,
            'jingle_final_chorus' => $jingle_final_chorus,
            'updated_at' => date('Y-m-d H:i:s')
        ];

        if ($hymn_video_path !== null) {
            $payload['hymn_video_path'] = $hymn_video_path;
        }

        if ($jingle_video_path !== null) {
            $payload['jingle_video_path'] = $jingle_video_path;
        }

        return $this->db->where('id', $this->row_id)->update($this->table, $payload);
    }

    public function get_video_path($type)
    {
        $row = $this->db->select('hymn_video_path, jingle_video_path')->where('id', $this->row_id)->get($this->table)->row_array();
        if (!$row) {
            return null;
        }

        if ($type === 'hymn') {
            return $row['hymn_video_path'];
        }

        if ($type === 'jingle') {
            return $row['jingle_video_path'];
        }

        return null;
    }

    public function clear_video_path($type)
    {
        $field = $type === 'jingle' ? 'jingle_video_path' : 'hymn_video_path';
        return $this->db->where('id', $this->row_id)->update($this->table, [
            $field => null,
            'updated_at' => date('Y-m-d H:i:s')
        ]);
    }

    private function default_content()
    {
        return [
            'history' => [
                'content' => "The College of Computing and Information Sciences (CCIS) is the newest academic department of Bohol Island State University - Balilihan Campus, officially established in 2024.\n\nPreviously, computing-related programs were offered under the College of Technology and Allied Sciences (CTAS). However, due to the growing demand and increasing specialization in the field of computing, CCIS was established as a separate college. It currently offers two degree programs: Bachelor of Science in Computer Science (BSCS) and Bachelor of Science in Information Technology (BSIT), both of which align closely with the department's core focus.\n\nWith innovation, collaboration, and excellence as its foundation, CCIS continues to grow and is committed to producing future-ready graduates equipped to lead in the ever-evolving world of technology."
            ],
            'vmgo' => [
                'vision' => 'A premier Science and Technology university for the formation of world-class and virtuous human resource for sustainable development in Bohol and the Country.',
                'mission' => 'BISU is committed to provide quality higher education in the arts and sciences, as well as in the professional and technological fields; undertake research and development and extension services for the sustainable development of Bohol and the country.',
                'goals' => [
                    'Pursue faculty and education excellence and strengthen the current viable curricular programs and develop curricular programs that are responsive to the demands of the times both in the industry and the environment',
                    'Promote quality research outputs that respond to the needs of the local and national communities',
                    'Develop Communities through Responsive Extension Programs',
                    'Adopt Efficient and Profitable Income Generating Projects/Enterprise for Self-Sustainability',
                    'Provide adequate, state-of-the-art, and accessible infrastructure support facilities for quality education',
                    'Promote efficient and effective good governance supportive of high-quality education'
                ],
                'coreValues' => [
                    [
                        'name' => 'BALANCE',
                        'description' => 'Balance refers to the importance of maintaining equilibrium and harmony in all aspects of life. It emphasizes the need to strike a balance between academic pursuits and personal well-being, between work and leisure, between physical and mental health, and between individual and community interests.'
                    ],
                    [
                        'name' => 'INTEGRITY',
                        'description' => 'Integrity is the foundation of ethical behavior and moral character. It encompasses honesty, transparency, and a strong adherence to principles and values. Upholding integrity means acting with sincerity, fairness, and accountability in all endeavors.'
                    ],
                    [
                        'name' => 'STEWARDSHIP',
                        'description' => "Stewardship reflects the university's commitment to responsible management and wise utilization of resources. It emphasizes the need to protect and preserve the environment, promote sustainable practices, and ensure the efficient use of financial, human, and physical resources."
                    ],
                    [
                        'name' => 'UPRIGHTNESS',
                        'description' => 'Uprightness embodies the value of moral uprightness, righteousness, and ethical conduct. It emphasizes the importance of upholding high moral standards, practicing fairness, and demonstrating respect for others.'
                    ]
                ]
            ],
            'hymn' => [
                'verse1' => "A Dream, a Thought, a reality\nBohol Island State University.\nSail B.I.S.U Sail\nFrom the North to the South\nEast to West",
                'chorus' => "Fly B.I.S.U fly\nFrom the Island of Bohol\nto the world.\nHappy are we as we go through\nNurtured with Thoughts of Wisdom",
                'finale' => "A Dream, a Thought, a Reality\nBohol Island State University!",
                'jingleVerse1' => "In the search of skills and education\nOne can find in wonderful Island of Bohol\nMaking every childhood's dream\nCome to reality\nProud to soar the world of adversity",
                'jingleChorus' => "Bohol Island State University\nSeeking possibilities through unity\nWe fly so high, above the bright blue sky\nWe sail across the ocean\nWithout fear or sigh",
                'jingleVerse2' => "We move forward bringing\nOur traditions and values\nOur learners of today\nWe mold them as leaders\nThe dream of every family and society\nLies in Bohol Island State University",
                'jingleRepeatChorus' => "Bohol Island State University\nSeeking possibilities through unity\nWe fly so high, above the bright blue sky\nWe sail across the ocean\nWithout fear or sigh",
                'jingleBridge' => "Unity amidst diversity\nBohol Island State University",
                'jingleFinalChorus' => "Bohol Island State University\nSeeking possibilities through unity\nWe fly so high, above the bright blue sky\nWe sail across the ocean\nWithout fear or sigh\nBohol Island State University",
                'hymnVideo' => 'assets/sounds/bisu_hymn_lyric_video.mp4',
                'jingleVideo' => 'assets/sounds/BISU JINGLE.mp4'
            ]
        ];
    }
}
