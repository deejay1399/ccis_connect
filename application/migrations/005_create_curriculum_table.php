<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Create_curriculum_table extends CI_Migration {

    public function up() {
        $this->dbforge->add_field(array(
            'id' => array(
                'type' => 'INT',
                'constraint' => 11,
                'auto_increment' => TRUE
            ),
            'program' => array(
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => FALSE
            ),
            'file_url' => array(
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => FALSE
            ),
            'created_at' => array(
                'type' => 'TIMESTAMP',
                'default' => 'CURRENT_TIMESTAMP'
            )
        ));
        
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->create_table('curriculum');
    }

    public function down() {
        $this->dbforge->drop_table('curriculum');
    }
}
?>
