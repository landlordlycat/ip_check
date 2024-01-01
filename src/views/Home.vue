<script setup lang="ts" generic="T">
import { useIpInfoStore } from '@/stores/useIpInfo'
import { computed, onMounted, ref, watch } from 'vue'
import icon from '@/components/icon.vue'
import { storeToRefs } from 'pinia'
//useClipboard
import ClipboardJS from 'clipboard'

import { throttle } from 'lodash'

const ipInfoStore = useIpInfoStore()
const queryIpInfo = ref<string>('')
const isShow = ref<boolean>(false)
const flag = ref<number>(0)
const dialogRef = ref<HTMLDialogElement>()
const iconRef = ref<HTMLDivElement>()
const tokenInput = ref<string>()
//默认ip234
const isCheck = ref<number>(0)

let timer: null | any
const intervalTime = 600

const { ipInfoList, IP, personal, risk_Info } = storeToRefs(ipInfoStore)
onMounted(() => {
  ipInfoStore.getIP()
  new ClipboardJS('.btn')
})

const latitude = computed(() => {
  return ipInfoList.value?.location.latitude + ' ' + ipInfoList.value?.location.longitude
})

const handleRefresh = throttle(function () {
  ipInfoStore.getIP()
  ipInfoStore.getIP123_Risk(queryIpInfo.value)
}, 2000)

const handleQueryIp = throttle(function () {
  const reg = /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/

  if (reg.test(queryIpInfo.value)) {
    isShow.value = false
    ipInfoStore.getIpInfoData(queryIpInfo.value)

    if (isCheck.value === 1) {
      if (localStorage.getItem('token')) {
        ipInfoStore.getScamalytics_Risk(localStorage.getItem('token')!, queryIpInfo.value)
      } else {
        dialogRef.value?.showModal()
        return
      }
    } else {
      ipInfoStore.getIP123_Risk(queryIpInfo.value)
    }
    flag.value = 1
  } else {
    isShow.value = true
  }
}, 2000)

const handleInputChange = () => {
  const reg = /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/

  if (reg.test(queryIpInfo.value) || queryIpInfo.value == '') {
    isShow.value = false
  } else {
    isShow.value = true
  }
}

const handleBack = () => {
  isShow.value = false
  flag.value = 0
}

const handlec = () => {
  if (!localStorage.getItem('token')) {
    dialogRef.value?.showModal()
  }
}

const handleSaveToken = () => {
  localStorage.setItem('token', tokenInput.value!)
}

const handleMouseDown = () => {
  timer = setTimeout(function () {
    if (localStorage.getItem('token')) {
      dialogRef.value?.showModal()
    }
  }, intervalTime)
}
const handleMouseUp = () => {
  clearTimeout(timer)
}
</script>

