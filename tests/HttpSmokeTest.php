<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;

final class HttpSmokeTest extends TestCase
{
    /**
     * @return array<int, array{0: string}>
     */
    public function routeProvider(): array
    {
        return [
            ['/'],
            ['/about'],
            ['/login'],
            ['/faculty'],
            ['/forms'],
        ];
    }

    /**
     * @dataProvider routeProvider
     */
    public function testRouteRendersWithoutFrameworkErrorMarkers(string $route): void
    {
        $runner = realpath(__DIR__ . '/support/request_runner.php');
        self::assertNotFalse($runner, 'Request runner not found.');

        $cmd = escapeshellarg(PHP_BINARY)
            . ' '
            . escapeshellarg((string) $runner)
            . ' '
            . escapeshellarg($route)
            . ' 2>&1';

        $output = [];
        $exitCode = 0;
        exec($cmd, $output, $exitCode);
        $raw = trim(implode("\n", $output));

        self::assertSame(0, $exitCode, "Runner failed for route {$route}: {$raw}");
        self::assertNotSame('', $raw, "Empty runner output for route {$route}");

        $decoded = json_decode($raw, true);
        self::assertIsArray($decoded, "Runner did not return JSON for {$route}: {$raw}");
        self::assertArrayHasKey('has_error_marker', $decoded);
        self::assertFalse((bool) $decoded['has_error_marker'], "Route {$route} returned framework error markers.");
        $outputLength = (int) ($decoded['output_length'] ?? 0);
        $hasRedirect = (bool) ($decoded['has_redirect'] ?? false);
        self::assertTrue(
            $outputLength > 100 || $hasRedirect,
            "Route {$route} output is too short and no redirect header was detected."
        );
    }
}
