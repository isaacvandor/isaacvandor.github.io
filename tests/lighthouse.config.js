/**
 * Lighthouse CI Configuration
 * Performance, Accessibility, Best Practices, and SEO testing
 */

module.exports = {
  ci: {
    collect: {
      url: ['../index-redesign.html'],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        // Emulate a fast 4G connection
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1
        }
      }
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        // Performance thresholds
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],

        // Accessibility
        'categories:accessibility': ['error', { minScore: 0.95 }],

        // Best Practices
        'categories:best-practices': ['error', { minScore: 0.95 }],

        // SEO
        'categories:seo': ['error', { minScore: 0.95 }],

        // Specific checks
        'uses-responsive-images': 'warn',
        'offscreen-images': 'warn',
        'uses-webp-images': 'warn',
        'modern-image-formats': 'warn',
        'uses-optimized-images': 'warn',
        'uses-text-compression': 'warn',
        'unused-css-rules': 'warn',
        'unused-javascript': 'warn',
        'render-blocking-resources': 'warn',

        // HTML checks
        'html-has-lang': 'error',
        'meta-description': 'error',
        'viewport': 'error',
        'document-title': 'error',

        // Accessibility checks
        'color-contrast': 'error',
        'button-name': 'error',
        'image-alt': 'error',
        'label': 'error',
        'link-name': 'error',
        'valid-lang': 'error',

        // Security
        'is-on-https': 'warn',
        'external-anchors-use-rel-noopener': 'error'
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
