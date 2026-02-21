<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;

final class RouteIntegrityTest extends TestCase
{
    private string $controllersDir;
    /** @var array<string, array{class: string, methods: array<string, bool>, hasRemap: bool}> */
    private array $controllerCache = [];

    protected function setUp(): void
    {
        parent::setUp();
        $this->controllersDir = realpath(__DIR__ . '/../application/controllers') ?: '';
        self::assertNotSame('', $this->controllersDir, 'Controllers directory not found.');
    }

    public function testConfiguredRoutesPointToExistingControllersAndMethods(): void
    {
        $route = [];
        require __DIR__ . '/../application/config/routes.php';

        self::assertIsArray($route);
        self::assertArrayHasKey('default_controller', $route);

        $problems = [];
        foreach ($route as $path => $target) {
            if (!is_string($target) || $target === '' || $path === '404_override' || $path === 'translate_uri_dashes') {
                continue;
            }

            // Ignore fully dynamic closures/callbacks if any are introduced.
            if (strpos($target, '$') !== false) {
                $target = preg_replace('/\/\$\d+/', '', $target) ?: $target;
            }

            $resolved = $this->resolveControllerAndMethod($target);
            if ($resolved === null) {
                $problems[] = sprintf('Route "%s" target "%s" does not map to a controller file.', $path, $target);
                continue;
            }

            [$controllerFile, $method] = $resolved;
            $controllerInfo = $this->getControllerInfo($controllerFile);
            if ($controllerInfo['hasRemap']) {
                continue;
            }

            if (!isset($controllerInfo['methods'][$method])) {
                $problems[] = sprintf(
                    'Route "%s" target "%s" maps to missing method "%s" in %s.',
                    $path,
                    $target,
                    $method,
                    $controllerFile
                );
            }
        }

        self::assertSame([], $problems, "Route integrity issues:\n" . implode("\n", $problems));
    }

    /**
     * @return array{0: string, 1: string}|null
     */
    private function resolveControllerAndMethod(string $target): ?array
    {
        $segments = array_values(array_filter(explode('/', trim($target, '/')), static fn (string $s): bool => $s !== ''));
        if ($segments === []) {
            return null;
        }

        for ($i = count($segments) - 1; $i >= 1; $i--) {
            $controllerPath = implode('/', array_slice($segments, 0, $i));
            $candidate = $this->controllersDir . '/' . $controllerPath . '.php';
            if (is_file($candidate)) {
                $method = $segments[$i] ?? 'index';
                return [$candidate, $method];
            }
        }

        $fallback = $this->controllersDir . '/' . $segments[0] . '.php';
        if (is_file($fallback)) {
            return [$fallback, $segments[1] ?? 'index'];
        }

        return null;
    }

    /**
     * @return array{class: string, methods: array<string, bool>, hasRemap: bool}
     */
    private function getControllerInfo(string $controllerFile): array
    {
        if (isset($this->controllerCache[$controllerFile])) {
            return $this->controllerCache[$controllerFile];
        }

        $code = (string) file_get_contents($controllerFile);
        $tokens = token_get_all($code);

        $class = '';
        $methods = [];
        $nextIsClassName = false;
        $nextIsFunctionName = false;

        foreach ($tokens as $token) {
            if (!is_array($token)) {
                continue;
            }

            if ($token[0] === T_CLASS) {
                $nextIsClassName = true;
                continue;
            }

            if ($nextIsClassName && $token[0] === T_STRING) {
                $class = $token[1];
                $nextIsClassName = false;
                continue;
            }

            if ($token[0] === T_FUNCTION) {
                $nextIsFunctionName = true;
                continue;
            }

            if ($nextIsFunctionName && $token[0] === T_STRING) {
                $methods[strtolower($token[1])] = true;
                $nextIsFunctionName = false;
            }
        }

        $info = [
            'class' => $class,
            'methods' => $methods,
            'hasRemap' => isset($methods['_remap']),
        ];
        $this->controllerCache[$controllerFile] = $info;

        return $info;
    }
}
