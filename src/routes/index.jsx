import { useLocation, useRoutes } from 'react-router-dom'

import MainLayout from '../layout/MainLayout'
import HomeLayout from '../layout/components/HomeLayout'
import Cart from '../pages/Cart'
import Category from '../pages/Category'
import Home from '../pages/Home'
import Payment from '../pages/Payment'
import Product from '../pages/Product'

export default function Routes () {
  const { state } = useLocation()

  const Routes = {
    path: '/',
    element: (
      <MainLayout />
    ),
    children: [
      {
        path: '',
        element: <HomeLayout><Home /></HomeLayout>
      },
      {
        path: ':category',
        element: <HomeLayout><Category /></HomeLayout>
      },
      {
        path: ':category/product/:id',
        element: <Product {...state} />
      },
      {
        path: 'shopping-cart',
        element: <Cart />
      },
      {
        path: 'payment',
        element: <Payment />
      }
    ]
  }
  return useRoutes([Routes])
}
