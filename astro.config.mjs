import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
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
