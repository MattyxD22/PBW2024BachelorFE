import { ChangeDetectionStrategy, Component, HostListener, inject, OnInit } from '@angular/core';
import { UserSideComponent } from '../user-side-component/user-side.component';
import { DataSideComponent } from '../data-side/data-side.component';
import { CommonModule } from '@angular/common';
import { MHeaderComponent } from "../m-header/m-header.component";
import { DeviceTypeStore } from '../../stores/deviceTypes.store';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [UserSideComponent, DataSideComponent, CommonModule, MHeaderComponent],
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
    console.log(width, this.deviceTypeStore.getDevice()); // Log width and device type
    this.deviceTypeStore.updateDeviceType(width); // Update device type
    console.log(this.deviceTypeStore.isDesktop())
  }

  fallBackDeviceType(): number {
    // Check if running in a browser environment
    if (typeof navigator !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase(); // Access navigator only if it exists

      if (userAgent.includes('android') || userAgent.includes('iphone')) {
        return 640; // Mobile fallback width
      } else if (userAgent.includes('ipad')) {
        return 768; // iPad fallback width
      } else { // Return desktop value instead
        return 1280; // Desktop fallback width
      } 
    } else {
      // Fallback width for server-side rendering or other environments without navigator
      return 1280; // Default to desktop width
    }
  }

}
