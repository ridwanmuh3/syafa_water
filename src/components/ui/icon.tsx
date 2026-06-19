import {
  IconActivity,
  IconAlertTriangle,
  IconArrowLeft,
  IconArrowRight,
  IconArrowsSort,
  IconBuildingFactory,
  IconCalendar,
  IconChartLine,
  IconDroplet,
  IconEdit,
  IconFilter,
  IconKey,
  IconLayoutDashboard,
  IconLock,
  IconLogout,
  IconPackage,
  IconPackages,
  IconPlus,
  IconRefresh,
  IconReportAnalytics,
  IconSearch,
  IconShoppingCart,
  IconTrendingUp,
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
  | 'dashboard'
  | 'droplet'
  | 'edit'
  | 'factory'
  | 'filter'
  | 'key'
  | 'lock'
  | 'logout'
  | 'package'
  | 'plus'
  | 'report'
  | 'reset'
  | 'search'
  | 'stock'
  | 'trend'
  | 'user'
  | 'wallet'

const icons: Record<IconName, TablerIcon> = {
  activity: IconActivity,
  alert: IconAlertTriangle,
  arrowLeft: IconArrowLeft,
  arrowRight: IconArrowRight,
  calendar: IconCalendar,
  cart: IconShoppingCart,
  chevrons: IconArrowsSort,
  dashboard: IconLayoutDashboard,
  droplet: IconDroplet,
  edit: IconEdit,
  factory: IconBuildingFactory,
  filter: IconFilter,
  key: IconKey,
  lock: IconLock,
  logout: IconLogout,
  package: IconPackage,
  plus: IconPlus,
  report: IconReportAnalytics,
  reset: IconRefresh,
  search: IconSearch,
  stock: IconPackages,
  trend: IconTrendingUp,
  user: IconUser,
  wallet: IconWallet,
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
