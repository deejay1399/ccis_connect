<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Faculty_model extends CI_Model {

    private $table = 'faculty';

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
        $this->load->dbforge();
        $this->ensure_faculty_schema();
    }

    /**
     * Paghimo og rekord sa faculty
     */
    public function create($data)
    {
        return $this->db->insert($this->table, $data);
    }

    /**
     * Get faculty pinaagi sa user ID
     */
    public function get_by_user_id($user_id)
    {
        return $this->db->where('user_id', $user_id)
                        ->get($this->table)
                        ->row();
    }

    /**
     * I-update ang faculty
     */
    public function update($user_id, $data)
    {
        return $this->db->where('user_id', $user_id)
                        ->update($this->table, $data);
    }

    /**
     * Pag-ihap sa mga miyembro sa faculty pinaagi sa na-normalize nga label sa posisyon.
     */
    public function count_by_position($position)
    {
        $normalized = strtolower(trim((string) $position));
        $sql = "SELECT COUNT(*) AS total FROM {$this->table} WHERE LOWER(TRIM(position)) = ?";
        $row = $this->db->query($sql, [$normalized])->row();
        return (int) ($row->total ?? 0);
    }

    /**
     * Pag-ihap sa mga miyembro sa faculty pinaagi sa na-normalize nga posisyon ug departamento.
     */
    public function count_by_position_and_department($position, $department)
    {
        $normalizedPosition = strtolower(trim((string) $position));
        $normalizedDepartment = strtolower(trim((string) $department));
        $sql = "SELECT COUNT(*) AS total FROM {$this->table} WHERE LOWER(TRIM(position)) = ? AND LOWER(TRIM(department)) = ?";
        $row = $this->db->query($sql, [$normalizedPosition, $normalizedDepartment])->row();
        return (int) ($row->total ?? 0);
    }

    /**
     * Pag-ihap sa mga miyembro sa faculty pinaagi sa na-normalize nga posisyon ug tipo sa VP.
     */
    public function count_by_position_and_vp_type($position, $vpType)
    {
        $normalizedPosition = strtolower(trim((string) $position));
        $normalizedVpType = strtolower(trim((string) $vpType));
        $sql = "SELECT COUNT(*) AS total FROM {$this->table} WHERE LOWER(TRIM(position)) = ? AND LOWER(TRIM(vp_type)) = ?";
        $row = $this->db->query($sql, [$normalizedPosition, $normalizedVpType])->row();
        return (int) ($row->total ?? 0);
    }

    /**
     * Pag-ihap sa mga miyembro sa faculty pinaagi sa na-normalize nga posisyon ug kurso.
     */
    public function count_by_position_and_course($position, $course)
    {
        $normalizedPosition = strtolower(trim((string) $position));
        $normalizedCourse = strtolower(trim((string) $course));
        $sql = "SELECT COUNT(*) AS total FROM {$this->table} WHERE LOWER(TRIM(position)) = ? AND LOWER(TRIM(course)) = ?";
        $row = $this->db->query($sql, [$normalizedPosition, $normalizedCourse])->row();
        return (int) ($row->total ?? 0);
    }

    /**
     * Publiko nga mga miyembro sa org-chart gikan sa gimugna nga mga account sa tiggamit sa faculty.
     */
    public function get_public_org_chart_members()
    {
        $sql = "
            SELECT
                f.id,
                f.user_id,
                u.first_name AS firstname,
                u.last_name AS lastname,
                f.position,
                f.department,
                f.vp_type,
                f.course,
                f.bio,
                f.office_location,
                f.profile AS image,
                '' AS advisory
            FROM {$this->table} f
            INNER JOIN users u ON u.id = f.user_id
            WHERE u.is_active = 1
              AND f.position IS NOT NULL
              AND TRIM(f.position) <> ''
        ";

        return $this->db->query($sql)->result_array();
    }

    private function ensure_faculty_schema()
    {
        if (!$this->db->table_exists($this->table)) {
            return;
        }

        $fields = $this->db->list_fields($this->table);
        if (!in_array('vp_type', $fields, true)) {
            $this->dbforge->add_column($this->table, [
                'vp_type' => [
                    'type' => 'VARCHAR',
                    'constraint' => 255,
                    'null' => true,
                    'default' => null,
                    'after' => 'department'
                ]
            ]);
        }

        if (!in_array('course', $fields, true)) {
            $this->dbforge->add_column($this->table, [
                'course' => [
                    'type' => 'VARCHAR',
                    'constraint' => 255,
                    'null' => true,
                    'default' => null,
                    'after' => 'vp_type'
                ]
            ]);
        }

        // Backfill daan nga mga rekord nga gitipigan VP/Kurso sa departamento.
        $this->db->query("
            UPDATE {$this->table}
            SET vp_type = department
            WHERE LOWER(TRIM(position)) = 'vice president'
              AND (vp_type IS NULL OR TRIM(vp_type) = '')
              AND department IS NOT NULL
              AND TRIM(department) <> ''
        ");

        $this->db->query("
            UPDATE {$this->table}
            SET course = department
            WHERE LOWER(TRIM(position)) = 'chairperson'
              AND (course IS NULL OR TRIM(course) = '')
              AND department IS NOT NULL
              AND TRIM(department) <> ''
        ");
    }
}
?>
