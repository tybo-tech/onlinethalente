<?php
class TableGenerator {
    /**
     * Generate a classic table (with optional header classes/column align).
     * @param array $headers [['label' => ..., 'class' => ...], ...]
     * @param array $rows [['cell1', 'cell2', ...], ...]
     * @param string $tableClass (optional extra CSS classes)
     * @return string
     */
    public static function render($headers, $rows, $tableClass = '') {
        $html = "<table class=\"$tableClass\" cellspacing=\"0\" cellpadding=\"0\">";
        // Headers
        $html .= '<thead><tr>';
        foreach ($headers as $header) {
            $label = htmlspecialchars($header['label']);
            $class = !empty($header['class']) ? " class=\"{$header['class']}\"" : "";
            $html .= "<th{$class}>{$label}</th>";
        }
        $html .= '</tr></thead>';
        // Rows
        $html .= '<tbody>';
        foreach ($rows as $row) {
            $html .= '<tr>';
            foreach ($row as $cell) {
                $html .= "<td>" . (is_string($cell) ? $cell : strval($cell)) . "</td>";
            }
            $html .= '</tr>';
        }
        $html .= '</tbody></table>';
        return $html;
    }
}
