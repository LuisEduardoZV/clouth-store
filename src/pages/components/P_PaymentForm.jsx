import { useState } from 'react'

import { IconBrandPaypalFilled, IconCreditCard, IconCreditCardFilled } from '@tabler/icons-react'
import { Collapse, Flex, Form, Input, Typography } from 'antd'

import CreditCardForm from './extended/CreditCardForm'
import StepButtonsPayment from './extended/StepButtonsPayment'

import { useDispatch, useSelector } from '../../store'
import { setPaymentData } from '../../store/cartSlice'

const PPaymentForm = ({ handleBack, handleNext, current, steps }) => {
  const [debit] = Form.useForm()
  const [credit] = Form.useForm()

  const { checkout } = useSelector(state => state.cart)
  const dispatch = useDispatch()

  const [paymentType, setPaymentType] = useState(checkout.payment.type ?? '')
  const [initValues] = useState(checkout.payment?.data ?? {})

  const handleSetPayment = (data) => {
    dispatch(setPaymentData({ type: paymentType, data }))
    handleNext()
  }

  const items = [
    {
      key: 'credit',
      label: (
        <Flex style={{ alignItems: 'center', gap: 5 }}>
          <IconCreditCard />
          Credit Card
        </Flex>
      ),
      children: <CreditCardForm form={credit} initValues={initValues} handleFinish={handleSetPayment} name='credit-payment-form' />,
      showArrow: false
    },
    {
      key: 'debit',
      label: (
        <Flex style={{ alignItems: 'center', gap: 5 }}>
          <IconCreditCardFilled />
          Debit Card
        </Flex>
      ),
      children: <CreditCardForm form={debit} initValues={initValues} handleFinish={handleSetPayment} name='debit-payment-form' />,
      showArrow: false
    },
    {
      key: 'paypal',
      label: (
        <Flex style={{ alignItems: 'center', gap: 5 }}>
          <IconBrandPaypalFilled />
          PayPal
        </Flex>
      ),
      children: (
        <Flex vertical>
          <Typography.Paragraph>
            Enter the email address affiliated to your PayPal account and follow the steps in the pop-up window when you finish the process:
          </Typography.Paragraph>
          <Input placeholder='Email' type='email' />
        </Flex>
      ),
      showArrow: false
    }
  ]

  return (
    <>
      <Flex style={{ width: '100%' }}>
        <Collapse accordion items={items} defaultActiveKey={[paymentType]} style={{ width: '100%' }} onChange={key => setPaymentType(key[0])} />
      </Flex>
      <StepButtonsPayment
        handleBack={handleBack}
        handleNext={handleSetPayment}
        current={current}
        steps={steps}
        noNext
      />
    </>
  )
}

export default PPaymentForm
