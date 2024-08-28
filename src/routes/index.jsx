import { useRoutes } from 'react-router-dom'

import MainLayout from '../layout/MainLayout'
import HomeLayout from '../layout/components/HomeLayout'
import Category from '../pages/Category'
import Home from '../pages/Home'
import Product from '../pages/Product'

export default function Routes () {
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
        path: 'product/:id',
        element: <Product />
      }
    ]
  }
  return useRoutes([Routes])
}
