import type { Category } from "$lib/types/zod.js"

export class CatagoryService {
  categories = $state<Category[]>([])

  constructor(data: Category[]) {
    this.categories = data
  }

  setCategories(data: Category[]) {
    this.categories = data
  }

  clearCategories() {
    this.categories = []
  }
}
