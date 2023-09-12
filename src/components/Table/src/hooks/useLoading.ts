export function useLoading() {
	const loadingRef = ref(false);

	const getLoading = computed(() => {
		return unref(loadingRef);
	});

	function setLoading(loading: boolean) {
		loadingRef.value = loading;
	}

	return { getLoading, setLoading };
}
