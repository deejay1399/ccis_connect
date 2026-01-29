<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Create_programs_table extends CI_Migration {

    public function up()
    {
        $this->dbforge->add_field(array(
            'program_id' => array(
                'type' => 'INT',
                'constraint' => 11,
                'auto_increment' => TRUE
            ),
            'program_name' => array(
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => FALSE
            ),
            'description' => array(
                'type' => 'TEXT',
                'null' => TRUE
            ),
            'duration_years' => array(
                'type' => 'INT',
                'constraint' => 11,
                'null' => TRUE
            ),
            'career_opportunities' => array(
                'type' => 'TEXT',
                'null' => TRUE
            ),
            'created_at' => array(
                'type' => 'TIMESTAMP',
                'null' => TRUE,
                'default' => 'CURRENT_TIMESTAMP'
            )
        ));

        $this->dbforge->add_key('program_id', TRUE);
        $this->dbforge->create_table('programs');

        // Insert sample data
        $sample_data = array(
            array(
                'program_name' => 'Bachelor of Science in Computer Science (BSCS)',
                'description' => 'A four-year degree program that focuses on the study of computer algorithms, software development, and computer systems design. Students learn programming, data structures, algorithms, software engineering, and computer architecture.',
                'duration_years' => 4,
                'career_opportunities' => 'Software Developer/Engineer, Systems Analyst, Web Developer, Mobile App Developer, Data Scientist, AI/Machine Learning Engineer, Game Developer, Research and Development Specialist'
            ),
            array(
                'program_name' => 'Bachelor of Science in Information Technology (BSIT)',
                'description' => 'A four-year program that emphasizes information technology infrastructure, networking, system administration, and enterprise solutions. Students gain skills in network management, database administration, and IT project management.',
                'duration_years' => 4,
                'career_opportunities' => 'Network Administrator, IT Support Specialist, Database Administrator, System Administrator, IT Project Manager, Cyber Security Specialist, Web Administrator, Technical Support Engineer'
            )
        );

        $this->db->insert_batch('programs', $sample_data);
    }

    public function down()
    {
        $this->dbforge->drop_table('programs');
    }
}
