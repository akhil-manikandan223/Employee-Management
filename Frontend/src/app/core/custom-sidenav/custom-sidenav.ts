import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-custom-sidenav',
  imports: [
    RouterLink,
    MatIconModule,
    MatTooltipModule,
    RouterLinkActive,
  ],
  templateUrl: './custom-sidenav.html',
  styleUrl: './custom-sidenav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSidenav {
  collapsed = input(false);
  menuSelected = output<void>();

  onNavItemClick(): void {
    this.menuSelected.emit();
  }

  menuGroups: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' }
    ]
  },
  {
    title: 'Master Data',
    items: [
      { icon: 'warehouse', label: 'Warehouses', route: '/warehouses' },
      { icon: 'location_on', label: 'Locations', route: '/locations' },
      { icon: 'local_shipping', label: 'Shipment Types', route: '/shipment-types' },
      { icon: 'assignment', label: 'Product Master', route: '/product-master' }
    ]
  },
  {
    title: 'Stores & Spares',
    items: [
      { icon: 'directions_boat', label: 'Ship Spares', route: '/ship-spares' },
      { icon: 'anchor', label: 'Marine Products', route: '/marine-products' }
    ]
  }
];
}
