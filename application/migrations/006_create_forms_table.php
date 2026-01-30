<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Create_forms_table extends CI_Migration {

    public function up() {
        // Create forms table
        $this->dbforge->add_field(array(
            'id' => array(
                'type' => 'INT',
                'constraint' => 11,
                'auto_increment' => TRUE
            ),
            'title' => array(
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => FALSE
            ),
            'file_url' => array(
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => FALSE
            ),
            'original_filename' => array(
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => FALSE
            ),
            'file_size' => array(
                'type' => 'INT',
                'null' => TRUE
            ),
            'is_active' => array(
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 1
            ),
            'created_by' => array(
                'type' => 'INT',
                'null' => TRUE
            ),
            'created_at' => array(
                'type' => 'TIMESTAMP',
                'default' => 'CURRENT_TIMESTAMP'
            ),
            'updated_at' => array(
                'type' => 'TIMESTAMP',
                'default' => 'CURRENT_TIMESTAMP',
                'on_update' => 'CURRENT_TIMESTAMP'
            )
        ));

        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->create_table('forms', TRUE);

        log_message('info', 'Migration: Created forms table');
    }

    public function down() {
        $this->dbforge->drop_table('forms', TRUE);
        log_message('info', 'Migration: Dropped forms table');
    }
}
?>
