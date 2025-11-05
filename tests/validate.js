#!/usr/bin/env node

/**
 * Simple validation script for the redesigned portfolio
 * Tests basic HTML structure, links, and required elements
 */

const fs = require('fs');
const path = require('path');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'blue');
}

// Read the HTML file
const htmlPath = path.join(__dirname, '..', 'index-redesign.html');
const cssPath = path.join(__dirname, '..', 'css', 'redesign.css');
const jsPath = path.join(__dirname, '..', 'js', 'redesign.js');

let html, css, js;
let errors = 0;
let warnings = 0;
let passes = 0;

log('\n' + '='.repeat(60), 'bold');
log('Portfolio Redesign Validation', 'bold');
log('='.repeat(60) + '\n', 'bold');

// Check if files exist
logInfo('Checking file existence...');

try {
  html = fs.readFileSync(htmlPath, 'utf-8');
  logSuccess('index-redesign.html found');
  passes++;
} catch (err) {
  logError('index-redesign.html not found');
  errors++;
  process.exit(1);
}

try {
  css = fs.readFileSync(cssPath, 'utf-8');
  logSuccess('css/redesign.css found');
  passes++;
} catch (err) {
  logError('css/redesign.css not found');
  errors++;
}

try {
  js = fs.readFileSync(jsPath, 'utf-8');
  logSuccess('js/redesign.js found');
  passes++;
} catch (err) {
  logError('js/redesign.js not found');
  errors++;
}

log('');

// Validate HTML structure
logInfo('Validating HTML structure...');

const requiredElements = [
  { tag: '<!DOCTYPE html>', name: 'DOCTYPE declaration' },
  { tag: '<html lang="en">', name: 'HTML lang attribute' },
  { tag: '<meta charset="UTF-8">', name: 'Character encoding' },
  { tag: '<meta name="viewport"', name: 'Viewport meta tag' },
  { tag: '<meta name="description"', name: 'Meta description' },
  { tag: '<title>', name: 'Page title' },
  { tag: '<main', name: 'Main element' },
  { tag: '<nav', name: 'Navigation element' },
  { tag: '<header', name: 'Header element' },
  { tag: '<footer', name: 'Footer element' }
];

requiredElements.forEach(({ tag, name }) => {
  if (html.includes(tag)) {
    logSuccess(`${name} present`);
    passes++;
  } else {
    logError(`${name} missing`);
    errors++;
  }
});

log('');

// Check for required sections
logInfo('Checking for required sections...');

const requiredSections = [
  { id: 'home', name: 'Hero section' },
  { id: 'about', name: 'About section' },
  { id: 'experience', name: 'Experience section' },
  { id: 'projects', name: 'Projects section' },
  { id: 'skills', name: 'Skills section' },
  { id: 'contact', name: 'Contact section' }
];

requiredSections.forEach(({ id, name }) => {
  if (html.includes(`id="${id}"`)) {
    logSuccess(`${name} present`);
    passes++;
  } else {
    logError(`${name} missing`);
    errors++;
  }
});

log('');

// Check for accessibility features
logInfo('Checking accessibility features...');

const a11yFeatures = [
  { check: 'skip-to-main', name: 'Skip to main content link' },
  { check: 'aria-label', name: 'ARIA labels' },
  { check: 'alt=', name: 'Image alt attributes' },
  { check: '<label', name: 'Form labels' },
  { check: 'aria-expanded', name: 'ARIA expanded states' }
];

a11yFeatures.forEach(({ check, name }) => {
  if (html.includes(check)) {
    logSuccess(`${name} implemented`);
    passes++;
  } else {
    logWarning(`${name} not found (may need manual review)`);
    warnings++;
  }
});

log('');

// Check for SEO elements
logInfo('Checking SEO elements...');

const seoElements = [
  { tag: 'og:title', name: 'Open Graph title' },
  { tag: 'og:description', name: 'Open Graph description' },
  { tag: 'og:image', name: 'Open Graph image' },
  { tag: 'twitter:card', name: 'Twitter card' }
];

