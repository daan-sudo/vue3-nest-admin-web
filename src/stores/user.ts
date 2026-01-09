import { defineStore } from 'pinia'
import { StorageKeyEnum } from '@/enums/httpEnum'
import { ref, computed, reactive } from 'vue'
import type { Token, UserInfo } from '@/views/Login/types'
import { getProxyUrl } from '@/utils/index'
import { getUserInfoApi } from '@/api/user'
export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<UserInfo | null>(null)
    const token = ref<Token>({
      access_token: '',
      refresh_token: '',
    })

    const getAccessToken = computed(() => token.value.access_token)
    const getRefreshToken = computed(() => token.value.refresh_token)

    function setAuth(auth: UserInfo) {
      userInfo.value = auth
      // userInfo.value.avatar = getProxyUrl(auth.avatar)
    }
    function setTokens(accessToken: string, refreshToken: string) {
      token.value.access_token = accessToken
      token.value.refresh_token = refreshToken
    }
    function clearAuth() {
      userInfo.value = null
      token.value.access_token = ''
      token.value.refresh_token = ''
    }
    // 获取用户信息
    async function getInfoApi() {
      const res = await getUserInfoApi()
      setAuth(res)
    }
    return {
      userInfo,
      token,
      getAccessToken,
      getRefreshToken,
      setTokens,
      setAuth,
      clearAuth,
      getInfoApi,
    }
  },
  {
    persist: {
      key: 'USER_STORAGE_KEY',
      storage: localStorage,
    },
  },
)
