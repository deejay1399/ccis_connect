<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;

final class ConfigSmokeTest extends TestCase
{
    public function testCorePathsExist(): void
    {
        self::assertDirectoryExists(__DIR__ . '/../application');
        self::assertDirectoryExists(__DIR__ . '/../system');
        self::assertFileExists(__DIR__ . '/../index.php');
    }

    public function testRoutesConfigurationLoadsAndHasDefaultController(): void
    {
        $route = [];
        require __DIR__ . '/../application/config/routes.php';

        self::assertArrayHasKey('default_controller', $route);
        self::assertNotEmpty($route['default_controller']);
        self::assertSame('LandingController/homepage', $route['default_controller']);
    }

    public function testDatabaseConfigurationHasDefaultConnectionShape(): void
    {
        $db = [];
        $active_group = null;
        $query_builder = null;

        require __DIR__ . '/../application/config/database.php';

        self::assertSame('default', $active_group);
        self::assertTrue($query_builder);
        self::assertArrayHasKey('default', $db);
        self::assertSame('mysqli', $db['default']['dbdriver']);
        self::assertSame('ccis_condb', $db['default']['database']);
    }
}
