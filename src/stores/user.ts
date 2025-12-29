import { defineStore } from 'pinia'
import { StorageKeyEnum } from '@/enums/httpEnum'
import { ref, computed } from 'vue'
import type { UserInfo } from '@/views/Login/types'
export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<UserInfo | null>(null)

    const getAccessToken = computed(() => userInfo.value?.access_token)
    const getRefreshToken = computed(() => userInfo.value?.refresh_token)

    function setAuth(auth: UserInfo) {
      userInfo.value = auth
    }
    function setTokens(accessToken: string, refreshToken: string) {
      userInfo.value!.access_token = accessToken
      userInfo.value!.refresh_token = refreshToken
    }
    function clearAuth() {
      userInfo.value = null
    }

    return {
      userInfo,
      getAccessToken,
      getRefreshToken,
      setTokens,
      setAuth,
      clearAuth,
    }
  },
  {
    persist: {
      key: 'USER_STORAGE_KEY',
      storage: localStorage,
    },
  },
)
