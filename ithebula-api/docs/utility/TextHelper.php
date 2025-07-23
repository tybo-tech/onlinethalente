<?php
class TextHelper {
    /**
     * Render any tag (h1, h2, div, span) with content and class.
     * @param string $tag
     * @param string $content
     * @param string $class
     * @return string
     */
    public static function tag($tag, $content, $class = '') {
        $classAttr = $class ? " class=\"$class\"" : "";
        return "<$tag$classAttr>$content</$tag>";
    }
}
