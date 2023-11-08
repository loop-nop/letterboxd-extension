async function saveOptions(e) {
	e.preventDefault();
	await browser.storage.sync.set({
		test: "test"
	});
}
