<?php
defined('BASEPATH') OR exit('No direct script access allowed');

if (!function_exists('ccis_format_rich_text')) {
    /**
     * Safely render textarea content with:
     * - preserved line breaks and indentation
     * - support for <b>/<strong>/<i>/<em>/<br> tags only
     */
    function ccis_format_rich_text($text)
    {
        $value = (string) $text;
        if ($value === '') {
            return '';
        }

        $normalized = str_replace(["\r\n", "\r"], "\n", $value);
        $escaped = html_escape($normalized);

        // Allow only simple formatting tags with no attributes.
        $escaped = preg_replace('/&lt;(\/?(?:b|strong|i|em))&gt;/i', '<$1>', $escaped);
        $escaped = preg_replace('/&lt;br\s*\/?&gt;/i', '<br>', $escaped);

        $lines = explode("\n", $escaped);
        foreach ($lines as &$line) {
            $line = preg_replace_callback('/^(?:\t| )+/', function ($match) {
                $indent = $match[0];
                $indent = str_replace("\t", '    ', $indent);
                return str_replace(' ', '&nbsp;', $indent);
            }, $line);
        }
        unset($line);

        return implode('<br>', $lines);
    }
}
