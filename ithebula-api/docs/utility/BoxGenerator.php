<?php
class BoxGenerator {
    /**
     * Render a styled box with content.
     * @param string $content HTML inside the box
     * @param string $class Optional extra CSS class
     * @return string
     */
    public static function render($content, $class = '') {
        return "<div class=\"bank-details $class\">$content</div>";
    }
}