<template>
  <div class="flex font-bold gap-7 text-xl justify-center shadow-inner">
    <!-- left -->
    <section class="space-y-4 box-border transition-all duration-500 mt-12" :class="[flag == 1 ? 'w-[400px] -translate-x-[30px]' : 'w-[600px]']">
      <div class="nes-container flex items-center justify-between is-rounded">
        <div>
          IP:
          <span id="foo" class="btn" data-clipboard-target="#foo">{{ IP }}</span>
        </div>
        <button type="button" class="nes-btn w-[80px]" @click="handleRefresh">刷新</button>
      </div>
      <div class="nes-container is-rounded space-y-1">
        <div>
          姓名:<span class="ml-3">{{ personal.name }}</span>
        </div>
        <div>
          街道:<span class="ml-3">{{ personal.street }}</span>
        </div>
        <div>
          手机号:<span class="ml-3">{{ personal.phone }}</span>
        </div>
        <div>
          经纬度:<span class="ml-3">{{ latitude }}</span>
        </div>
        <div>
          州/省/区:<span class="ml-3">{{ ipInfoList?.location.state }}</span>
        </div>
        <div>
          城市:<span class="ml-3">{{ ipInfoList?.location.city }}</span>
        </div>
        <div>
          邮编:<span class="ml-3">{{ ipInfoList?.location.zip }}</span>
        </div>
        <!-- 单选框 -->
        <div class="space-x-5 whitespace-nowrap">
          欺诈检测:
          <label>
            <input type="radio" class="nes-radio" name="answer" checked :value="0" v-model="isCheck" />
            <span class="align-top">IP234</span>
          </label>

          <label>
            <input type="radio" class="nes-radio" :value="1" v-model="isCheck" name="answer" />
            <span class="align-top" @click="handlec" @mousedown="handleMouseDown" @mouseup="handleMouseUp">Scamalytics</span>
          </label>
        </div>
      </div>
      <div class="nes-container max-w-screen-sm box-border scroll-smooth is-rounded" ref="iconRef">
        <div class="nes-field">
          <label for="name_field">ip查询</label>
          <input type="text" id="name_field" class="nes-input is—rounded relative" v-model="queryIpInfo" @change="handleInputChange" autocomplete="off" />
          <icon class="absolute nes-pointer top-[53px] right-[40px]" @click="handleQueryIp"></icon>

          <span v-show="isShow" class="text-red-600">输入的ip有误,请重新输入</span>
        </div>
      </div>
    </section>
    <!-- right -->
    <div class="mt-12" v-if="flag">
      <div class="nes-container transition-all is-rounded duration-100 space-y-1 overflow-auto no-scrollbar h-[556px]" :class="[flag == 1 ? '-translate-x-[40px]' : 'translate-x-[100px]']">
        <span class="nes-pointer nes-icon close is-medium" @click="handleBack"> </span>
        <div class="lists">
          <ul class="nes-list is-circle">
            <div class="text-center my-2">
              <span>查询结果</span>
            </div>
            <li>
              ip: <span>{{ ipInfoList?.ip }}</span>
            </li>
            <li>
              滥用: <span>{{ ipInfoList?.is_abuser }}</span>
            </li>
            <li>
              数据中心: <span>{{ ipInfoList?.is_datacenter }}</span>
            </li>
            <li>
              proxy: <span>{{ ipInfoList?.is_proxy }}</span>
            </li>
            <li>
              vpn: <span>{{ ipInfoList?.is_vpn }}</span>
            </li>
            <li>
              移动代理: <span>{{ ipInfoList?.is_mobile }}</span>
            </li>
            <li>
              IDC: <span>{{ ipInfoList?.datacenter.datacenter }}</span>
            </li>
            <li>
              公司: <span>{{ ipInfoList?.company.name }}</span>
            </li>
            <li>
              欺诈值: <span>{{ isCheck === 1 ? risk_Info.scamalytics.risk : risk_Info?.ip123.risk }}</span>
            </li>
            <li>
              分数: <span>{{ isCheck === 1 ? risk_Info.scamalytics.score : risk_Info?.ip123.score }}</span>
            </li>
          </ul>
          <progress class="nes-progress is-rounded is-medium" :value="isCheck === 1 ? risk_Info.scamalytics.score : risk_Info?.ip123.score" max="100"></progress>
          分数越高进度条越满
        </div>
      </div>
    </div>
  </div>

  <!-- dialog -->
  <section>
    <dialog ref="dialogRef" class="nes-dialog is-rounded" id="dialog-rounded">
      <form method="dialog">
        <div class="nes-field mb-8">
          <label for="name_field">token:</label>
          <input type="text" id="name_field" class="nes-input" autocomplete="off" v-model="tokenInput" />
        </div>
        <div>
          <menu class="dialog-menu flex justify-end space-x-5">
            <button class="nes-btn">取消</button>
            <button class="nes-btn is-primary" @click="handleSaveToken">保存</button>
          </menu>
        </div>
      </form>
    </dialog>
  </section>
</template>
