import { ChangeDetectionStrategy, Component, computed, ElementRef, HostListener, signal, ViewChild } from '@angular/core';
import { MaterialModule } from '../../shared/material.module';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CustomSidenav } from '../custom-sidenav/custom-sidenav';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { filter, Subscription } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

export interface AppMenuDto {
  name: string;
  path: string;
  icon?: string;
}

const VISITED_KEY = 'menuVisited';

@Component({
  selector: 'app-layout-wrapper',
  imports: [
    CommonModule,
    RouterOutlet,
    CustomSidenav,
    MaterialModule,
    ReactiveFormsModule,
  ],
  templateUrl: './layout-wrapper.html',
  styleUrl: './layout-wrapper.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutWrapper {
   @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  userProfileName = 'Akhil Manikandan';
  hasNewNotification = false;
  collapsed = signal(true);
  searchQuery = signal('');
  notifications = [
    { id: 1, message: 'New order received', read: false },
    { id: 2, message: 'Shipment delayed', read: false },
    { id: 3, message: 'Inventory low for Product X', read: true }
  ];

  constructor(private router: Router) {}

  ngOnChanges() {
  if (this.notifications.length > 0) {
    this.hasNewNotification = true;

    setTimeout(() => {
      this.hasNewNotification = false;
    }, 1000);
  }
}

  sidenavWidth = computed(() => (this.collapsed() ? '65px' : '220px'));

  get toggleIcon(): string {
    return this.collapsed() ? 'format_indent_increase' : 'format_indent_decrease';
  }

  get notificationIcon(): string {
    return this.notifications.length > 0 ? 'notifications_active' : 'notifications';
  }

  // ── Search state ──────────────────────────────────
  searchControl = new FormControl('');
  filteredMenus: AppMenuDto[] = [];
  allMenus: AppMenuDto[] = [];
  private searchSub!: Subscription;
 
  // Replace with your dynamic menu source if needed
  private readonly routeMenus: AppMenuDto[] = [
    { name: 'Dashboard',       path: '/dashboard',       icon: 'dashboard' },
    { name: 'Warehouses',      path: '/warehouses',      icon: 'warehouse' },
    { name: 'Locations',       path: '/locations',       icon: 'location_on' },
    { name: 'Shipment Types',  path: '/shipment-types',  icon: 'local_shipping' },
    { name: 'Marine Products', path: '/marine-products', icon: 'directions_boat' },
    { name: 'Ship Spares',     path: '/ship-spares',     icon: 'assignment' },
    { name: 'Port',            path: '/port',            icon: 'anchor' },
  ];

   ngOnInit(): void {
  // Track every navigation automatically
  this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.addToVisited(event.urlAfterRedirects);
    });

  // existing search subscription
  this.searchSub = this.searchControl.valueChanges.subscribe(value => {
    if (typeof value === 'string') {
      if (value.trim()) {
        this.filteredMenus = this.allMenus.filter(m =>
          m.name.toLowerCase().includes(value.toLowerCase())
        );
      } else {
        this.populateLastVisited();
      }
    }
  });
}

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }
 
  // Ctrl+Space to focus search from anywhere
  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.ctrlKey && event.code === 'Space') {
      event.preventDefault();
      this.searchInput?.nativeElement.focus();
    }
  }
 
  initSearch(): void {
    this.allMenus = this.routeMenus;
    this.populateLastVisited();
  }
 
  onSelect(event: MatAutocompleteSelectedEvent): void {
  const menu = event.option.value as AppMenuDto;
  this.addToVisited(menu.path);
  console.log('visited:', localStorage.getItem(VISITED_KEY)); // ← verify
  this.router.navigateByUrl(menu.path);
  setTimeout(() => {
    this.searchControl.setValue('');
    this.filteredMenus = [];
  }, 1);
}
 
  onSelectNewWin(event: MouseEvent, menu: AppMenuDto): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    window.open(menu.path, '_blank');
    this.addToVisited(menu.path);
  }
 
  displayFn(menu: AppMenuDto | string): string {
    if (!menu) return '';
    return typeof menu === 'string' ? menu : menu.name;
  }
 
  private populateLastVisited(): void {
    if (this.searchControl.value) return;

    if (this.allMenus.length === 0) {
      this.allMenus = this.routeMenus;
    }

    const raw = localStorage.getItem(VISITED_KEY);
    if (raw) {
      const visited = JSON.parse(raw) as { path: string }[];

      // Build result in visited order (most recent first)
      this.filteredMenus = visited
        .map(v => this.allMenus.find(m => m.path === v.path))
        .filter((m): m is AppMenuDto => !!m);
    } else {
      this.filteredMenus = [];
    }
  }
 
  private addToVisited(path: string): void {
    const raw = localStorage.getItem(VISITED_KEY);
    let visited: { path: string }[] = raw ? JSON.parse(raw) : [];

    // Remove if already exists so we can re-insert at top
    visited = visited.filter(v => v.path !== path);

    // Add to top
    visited.unshift({ path });

    // Keep max 10
    if (visited.length > 10) visited.pop();

    localStorage.setItem(VISITED_KEY, JSON.stringify(visited));
    console.log('visited list:', visited); // verify
  }

  onMenuToggle(event: MouseEvent): void {
  this.collapsed.set(!this.collapsed());
  (event.currentTarget as HTMLButtonElement).blur();
}

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
    console.log('Search query:', this.searchQuery());
  }
}
