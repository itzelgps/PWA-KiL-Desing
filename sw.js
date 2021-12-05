importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.0.0/workbox-sw.js");

if (workbox) {
	console.log("Ajua! Workbox está cargado! :) ");
	workbox.precaching.precacheAndRoute([]);

	/*Cache de imagenes en la carpeta, por ejemplo "Others", editamos a otras carpetas que se obtuvieron y configuramos en el archivo sw.js*/
	workbox.routing.registerRoute(
		/(.*)others(.*)\.(?:png|gif|jpg)/,
		new workbox.strategies.CacheFirst({
			cacheName: "images", 
			plugins: [
				new workbox.expiration.Plugin({
					maxEntries: 50,
					maxAgeSeconds: 30 * 24 * 60 * 60,
				})
			]
		})

	);

	/* Hacemos que el contenido en JS, CSS, SCSS sean rapidos devolviendo los "assets" de la cache, mientras se asegura de que se actualizan en segundo plano para su proximo uso. */
	workbox.routing.registerRoute(
		//Cache de JS, CSS y SCC
		/.*\.(?:css|js|scss|)/,
		//Usamos el cache pero actualizamos en segundo plano lo antes posible.
		new workbox.strategies.StaleWhileRevalidate({
			//Usamos el nombre de un cache personalizado.
			cacheName: "assets",
		})

	);

	//Cache de fuentes de Google
	workbox.routing.registerRoute(
		new RegExp("https://fonts.(?:googleapis|gstatic).com/(.*)"),
		new workbox.strategies.CacheFirst({
			cacheName: "google-fonts",
			plugins: [
				new workbox.cacheableResponse.Plugin({
					statuses: [0, 200],
				}),
			],
		})
	);

	//Agregar analisis offline 
	workbox.googleAnalytics.initialize();

	/*Instalar un nuevo service worker y hcaer que actualice y controle la pagina lo antes posible */
	workbox.core.skipWaiting();
	workbox.core.clientsClaim();

} else {
	console.log("¡Falló! Workbox no esta cargado! ): ");
}