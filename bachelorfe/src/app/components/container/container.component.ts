import { ChangeDetectionStrategy, Component, HostListener, inject, OnInit } from '@angular/core';
import { UserSideComponent } from '../user-side-component/user-side.component';
import { CommonModule } from '@angular/common';
import { MHeaderComponent } from "../m-header/m-header.component";
import { DeviceTypeStore } from '../../stores/deviceTypes.store';
import { DataSideComponent } from '../data-side/data-side.component';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [UserSideComponent, CommonModule, MHeaderComponent, DataSideComponent],
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'], // Fixed typo from styleUrl to styleUrls
  changeDetection: ChangeDetectionStrategy.OnPush, // Optional: Set ChangeDetection strategy if desired
})
export class ContainerComponent implements OnInit {
  
  readonly deviceTypeStore = inject(DeviceTypeStore); // Injecting DeviceTypeStore directly

  ngOnInit() {
    this.onResize(); // Initialize device type on load
  }

  // Listen for window resize events
  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) { 
    const width = event ? (event.target as Window).innerWidth : this.fallBackDeviceType(); // Default width
    this.deviceTypeStore.updateDeviceType(width);
  }

  fallBackDeviceType(): number {
    if (typeof navigator !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase();

      if (userAgent.includes('android') || userAgent.includes('iphone')) {
        return 640; 
      } else if (userAgent.includes('ipad')) {
        return 768; 
      } else { 
        return 1280; // Desktop fallback width
      } 
    } else {
     
      return 1280;
    }
  }

}
