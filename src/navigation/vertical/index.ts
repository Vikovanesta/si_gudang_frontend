import type { VerticalNavItems } from '@layouts/types'
import dashboard from './dashboard'
import dataMaster from './data-master'
import manajemenPengguna from './manajemen-pengguna'
import monitoringAlat from './monitoring-alat'

export default [
  ...dashboard,
  ...monitoringAlat,
  ...dataMaster,
  ...manajemenPengguna,
  // ...appsAndPages, 
  // ...uiElements, 
  // ...forms, 
  // ...charts, 
  // ...others
] as VerticalNavItems
