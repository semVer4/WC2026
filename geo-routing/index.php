<?php

declare(strict_types=1);

/*
 * WC2026 geo-language router
 *
 * Priority:
 * 1. Existing language-prefixed URL stays untouched
 * 2. Cookie-selected language
 * 3. Cloudflare CF-IPCountry mapping
 * 4. Accept-Language browser header
 * 5. Default to English
 *
 * Cloudflare provides CF-IPCountry when IP Geolocation is enabled. [web:42][web:36]
 */

$supported = ['en', 'es', 'pt', 'fr', 'de', 'ru'];
$defaultLang = 'en';
$cookieName = 'wc2026_lang';
$cookieTtl = 60 * 60 * 24 * 180;

$countryToLang = [
    'US' => 'en', 'GB' => 'en', 'CA' => 'en', 'AU' => 'en', 'IE' => 'en', 'NZ' => 'en',
    'ES' => 'es', 'MX' => 'es', 'AR' => 'es', 'CL' => 'es', 'CO' => 'es', 'PE' => 'es', 'UY' => 'es',
    'PT' => 'pt', 'BR' => 'pt',
    'FR' => 'fr', 'BE' => 'fr', 'LU' => 'fr',
    'DE' => 'de', 'AT' => 'de', 'CH' => 'de',
    'RU' => 'ru', 'BY' => 'ru', 'KZ' => 'ru'
];

function normalizePath(string $path): string {
    $path = parse_url($path, PHP_URL_PATH) ?: '/';
    $path = '/' . ltrim($path, '/');
    return $path === '' ? '/' : $path;
}

function isLanguagePrefixed(string $path, array $supported): bool {
    foreach ($supported as $lang) {
        if ($path === '/' . $lang || strpos($path, '/' . $lang . '/') === 0) {
            return true;
        }
    }
    return false;
}

function getBrowserLang(array $supported, string $defaultLang): string {
    $header = $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '';
    if (!$header) {
        return $defaultLang;
    }

    $candidates = [];
    foreach (explode(',', $header) as $part) {
        $part = trim($part);
        if ($part === '') continue;

        $segments = explode(';q=', $part);
        $langRange = strtolower(trim($segments[0]));
        $q = isset($segments[1]) ? (float)$segments[1] : 1.0;
        $base = substr($langRange, 0, 2);

        if (in_array($base, $supported, true)) {
            $candidates[$base] = max($candidates[$base] ?? 0, $q);
        }
    }

    if (!$candidates) {
        return $defaultLang;
    }

    arsort($candidates, SORT_NUMERIC);
    return array_key_first($candidates) ?: $defaultLang;
}

function safeRedirect(string $target, int $status = 302): void {
    header('Cache-Control: private, no-store, max-age=0');
    header('Vary: Accept-Language, CF-IPCountry, Cookie');
    header('Location: ' . $target, true, $status);
    exit;
}

$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$path = normalizePath($requestUri);

if (isLanguagePrefixed($path, $supported)) {
    http_response_code(404);
    echo 'Language-prefixed routes should be served by your multilingual app/router.';
    exit;
}

$cookieLang = $_COOKIE[$cookieName] ?? '';
$cookieLang = in_array($cookieLang, $supported, true) ? $cookieLang : '';

$cfCountry = strtoupper(trim($_SERVER['HTTP_CF_IPCOUNTRY'] ?? ''));
if (!preg_match('/^[A-Z]{2}$/', $cfCountry)) {
    $cfCountry = '';
}

$geoLang = $cfCountry && isset($countryToLang[$cfCountry]) ? $countryToLang[$cfCountry] : '';
$browserLang = getBrowserLang($supported, $defaultLang);

$chosen = $cookieLang ?: ($geoLang ?: $browserLang ?: $defaultLang);
if (!in_array($chosen, $supported, true)) {
    $chosen = $defaultLang;
}

$baseRoutes = [
    '/' => '/',
    '/players/' => '/players/',
    '/teams/' => '/teams/',
    '/world-cup-2026-format/' => '/world-cup-2026-format/',
    '/host-cities/' => '/host-cities/',
    '/faq/' => '/faq/'
];

$route = rtrim($path, '/') . '/';
if ($path === '/') {
    $route = '/';
}

if (!isset($baseRoutes[$route])) {
    http_response_code(404);
    echo 'Unknown route.';
    exit;
}

$cleanTarget = $baseRoutes[$route];

if ($chosen === $defaultLang) {
    header('Cache-Control: private, no-store, max-age=0');
    header('Vary: Accept-Language, CF-IPCountry, Cookie');
    echo "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta http-equiv=\"refresh\" content=\"0;url={$cleanTarget}\"><title>Redirecting</title></head><body>Redirecting to <a href=\"{$cleanTarget}\">{$cleanTarget}</a>.</body></html>";
    exit;
}

$localizedTarget = '/' . $chosen . ($cleanTarget === '/' ? '/' : $cleanTarget);
$localizedTarget = preg_replace('#/+#', '/', $localizedTarget);
safeRedirect($localizedTarget, 302);
