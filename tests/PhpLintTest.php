<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;

final class PhpLintTest extends TestCase
{
    public function testApplicationPhpFilesHaveNoSyntaxErrors(): void
    {
        $root = realpath(__DIR__ . '/..');
        self::assertNotFalse($root, 'Project root not found.');

        $files = [realpath($root . '/index.php')];
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($root . '/application', FilesystemIterator::SKIP_DOTS)
        );

        foreach ($iterator as $fileInfo) {
            if ($fileInfo->isFile() && strtolower($fileInfo->getExtension()) === 'php') {
                $files[] = $fileInfo->getPathname();
            }
        }

        $files = array_filter(array_unique($files));
        self::assertNotEmpty($files, 'No PHP files discovered for linting.');

        $errors = [];
        foreach ($files as $file) {
            $cmd = escapeshellarg(PHP_BINARY) . ' -l ' . escapeshellarg((string) $file) . ' 2>&1';
            $output = [];
            $exitCode = 0;
            exec($cmd, $output, $exitCode);
            if ($exitCode !== 0) {
                $errors[] = sprintf("%s\n%s", $file, implode("\n", $output));
            }
        }

        self::assertSame([], $errors, "PHP lint errors found:\n\n" . implode("\n\n", $errors));
    }
}
