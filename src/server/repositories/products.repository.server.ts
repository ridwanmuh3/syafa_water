import type { ProductOption } from '~/lib/transactions'
import { demoProductOptions } from '../demo/demo-data.server'

export async function productOptions(): Promise<Array<ProductOption>> {
  return demoProductOptions()
}
