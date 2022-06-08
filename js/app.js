const appNode = {
    data(){
        return {counter:0}
    },
    mounted(){
        setInterval(()=>{
            this.counter++;
            // console.log(this);
        }, 1000)
    }
}

const app = Vue.createApp(appNode).mount('#app');


const EventHandling = {
    data() {
      return {
        message: 'Hello Vue.js!'
      }
    },
    methods: {
      reverseMessage() {
        this.message = this.message
          .split('')
          .reverse()
          .join('')
      }
    }
  }
  
  Vue.createApp(EventHandling).mount('#event-handling')


  const TwoWayBinding = {
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }
  
  Vue.createApp(TwoWayBinding).mount('#two-way-binding')


  const ConditionalRendering = {
    data() {
      return {
        seen: true
      }
    }
  }
  
  Vue.createApp(ConditionalRendering).mount('#conditional-rendering')
  

  const ListRendering = {
    data() {
      return {
        todos: [
          { text: 'Learn JavaScript' },
          { text: 'Learn Vue' },
          { text: 'Build something awesome' }
        ]
      }
    }
  }
  
  Vue.createApp(ListRendering).mount('#list-rendering')