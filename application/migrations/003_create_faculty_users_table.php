<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Create_faculty_users_table extends CI_Migration {

    public function up() {
        // Create faculty_users table if it doesn't exist
        $this->dbforge->add_field(array(
            'id' => array(
                'type' => 'INT',
                'constraint' => 11,
                'auto_increment' => TRUE
            ),
            'firstname' => array(
                'type' => 'VARCHAR',
                'constraint' => 100,
                'null' => FALSE
            ),
            'lastname' => array(
                'type' => 'VARCHAR',
                'constraint' => 100,
                'null' => FALSE
            ),
            'position' => array(
                'type' => 'VARCHAR',
                'constraint' => 100,
                'null' => FALSE
            ),
            'advisory' => array(
                'type' => 'VARCHAR',
                'constraint' => 100,
                'null' => TRUE
            ),
            'image' => array(
                'type' => 'LONGTEXT',
                'null' => TRUE
            ),
            'created_at' => array(
                'type' => 'TIMESTAMP',
                'default' => 'CURRENT_TIMESTAMP'
            )
        ));

        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->create_table('faculty_users', TRUE);

        log_message('info', 'Migration: Created faculty_users table');
    }

    public function down() {
        // Drop faculty_users table if it exists
        $this->dbforge->drop_table('faculty_users', TRUE);
        log_message('info', 'Migration: Dropped faculty_users table');
    }
}
?>
