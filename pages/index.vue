<template>
  <canvas class="canvas" ref="canvasElement"></canvas>
</template>

<script setup lang="ts">

const windowWidth = ref<number>(0);
const windowHeight = ref<number>(0);
import { Canvas, FabricImage, FabricText, FabricObject } from 'fabric';
// 定义一个函数来更新窗口尺寸
const updateWindowSize = () => {
  windowWidth.value = window.innerWidth;
  windowHeight.value = window.innerHeight;
};


const canvasElement = ref<HTMLCanvasElement | null>(null);


onMounted(async () => {
  updateWindowSize()
  if (import.meta.client && canvasElement.value) {
    const fabricCanvas = new Canvas(canvasElement.value, {
      backgroundColor: 'aliceblue', // 设置背景色
      width: windowWidth.value,
      height: windowHeight.value
    })




    // 计算矩形的高度和位置
    const rectHeight = windowHeight.value * 0.2;  // 矩形高度为画布高度的30%
    const rectTop = windowHeight.value * 0.8;     // 将矩形顶部放在70%高度的位置



    // 创建文本 "将任何人物拖拽到此处"
    const bottomText = new FabricText('将任何人物拖拽到此处', {
      left: windowWidth.value / 2 - 90, // 文本的初始位置
      top: rectTop + rectHeight / 2 - 10, // 文本在矩形的垂直居中
      fontSize: 20,
      selectable: false,
      textAlign: 'center',
    });
    fabricCanvas.add(bottomText);

    const topLeftImage: FabricImage = await renderTopLeftImage(fabricCanvas)
    const topRightImage: FabricImage = await renderTopRightImage(fabricCanvas)

    //event 
    fabricCanvas.on('object:moving', (e) => {
      const target = e.target;
      if (target === topLeftImage) {
        // 检查图片是否拖动到文本上方
        if (checkOverlap(topLeftImage, bottomText)) {
          bottomText.set('text', '--🫳松手跳转到About--')
        } else {
          bottomText.set('text', '将任何人物拖拽到此处');
        }
      }

    })

    fabricCanvas.on('object:modified', (e) => {
      const target = e.target;
      // topImage about
      if (target === topLeftImage) {
        if (checkOverlap(topLeftImage, bottomText)) {
          console.log('图片成功放置在文本上方');
        }
      }
    });
  }
})

const renderTopLeftImage = async (fabricCanvas: Canvas) => {
  const topImage = await FabricImage.fromURL('/images/walking-contradiction.png', {
    crossOrigin: 'anonymous' // 如果需要跨域
  })
  topImage.scale(0.08)
  topImage.set({
    left: -20,
    top: 0,
  });
  topImage.on('mousedown', () => {
    topImage.set('flipX', true);
  })
  topImage.on('mouseup', () => {
    topImage.set('flipX', false);
  })
  fabricCanvas.add(topImage)
  return topImage
}

const renderTopRightImage = async (fabricCanvas: Canvas) => {
  const topImage = await FabricImage.fromURL('/images/ecto-plasma.png', {
    crossOrigin: 'anonymous' // 如果需要跨域
  })
  topImage.scale(0.08)
  topImage.set({
    left: windowWidth.value - topImage.width * 0.08, // 靠右对齐
    top: 0,
  });
  topImage.on('mousedown', () => {
    topImage.set('flipX', true);
  })
  topImage.on('mouseup', () => {
    topImage.set('flipX', false);
  })
  fabricCanvas.add(topImage)
  return topImage
}

// 碰撞检测函数：检查图片是否与文本重叠
const checkOverlap = (image: FabricObject, text: FabricObject) => {
  const imageBounds = image.getBoundingRect();
  const textBounds = text.getBoundingRect();

  // 检查图片的边界是否与文本的边界重叠
  return !(
    imageBounds.left > textBounds.left + textBounds.width ||
    imageBounds.left + imageBounds.width < textBounds.left ||
    imageBounds.top > textBounds.top + textBounds.height ||
    imageBounds.top + imageBounds.height < textBounds.top
  );
}

// event function



onUnmounted(() => {
  window.removeEventListener('resize', updateWindowSize);
});

definePageMeta({
  title: '主页'
})
</script>

<style scoped>
.canvas {
  background-color: aliceblue;
}
</style>