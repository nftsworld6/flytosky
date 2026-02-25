import { MockHotelsProvider } from '@/lib/providers/hotels.provider'
import type { SearchHotelsInput } from './types'

export class HotelsService {
  private provider = new MockHotelsProvider()

  async searchHotels(input: SearchHotelsInput) {
    return this.provider.searchHotels(input)
  }
}