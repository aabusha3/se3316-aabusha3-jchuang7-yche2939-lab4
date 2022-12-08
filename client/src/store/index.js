import { reactive } from 'vue'

//global variables
export const store = reactive({
  public: true,
  username: '',
  admin: false
})
