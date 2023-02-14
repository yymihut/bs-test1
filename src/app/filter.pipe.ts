// nu este implementat searchul

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class FilterPipe implements PipeTransform {
  transform(languages: string[], searchInput: string): any[] {
    if (!searchInput) {
      return [];
    }

    searchInput = searchInput.toLowerCase();
    return languages.filter((x) => x.toLowerCase().includes(searchInput));
  }
}
