<?php
$currentUri = $_SERVER['REQUEST_URI'] ?? '/';
$currentPath = parse_url($currentUri, PHP_URL_PATH) ?: '/';
$languages = [
    'en' => 'English',
    'es' => 'Español',
    'pt' => 'Português',
    'fr' => 'Français',
    'de' => 'Deutsch',
    'ru' => 'Русский'
];
?>
<nav aria-label="Language switcher" class="language-switcher">
  <ul>
    <?php foreach ($languages as $code => $label): ?>
      <li>
        <a href="/lang-switch.php?lang=<?= urlencode($code) ?>&return=<?= urlencode($currentPath) ?>"
           rel="nofollow"
           hreflang="<?= htmlspecialchars($code, ENT_QUOTES, 'UTF-8') ?>">
          <?= htmlspecialchars($label, ENT_QUOTES, 'UTF-8') ?>
        </a>
      </li>
    <?php endforeach; ?>
  </ul>
</nav>
