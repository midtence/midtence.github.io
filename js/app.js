const appNode = {
    data(){
        return {counter:0}
    },
    mounted(){
        setInterval(()=>{this.counter++}, 1000)
    }
}

const app = Vue.createApp(appNode).mount('#app');

