import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'FileName'
})

export class FileNamePipe implements PipeTransform {
    transform(value: string): string {
        if (value.length > 20) {
            return value.slice(0, 20) + '...';
        }
        return value;
    }
}