seoElements.forEach(({ tag, name }) => {
  if (html.includes(tag)) {
    logSuccess(`${name} present`);
    passes++;
  } else {
    logWarning(`${name} missing`);
    warnings++;
  }
});

log('');

// Check CSS
logInfo('Validating CSS...');

const cssChecks = [
  { check: ':root', name: 'CSS Custom Properties defined' },
  { check: '[data-theme="dark"]', name: 'Dark mode styles defined' },
  { check: '@media (max-width:', name: 'Responsive media queries' },
  { check: '@media (prefers-reduced-motion:', name: 'Reduced motion support' },
  { check: 'grid-template-columns', name: 'CSS Grid usage' },
  { check: 'flex', name: 'Flexbox usage' }
];

cssChecks.forEach(({ check, name }) => {
  if (css.includes(check)) {
    logSuccess(`${name}`);
    passes++;
  } else {
    logWarning(`${name} not found`);
    warnings++;
  }
});

log('');

// Check JavaScript
logInfo('Validating JavaScript...');

const jsChecks = [
  { check: 'initMobileNav', name: 'Mobile navigation handler' },
  { check: 'initDarkMode', name: 'Dark mode toggle' },
  { check: 'initSmoothScroll', name: 'Smooth scroll' },
  { check: 'IntersectionObserver', name: 'Intersection Observer for animations' },
  { check: 'initContactForm', name: 'Form validation' },
  { check: 'addEventListener', name: 'Event listeners' }
];

jsChecks.forEach(({ check, name }) => {
  if (js.includes(check)) {
    logSuccess(`${name} implemented`);
    passes++;
  } else {
    logError(`${name} missing`);
    errors++;
  }
});

log('');

// Check for common issues
logInfo('Checking for common issues...');

if (!html.includes('loading="lazy"')) {
  logWarning('No lazy loading attributes found on images');
  warnings++;
} else {
  logSuccess('Lazy loading implemented');
  passes++;
}

if (html.match(/<img[^>]*>/g)) {
  const images = html.match(/<img[^>]*>/g);
  const imagesWithoutAlt = images.filter(img => !img.includes('alt='));
  if (imagesWithoutAlt.length > 0) {
    logWarning(`${imagesWithoutAlt.length} images without alt attributes`);
    warnings++;
  } else {
    logSuccess('All images have alt attributes');
    passes++;
  }
}

if (html.includes('http://')) {
  logWarning('HTTP links found (should use HTTPS)');
  warnings++;
} else {
  logSuccess('No HTTP links found');
  passes++;
}

// File size checks
log('');
logInfo('Checking file sizes...');

const htmlSize = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(2);
const cssSize = (Buffer.byteLength(css, 'utf8') / 1024).toFixed(2);
const jsSize = (Buffer.byteLength(js, 'utf8') / 1024).toFixed(2);

log(`HTML size: ${htmlSize} KB`);
log(`CSS size: ${cssSize} KB`);
log(`JS size: ${jsSize} KB`);

if (parseFloat(htmlSize) > 100) {
  logWarning('HTML file is quite large (>100KB)');
  warnings++;
}

if (parseFloat(cssSize) > 100) {
  logWarning('CSS file is quite large (>100KB)');
  warnings++;
}

if (parseFloat(jsSize) > 50) {
  logWarning('JavaScript file is quite large (>50KB)');
  warnings++;
}

// Summary
log('');
log('='.repeat(60), 'bold');
log('Validation Summary', 'bold');
log('='.repeat(60), 'bold');
log('');
logSuccess(`${passes} checks passed`);
if (warnings > 0) {
  logWarning(`${warnings} warnings`);
}
if (errors > 0) {
  logError(`${errors} errors`);
}

log('');

if (errors === 0 && warnings === 0) {
  log('🎉 All validation checks passed!', 'green');
  log('The redesigned portfolio is ready for testing.', 'green');
} else if (errors === 0) {
  log('✓ Validation passed with warnings', 'yellow');
  log('Review warnings above and address if necessary.', 'yellow');
} else {
  log('✗ Validation failed', 'red');
  log('Please fix the errors above before proceeding.', 'red');
  process.exit(1);
}

log('');
