// plugins/apiUtils.js
export default (context, inject) => {
  const createOrganization = async () => {
    const { $axios, $loading } = context;
    try {
      const response = await $axios.get("/organization");
      if($loading) {
        $loading.finish();
      }
      return response;
    } catch (e) {
      $loading.finish(); // Ensure loading finishes even on error
      alert(e.response.data.message);
      throw e;
    }
  };

  inject('apiUtils', { createOrganization });
};
