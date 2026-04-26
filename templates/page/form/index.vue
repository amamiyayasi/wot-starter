<script setup lang="ts">
const submitting = ref(false)
const form = reactive({
  projectName: '',
  contact: '',
  tel: '',
  budget: '',
  needDesign: true,
  description: '',
})

const errors = reactive<Record<keyof typeof form, string | null>>({
  projectName: null,
  contact: null,
  tel: null,
  budget: null,
  needDesign: null,
  description: null,
})

definePage({
  name: '__NAME_CAMEL__Form',
  style: {
    navigationBarTitleText: '__TITLE__',
  },
})

const telPattern = /^\d{3,4}-?\d{6,8}$/

function validateField(key: keyof typeof form) {
  const value = form[key]
  switch (key) {
    case 'projectName':
      errors[key] = value ? null : '请输入项目名称'
      break
    case 'contact':
      errors[key] = value ? null : '请输入联系人'
      break
    case 'tel':
      errors[key] = value && telPattern.test(value) ? null : '请输入有效联系电话'
      break
    case 'budget':
      errors[key] = value ? null : '请填写预算范围'
      break
    case 'description':
      errors[key] = value ? null : '请描述项目需求'
      break
    default:
      errors[key] = null
  }
  return !errors[key]
}

function validateAll() {
  const keys = Object.keys(form) as (keyof typeof form)[]
  return keys.every((key) => validateField(key))
}

async function handleSubmit() {
  if (!validateAll())
    return

  submitting.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 600))
    console.log('✅ 表单提交成功：', JSON.parse(JSON.stringify(form)))
    uni.showToast({ title: '提交成功', icon: 'success' })
  }
  finally {
    submitting.value = false
  }
}

function handleReset() {
  form.projectName = ''
  form.contact = ''
  form.tel = ''
  form.budget = ''
  form.needDesign = true
  form.description = ''
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = null
  })
}
</script>

<template>
  <scroll-view class="page" scroll-y>
    <view class="form">
      <view class="form__section">
        <text class="form__title">项目信息</text>
        <wd-field
          v-model="form.projectName"
          label="项目名称"
          placeholder="请输入业务模块名称"
          required
          @blur="validateField('projectName')"
        />
        <text v-if="errors.projectName" class="form__error">{{ errors.projectName }}</text>

        <wd-field
          v-model="form.contact"
          label="联系人"
          placeholder="请输入对接人"
          required
          @blur="validateField('contact')"
        />
        <text v-if="errors.contact" class="form__error">{{ errors.contact }}</text>

        <wd-field
          v-model="form.tel"
          label="联系电话"
          type="number"
          placeholder="示例：020-88888888"
          required
          @blur="validateField('tel')"
        />
        <text v-if="errors.tel" class="form__error">{{ errors.tel }}</text>

        <wd-field
          v-model="form.budget"
          label="预算范围"
          placeholder="例如：2w-3w"
          required
          @blur="validateField('budget')"
        />
        <text v-if="errors.budget" class="form__error">{{ errors.budget }}</text>

        <wd-cell title="是否需要视觉设计" center>
          <template #value>
            <wd-switch v-model="form.needDesign" size="18px" />
          </template>
        </wd-cell>
      </view>

      <view class="form__section">
        <text class="form__title">需求描述</text>
        <wd-textarea
          v-model="form.description"
          placeholder="描述核心功能、交付节点等关键信息"
          show-word-limit
          maxlength="200"
          auto-height
          @blur="validateField('description')"
        />
        <text v-if="errors.description" class="form__error">{{ errors.description }}</text>
      </view>

      <view class="form__actions">
        <wd-button type="primary" block :loading="submitting" @click="handleSubmit">
          提交需求
        </wd-button>
        <wd-button class="mt-3" plain block :disabled="submitting" @click="handleReset">
          重置表单
        </wd-button>
      </view>
    </view>
  </scroll-view>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 24rpx 24rpx 48rpx;
  box-sizing: border-box;
  background: #f9fafb;
}

.form {
  padding: 24rpx;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 12rpx 32rpx rgba(15, 23, 42, 0.08);

  &__section {
    margin-bottom: 40rpx;
  }

  &__title {
    display: block;
    margin-bottom: 20rpx;
    font-size: 30rpx;
    font-weight: 600;
    color: #111827;
  }

  &__error {
    display: block;
    margin: 8rpx 0 16rpx;
    color: #ef4444;
    font-size: 24rpx;
  }

  &__actions {
    margin-top: 24rpx;
  }
}
</style>
