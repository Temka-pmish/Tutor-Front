import { apiClient } from "@/app/api"
import type { RegData } from "./AuthTypes"
import { type RouteLocationNormalizedLoaded } from "vue-router"
import type { FormSubmitEvent } from "@primevue/forms"
import { useUserStore } from "@/app/stores/userStore"
import { redirectRole } from "@/app/utils/redirectRole"
import type { AxiosError, AxiosResponse } from "axios"


const successAuth = (response: AxiosResponse) => {
  const userStore = useUserStore()
  userStore.setUser(response.data)
  redirectRole()
}


export const emailError = (error: AxiosError, e: FormSubmitEvent) => {
  type ErrorResponse = {
    error: string | undefined
  }
  const data = error.response?.data as ErrorResponse
  if (data.error && typeof (data.error) === 'string') {
    e.states.email.error = {
      message: data.error,
    };
  } else {
    e.states.email.error = {
      message: 'Что-то пошло не так',
    };
  }
}

export const authService = {
  authenticate: async (e: FormSubmitEvent) => {
    apiClient.post('/auth/authenticate', e.values, { headers: {'Authorization':''} }).then(response => {
      successAuth(response)
    }).catch(error => {
      emailError(error, e)
    })
  },
  register: async ({ e, route }: { e: FormSubmitEvent, route: RouteLocationNormalizedLoaded }) => {
    const body = { ...e.values }
    delete body.confirmPassword
    apiClient.post(`/auth/registration/${route.params.regToken}`, body,  { headers: {'Authorization':''} }).then(response => {
      successAuth(response)
    }).catch(error => {
      emailError(error, e)
    })
  },
  getRegData: async (route: RouteLocationNormalizedLoaded): Promise<RegData> => {
    const response = await apiClient.get(`/auth/register/${route.params.regToken}`,  { headers: {'Authorization':''} })
    return response.data
  },
  reset: async (e: FormSubmitEvent) => {
    apiClient.post(`/auth/register`, e.values, { headers: {'Authorization':''} }).catch(error => {
      emailError(error, e)
    })
  },

}

