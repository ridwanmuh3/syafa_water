import {
  IconActivity,
  IconAlertTriangle,
  IconArrowLeft,
  IconArrowRight,
  IconArrowsSort,
  IconBuildingFactory,
  IconCalendar,
  IconChartLine,
  IconCircleCheck,
  IconDownload,
  IconDroplet,
  IconEdit,
  IconEye,
  IconFilter,
  IconHome,
  IconKey,
  IconLayoutDashboard,
  IconLock,
  IconLogout,
  IconMenu2,
  IconPackage,
  IconPackages,
  IconPlus,
  IconPrinter,
  IconRefresh,
  IconReportAnalytics,
  IconSearch,
  IconShoppingCart,
  IconTrash,
  IconTrendingUp,
  IconX,
  IconUser,
  IconWallet,
  type IconProps as TablerIconProps,
  type TablerIcon,
} from '@tabler/icons-react'
import { cn } from '~/lib/cn'

export type IconName =
  | 'activity'
  | 'alert'
  | 'arrowLeft'
  | 'arrowRight'
  | 'calendar'
  | 'cart'
  | 'chevrons'
  | 'check'
  | 'dashboard'
  | 'download'
  | 'droplet'
  | 'edit'
  | 'eye'
  | 'factory'
  | 'filter'
  | 'home'
  | 'key'
  | 'lock'
  | 'logout'
  | 'menu'
  | 'package'
  | 'plus'
  | 'print'
  | 'report'
  | 'reset'
  | 'search'
  | 'stock'
  | 'trash'
  | 'trend'
  | 'user'
  | 'wallet'
  | 'x'

const icons: Record<IconName, TablerIcon> = {
  activity: IconActivity,
  alert: IconAlertTriangle,
  arrowLeft: IconArrowLeft,
  arrowRight: IconArrowRight,
  calendar: IconCalendar,
  cart: IconShoppingCart,
  chevrons: IconArrowsSort,
  check: IconCircleCheck,
  dashboard: IconLayoutDashboard,
  download: IconDownload,
  droplet: IconDroplet,
  edit: IconEdit,
  eye: IconEye,
  factory: IconBuildingFactory,
  filter: IconFilter,
  home: IconHome,
  key: IconKey,
  lock: IconLock,
  logout: IconLogout,
  menu: IconMenu2,
  package: IconPackage,
  plus: IconPlus,
  print: IconPrinter,
  report: IconReportAnalytics,
  reset: IconRefresh,
  search: IconSearch,
  stock: IconPackages,
  trash: IconTrash,
  trend: IconTrendingUp,
  user: IconUser,
  wallet: IconWallet,
  x: IconX,
}

type IconProps = Omit<TablerIconProps, 'name'> & {
  name: IconName
}

export function Icon({ name, className, ...props }: IconProps) {
  const TablerIconComponent = icons[name]

  return (
    <TablerIconComponent
      aria-hidden="true"
      className={cn('h-4 w-4 shrink-0', className)}
      stroke={1.8}
      {...props}
    />
  )
}
