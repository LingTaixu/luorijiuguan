<template>
  <canvas class="canvas" ref="canvasElement"></canvas>
</template>

<script setup lang="ts">
import { Canvas, FabricObject, FabricImage, Rect } from 'fabric';

import { parseGIF, decompressFrames } from 'gifuct-js';

const windowWidth = ref<number>(0);
const windowHeight = ref<number>(0);
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
      width: windowWidth.value,
      height: windowHeight.value,
    })

    // init 
    backgroundRender(fabricCanvas)
    const { backgroundGif, transparentRect } = await renderGif('/images/2ff4e5128de882090260441b04f92de4.gif', fabricCanvas)
    const MimiFunction: FabricImage = await renderMimi(fabricCanvas)
    //event 
    fabricCanvas.on('object:moving', (e) => {
      const target = e.target;
      if (target === MimiFunction) {
        // 检查图片是否拖动到文本上方
        if (checkOverlap(MimiFunction, transparentRect)) {
          console.log(1);
        } else {
          console.log(2);
        }
      }
    })
    console.log(backgroundGif, 'backgroundGif');


    //event 
    fabricCanvas.on('object:moving', (e) => {
      const target = e.target;


    })


  }
})

// render Function

const renderMimi = async (fabricCanvas: Canvas) => {
  const mimi = await FabricImage.fromURL('/images/535837a68e8a8d1bc85c5e3eb7f94b8e.png')
  mimi.set({
    left: 0,
    top: 0,
  })
  mimi.scale(0.1)
  fabricCanvas.add(mimi)
  return mimi
}

// Gif Render
const renderGif = async (url: string, fabricCanvas: Canvas) => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const gif = parseGIF(arrayBuffer);
  const frames = decompressFrames(gif, true);
  // 存储所有帧的 Image 元素
  const frameImages = await Promise.all(
    frames.map((frame) => {
      return new Promise<HTMLImageElement>((resolve) => {
        const imageData = frame.patch;
        const canvasElement = document.createElement('canvas');

        canvasElement.width = frame.dims.width;
        canvasElement.height = frame.dims.height;

        const ctx: CanvasRenderingContext2D = canvasElement.getContext('2d') as CanvasRenderingContext2D;
        if (ctx === null) {
          throw new Error('无法获取 CanvasRenderingContext2D');
        }


        const imageDataObject = new ImageData(new Uint8ClampedArray(imageData), frame.dims.width, frame.dims.height);
        ctx.putImageData(imageDataObject, 0, 0);

        const img = new Image();
        img.src = canvasElement.toDataURL();
        img.onload = () => resolve(img);
      });
    })
  );

  const backgroundGif: any = await FabricImage.fromElement(frameImages[0])
  backgroundGif.set({
    left: windowWidth.value - (frameImages[0].width * 0.7),
    top: windowHeight.value - (frameImages[0].height * 0.7),
    selectable: false,
    evented: false,
  })
  backgroundGif.scale(0.7)
  fabricCanvas.add(backgroundGif)

  const transparentRect = new Rect({
    left: windowWidth.value - (frameImages[0].width * 0.7),
    top: windowHeight.value - (frameImages[0].height * 0.7),
    width: frameImages[0].width * 0.7,
    height: frameImages[0].height * 0.7,
    fill: 'rgba(255, 255, 255, 0)', // 半透明白色
    selectable: false // 不允许选择
  });
  fabricCanvas.add(transparentRect)



  fabricCanvas.renderAll()
  // 实现GIF
  animateGif(backgroundGif, frameImages, 0, fabricCanvas)
  return { backgroundGif, transparentRect }
}


// background render
const backgroundRender = async (fabricCanvas: Canvas) => {
  const background = await FabricImage.fromURL('/images/background.jpg')
  background.set({
    selectable: false,  // 设置为不可选择
    evented: false,     // 设置为不可事件
    scaleX: fabricCanvas.width / background.width,
    scaleY: fabricCanvas.height / background.height
  })

  fabricCanvas.add(background)
}


//
const animateGif = (fabricImage: FabricImage, frames: HTMLImageElement[], currentFrameIndex: number, FabricCanvas: Canvas) => {
  fabricImage.setElement(frames[currentFrameIndex]);
  FabricCanvas.renderAll();

  // 设置定时器更新下一帧
  const nextFrameIndex = (currentFrameIndex + 1) % frames.length;
  setTimeout(() => animateGif(fabricImage, frames, nextFrameIndex, FabricCanvas), 100); // 设置帧动画间隔
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