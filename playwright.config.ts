import { defineConfig, devices } from '@playwright/experimental-ct-svelte';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './tests',
	/* The base directory, relative to the config file, for snapshot files created with toMatchSnapshot and toHaveScreenshot. */
	snapshotDir: './playwright/__snapshots__',
	/* Maximum time one test can run for. */
	timeout: 10 * 1000,
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: process.env.CI ? 'html' : 'list',
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry',

		/* Port to use for Playwright component endpoint. */
		ctPort: 3100,
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
		},
	],

	/* Run your local dev server before starting the tests */
	webServer: {
		reuseExistingServer: !process.env.CI,
		command: 'npm run dev',
		port: 5173,
	},
});
