<template>
  <canvas class="canvas" ref="canvasElement"></canvas>
</template>

<script setup lang="ts">
import { Canvas, FabricText, FabricObject, loadSVGFromURL, Group } from 'fabric';

const scaleConfig = ref(0.1)
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

    const topLeftSvg = await renderTopLeftImage(fabricCanvas)

    renderTopRightSvg(fabricCanvas)
    //event 
    fabricCanvas.on('object:moving', (e) => {
      const target = e.target;
      if (target === topLeftSvg) {
        // 检查图片是否拖动到文本上方
        if (checkOverlap(topLeftSvg, bottomText)) {
          bottomText.set('text', '--🫳松手跳转到About--')
        } else {
          bottomText.set('text', '将任何人物拖拽到此处');
        }
      }

    })

    fabricCanvas.on('object:modified', (e) => {
      const target = e.target;
      // topImage about
      if (target === topLeftSvg) {
        if (checkOverlap(topLeftSvg, bottomText)) {
          console.log('图片成功放置在文本上方');
        }
      }
    });
  }
})

const renderTopLeftImage = async (fabricCanvas: Canvas) => {
  const topSvg = await loadSVGFromURL('/svg/Ecto-Plasma.svg')
  const objects = topSvg.objects.filter((obj): obj is FabricObject => obj !== null);
  const options = topSvg.options; // 提取选项
  const svgGroup = new Group(objects, options);
  svgGroup.set({
    left: windowWidth.value - options.width * 0.09 + 20, // 靠右对齐
    top: 0,
    scaleX: scaleConfig.value, // 水平缩放
    scaleY: scaleConfig.value  // 垂直缩放
  });
  svgGroup.on('mousedown', () => {
    svgGroup.set('flipX', true);
  })
  svgGroup.on('mouseup', () => {
    svgGroup.set('flipX', false);
  })
  fabricCanvas.add(svgGroup);
  return svgGroup
}
const renderTopRightSvg = async (fabricCanvas: Canvas) => {
  const topSvg = await loadSVGFromURL('/svg/Pacheco.svg')
  const objects = topSvg.objects.filter((obj): obj is FabricObject => obj !== null);
  const options = topSvg.options; // 提取选项
  const svgGroup = new Group(objects, options);
  svgGroup.set({
    left: 100, // 设置左侧位置
    top: 100,  // 设置顶部位置
    scaleX: scaleConfig.value, // 水平缩放
    scaleY: scaleConfig.value  // 垂直缩放
  });

  fabricCanvas.add(svgGroup);
  return svgGroup
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