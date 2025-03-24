<template>
  <div class="bg-black h-screen">
    <div class="status text">{{ error?.statusCode }}</div>
    <div v-if="error?.statusCode===404">
      <div class="message text">Page không tồn như tình yêu của bạn !</div>
    </div>
    <div class="message text" v-else>Yikes!!! Something ain't right!</div>

    <div class="message text">{{ error?.message }}</div>
    <div class="mx-auto container">
      <img class="servers" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Server-multiple.svg" />
      <img class="explode" src="https://upload.wikimedia.org/wikipedia/commons/5/52/Explosion-153710_icon.svg" />
      <img class="explode" src="https://upload.wikimedia.org/wikipedia/commons/5/52/Explosion-153710_icon.svg" />
      <img class="explode" src="https://upload.wikimedia.org/wikipedia/commons/5/52/Explosion-153710_icon.svg" />
      <img class="explode" src="https://upload.wikimedia.org/wikipedia/commons/5/52/Explosion-153710_icon.svg" />
      <img class="explode" src="https://upload.wikimedia.org/wikipedia/commons/5/52/Explosion-153710_icon.svg" />
      <img class="explode" src="https://upload.wikimedia.org/wikipedia/commons/5/52/Explosion-153710_icon.svg" />
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
const error = useError();
const explosions = ref<HTMLImageElement[]>([]);
const serverSVG = ref<HTMLImageElement | null>(null);

function explode(e: HTMLImageElement) {
  e.style.display = 'block';
  if (serverSVG.value) {
    let servers = serverSVG.value.getBoundingClientRect();
    e.style.left = `calc(${Math.round(servers.left + (Math.random() * servers.width / 2))}px + 6vmin)`;
    e.style.top = Math.round(servers.top + (Math.random() * servers.height / 2)) + 'px';
    e.style.transform = `rotate(${Math.round(Math.random() * 360)}deg) scale(${0.5 + Math.random() * 0.5})`;
    setTimeout(() => { e.style.display = 'none' }, 200);
  }
}

onMounted(() => {
  const explosionElements = document.querySelectorAll('.explode');
  explosionElements.forEach((el) => explosions.value.push(el as HTMLImageElement));
  setInterval(() => { explode(explosions.value[Math.floor(Math.random() * explosions.value.length)]) }, 100);
});
</script>

<style scoped>
body {
  background-color: #121212;
  overflow: hidden;
}

.text {
  color: #ddd;    
  text-align: center;
  font-family: "Lucida Console", Monaco, monospace;
  color: #ddd;
  text-align: center;
  text-transform: uppercase;
  text-shadow: 2px 2px 0 #888 , 4px 4px 0 #444 , 6px 6px 0 #222 ;
}

.status {
  padding: 20px;
  font-size: 14vmin;
}

.message {
  font-size: 4vmin;
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.servers {
  display: block;
  width: 30%;
  height: 30%;
  padding-left: 6vmin;
}

.explode {
  display: none;
  position: absolute;
  width: 10%;
}

.servers {
  animation: shake 0.25s; 
  animation-iteration-count: infinite; 
}

@keyframes shake {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-1px, -2px) rotate(-1deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 2px) rotate(-1deg); }
    60% { transform: translate(-3px, 1px) rotate(0deg); }
    70% { transform: translate(3px, 1px) rotate(-1deg); }
    80% { transform: translate(-1px, -1px) rotate(1deg); }
    90% { transform: translate(1px, 2px) rotate(0deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
}
body {
  background-color: #121212;
}
</style>