// plugins/vercelAnalytics.client.ts
import { inject } from '@vercel/analytics';

export default defineNuxtPlugin(() => {
  // 调用 inject() 来注入 Vercel Analytics
  inject();
});
