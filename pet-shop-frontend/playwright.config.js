import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './tests/e2e',
	timeout: 30_000,
	expect: {
		timeout: 5_000
	},
	fullyParallel: false,
	reporter: 'list',
	use: {
		baseURL: 'http://127.0.0.1:4273',
		headless: true,
		screenshot: 'only-on-failure',
		trace: 'on-first-retry'
	},
	webServer: {
		command: 'npm run dev -- --host 127.0.0.1 --port 4273 --strictPort',
		url: 'http://127.0.0.1:4273',
		reuseExistingServer: false,
		timeout: 120_000
	}
});
