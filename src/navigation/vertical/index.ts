import type { VerticalNavItems } from '@layouts/types'
import appsAndPages from './apps-and-pages'
import charts from './charts'
import dashboard from './dashboard'
import dataMaster from './data-master'
import forms from './forms'
import manajemenPengguna from './manajemen-pengguna'
import monitoringAlat from './monitoring-alat'
import others from './others'
import uiElements from './ui-elements'

export default [
  ...dashboard,
  ...monitoringAlat,
  ...dataMaster,
  ...manajemenPengguna,
  ...appsAndPages, 
  ...uiElements, 
  ...forms, 
  ...charts, 
  ...others
] as VerticalNavItems
