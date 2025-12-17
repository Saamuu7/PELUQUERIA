import { Directive, computed, input } from '@angular/core';
import { cn } from '../../../../lib/utils';

@Directive({
    selector: '[app-card]',
    standalone: true,
    host: { '[class]': 'computedClass()' }
})
export class Card {
    readonly class = input<string>('');
    protected computedClass = computed(() => cn("rounded-lg border bg-card text-card-foreground shadow-sm", this.class()));
}

@Directive({
    selector: '[app-card-header]',
    standalone: true,
    host: { '[class]': 'computedClass()' }
})
export class CardHeader {
    readonly class = input<string>('');
    protected computedClass = computed(() => cn("flex flex-col space-y-1.5 p-6", this.class()));
}

@Directive({
    selector: '[app-card-title]', // Usually h3
    standalone: true,
    host: { '[class]': 'computedClass()' }
})
export class CardTitle {
    readonly class = input<string>('');
    protected computedClass = computed(() => cn("text-2xl font-semibold leading-none tracking-tight", this.class()));
}

@Directive({
    selector: '[app-card-description]', // Usually p
    standalone: true,
    host: { '[class]': 'computedClass()' }
})
export class CardDescription {
    readonly class = input<string>('');
    protected computedClass = computed(() => cn("text-sm text-muted-foreground", this.class()));
}

@Directive({
    selector: '[app-card-content]',
    standalone: true,
    host: { '[class]': 'computedClass()' }
})
export class CardContent {
    readonly class = input<string>('');
    protected computedClass = computed(() => cn("p-6 pt-0", this.class()));
}

@Directive({
    selector: '[app-card-footer]',
    standalone: true,
    host: { '[class]': 'computedClass()' }
})
export class CardFooter {
    readonly class = input<string>('');
    protected computedClass = computed(() => cn("flex items-center p-6 pt-0", this.class()));
}
