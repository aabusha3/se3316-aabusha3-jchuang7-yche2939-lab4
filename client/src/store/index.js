import { reactive } from 'vue'

const chost = 'http://ec2-3-86-147-65.compute-1.amazonaws.com'//change to match the public dns provided by aws

//global variables
export const store = reactive({
  public: true,
  username: '',
  admin: false,
  url: `${chost}:8080/api`,
  front: `${chost}:3000/#`,
  trackToReview: '',
  reviewToDMCA: ''
})
