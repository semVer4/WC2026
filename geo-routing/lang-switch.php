<?php

declare(strict_types=1);

$supported = ['en', 'es', 'pt', 'fr', 'de', 'ru'];
$defaultLang = 'en';
$cookieName = 'wc2026_lang';
$cookieTtl = 60 * 60 * 24 * 180;

$lang = strtolower(trim($_GET['lang'] ?? ''));
$return = $_GET['return'] ?? '/';
$returnPath = parse_url($return, PHP_URL_PATH) ?: '/';
$returnPath = '/' . ltrim($returnPath, '/');

if (!in_array($lang, $supported, true)) {
    $lang = $defaultLang;
}

setcookie($cookieName, $lang, [
    'expires' => time() + $cookieTtl,
    'path' => '/',
    'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
    'httponly' => false,
    'samesite' => 'Lax'
]);

function stripLangPrefix(string $path, array $supported): string {
    foreach ($supported as $supportedLang) {
        if ($path === '/' . $supportedLang) {
            return '/';
        }
        if (strpos($path, '/' . $supportedLang . '/') === 0) {
            return '/' . ltrim(substr($path, strlen('/' . $supportedLang . '/')), '/');
        }
    }
    return $path;
}

$returnPath = stripLangPrefix($returnPath, $supported);
$returnPath = preg_replace('#/+#', '/', $returnPath);
if ($returnPath !== '/' && substr($returnPath, -1) !== '/') {
    $returnPath .= '/';
}

$target = ($lang === $defaultLang)
    ? $returnPath
    : '/' . $lang . ($returnPath === '/' ? '/' : $returnPath);

$target = preg_replace('#/+#', '/', $target);

header('Cache-Control: private, no-store, max-age=0');
header('Vary: Accept-Language, CF-IPCountry, Cookie');
header('Location: ' . $target, true, 302);
exit;
