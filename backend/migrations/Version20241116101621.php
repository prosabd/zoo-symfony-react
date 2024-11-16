<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241116101621 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6AAB231F5E237E06 ON animal (name)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6CC70C7C5E237E06 ON continent (name)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_A5E6215B5E237E06 ON family (name)');
        $this->addSql('ALTER TABLE user ADD roles LONGTEXT NOT NULL COMMENT \'(DC2Type:array)\', DROP role');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX UNIQ_6AAB231F5E237E06 ON animal');
        $this->addSql('DROP INDEX UNIQ_6CC70C7C5E237E06 ON continent');
        $this->addSql('DROP INDEX UNIQ_A5E6215B5E237E06 ON family');
        $this->addSql('ALTER TABLE user ADD role LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:array)\', DROP roles');
    }
}
