import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Set base path for S3 deployment
	base: '/projects/slaher-stats',
	
	// Enable client-side routing
	output: 'static',
	
	// Configure build output
	build: {
		assets: 'assets'
	},
	
	// Configure vite for proper asset handling
	vite: {
		build: {
			rollupOptions: {
				output: {
					assetFileNames: 'assets/[name].[ext]'
				}
			}
		}
	}
});
